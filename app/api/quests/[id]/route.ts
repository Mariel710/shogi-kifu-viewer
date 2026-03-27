import { createClient } from '@/lib/supabase/server';
import { getXpReward, getRpReward, getLevelFromXp } from '@/lib/quests/xp';
import { z } from 'zod';
import type { Difficulty } from '@/types';

const UpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  category: z
    .enum(['守る', '回してる', '積む', '着手する'])
    .nullable()
    .optional(),
  done: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates = parsed.data;

  // Handle completion with XP/RP award
  if (updates.done === true) {
    const { data: quest } = await supabase
      .from('quests')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!quest) {
      return Response.json({ error: 'Quest not found' }, { status: 404 });
    }

    const xpEarned = getXpReward(quest.difficulty as Difficulty);
    const rpEarned = getRpReward(quest.difficulty as Difficulty);

    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, rp, level, total_tasks, streak')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    const newXp = profile.xp + xpEarned;
    const newLevel = getLevelFromXp(newXp);
    const levelChanged = newLevel > profile.level;

    await supabase
      .from('profiles')
      .update({
        xp: newXp,
        rp: profile.rp + rpEarned,
        level: newLevel,
        total_tasks: profile.total_tasks + 1,
      })
      .eq('id', user.id);

    const { data: updatedQuest } = await supabase
      .from('quests')
      .update({ done: true })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    return Response.json({
      quest: updatedQuest,
      xp_earned: xpEarned,
      rp_earned: rpEarned,
      new_xp: newXp,
      new_rp: profile.rp + rpEarned,
      level_changed: levelChanged,
      new_level: newLevel,
    });
  }

  const { data: updatedQuest, error } = await supabase
    .from('quests')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ quest: updatedQuest });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('quests')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
