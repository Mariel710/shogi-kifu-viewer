import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QUEST BOARD',
  description: 'AIがクエストを生成するタスク管理RPG',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'QUEST BOARD',
  },
};

export const viewport: Viewport = {
  themeColor: '#f0a030',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0b0f1a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
