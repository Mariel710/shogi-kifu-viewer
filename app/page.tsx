import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-5xl font-bold text-[#f0a030] mb-4">QUEST BOARD</h1>
      <p className="text-lg text-gray-300 mb-2">AIがクエストを生成するタスク管理RPG</p>
      <p className="text-sm text-gray-500 mb-10">
        目標を入力するだけで、AIが今日やるべきクエストを生成します
      </p>
      <Link
        href="/login"
        className="bg-[#f0a030] hover:bg-[#e09020] text-black font-bold py-3 px-8 rounded-lg transition-colors"
      >
        冒険を始める
      </Link>
    </main>
  );
}
