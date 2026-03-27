import { createClient } from '@/lib/supabase/server';
import { getXpReward, getRpReward, getLevelFromXp } from '@/lib/quests/xp';
import type { Difficulty } from '@/types';

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: quest } = await supabase
    .from('quests')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!quest) {
    return Response.json({ error: 'Quest not found' }, { status: 404 });
  }

  if (!quest.done) {
    return Response.json({ error: 'Quest is not completed' }, { status: 400 });
  }

  const xpReverted = getXpReward(quest.difficulty as Difficulty);
  const rpReverted = getRpReward(quest.difficulty as Difficulty);

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, rp, level, total_tasks')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  const newXp = Math.max(0, profile.xp - xpReverted);
  const newRp = Math.max(0, profile.rp - rpReverted);
  const newLevel = getLevelFromXp(newXp);
  const levelChanged = newLevel < profile.level;

  await supabase
    .from('profiles')
    .update({
      xp: newXp,
      rp: newRp,
      level: newLevel,
      total_tasks: Math.max(0, profile.total_tasks - 1),
    })
    .eq('id', user.id);

  const { data: updatedQuest } = await supabase
    .from('quests')
    .update({ done: false })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  return Response.json({
    quest: updatedQuest,
    xp_reverted: xpReverted,
    rp_reverted: rpReverted,
    new_xp: newXp,
    new_rp: newRp,
    level_changed: levelChanged,
  });
}
