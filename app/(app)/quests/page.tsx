import { createClient } from '@/lib/supabase/server';

export default async function QuestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  const { data: quests } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', user!.id)
    .order('sort_order', { ascending: true });

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#f0a030]">クエストボード</h1>
        {profile && (
          <p className="text-sm text-gray-400 mt-1">
            Lv.{profile.level} — {profile.xp} XP — {profile.rp} RP
          </p>
        )}
      </div>

      {!quests || quests.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          クエストがありません。追加してください。
        </p>
      ) : (
        <ul className="space-y-3">
          {quests.map((quest) => (
            <li
              key={quest.id}
              className="bg-gray-800 rounded-lg px-4 py-3 flex items-center gap-3"
            >
              <span className="flex-1 text-sm">{quest.name}</span>
              <span className="text-xs text-gray-400">{quest.difficulty}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
