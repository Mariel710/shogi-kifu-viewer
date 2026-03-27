import { createClient } from '@/lib/supabase/server';
import { generateTasks } from '@/lib/ai/generate-tasks';
import { z } from 'zod';

const RequestSchema = z.object({
  goal: z.string().min(1).max(500),
  context: z.string().max(1000).optional(),
  count: z.number().int().min(1).max(20).default(7),
  difficulty: z
    .enum(['easy', 'medium', 'hard', 'mixed'])
    .default('mixed'),
});

const AI_LIMIT = { free: 5, pro: 100 } as const;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('subscription_tier, ai_calls_used, ai_calls_reset_at')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Reset monthly counter if expired
  if (new Date(profile.ai_calls_reset_at) < new Date()) {
    await supabase
      .from('profiles')
      .update({
        ai_calls_used: 0,
        ai_calls_reset_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })
      .eq('id', user.id);
    profile.ai_calls_used = 0;
  }

  const tier = profile.subscription_tier as 'free' | 'pro';
  const limit = AI_LIMIT[tier];

  if (profile.ai_calls_used >= limit) {
    return Response.json(
      {
        error: 'AI使用回数の上限に達しました',
        upgrade: tier === 'free',
      },
      { status: 429 }
    );
  }

  const tasks = await generateTasks(
    parsed.data.goal,
    parsed.data.context,
    parsed.data.count
  );

  await supabase
    .from('profiles')
    .update({ ai_calls_used: profile.ai_calls_used + 1 })
    .eq('id', user.id);

  return Response.json({
    tasks,
    ai_calls_remaining: limit - profile.ai_calls_used - 1,
  });
}
