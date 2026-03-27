import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import TabBar from '@/components/common/TabBar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">{children}</main>
      <TabBar />
    </div>
  );
}
