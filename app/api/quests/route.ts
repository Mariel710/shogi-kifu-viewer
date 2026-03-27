import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const CreateQuestSchema = z.object({
  name: z.string().min(1).max(200),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  category: z
    .enum(['守る', '回してる', '積む', '着手する'])
    .nullable()
    .optional(),
  sort_order: z.number().int().optional(),
});

const BulkCreateSchema = z.object({
  quests: z.array(CreateQuestSchema).min(1).max(50),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ quests: data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  // Support both single quest and bulk creation
  if (Array.isArray(body.quests)) {
    const parsed = BulkCreateSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const records = parsed.data.quests.map((q, i) => ({
      ...q,
      user_id: user.id,
      sort_order: q.sort_order ?? i,
    }));

    const { data, error } = await supabase
      .from('quests')
      .insert(records)
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ quests: data }, { status: 201 });
  }

  const parsed = CreateQuestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('quests')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ quest: data }, { status: 201 });
}
