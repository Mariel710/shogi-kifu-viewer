'use client';

import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    alert('メールを送信しました。リンクをクリックしてログインしてください。');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#f0a030]">QUEST BOARD</h1>
          <p className="text-gray-400 mt-1">冒険を始めるにはログインしてください</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          Googleでログイン
        </button>

        <div className="relative">
          <hr className="border-gray-700" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b0f1a] px-2 text-gray-500 text-sm">
            または
          </span>
        </div>

        <form onSubmit={handleMagicLink} className="space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="メールアドレス"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#f0a030]"
          />
          <button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            マジックリンクを送信
          </button>
        </form>
      </div>
    </main>
  );
}
