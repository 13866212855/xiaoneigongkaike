import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_SC, Noto_Serif_SC, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui-sans',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-zh-sans',
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-zh-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: '校内公开课材料工作台',
  description: '教师评高级职称校内公开课全套材料一键生成、差异化样例智能编写、A4精准打印与Word导出工具。',
  openGraph: {
    title: '校内公开课材料工作台',
    description: '教师评高级职称校内公开课全套材料一键生成、差异化样例智能编写、A4精准打印与Word导出工具。',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '校内公开课材料工作台',
    description: '教师评高级职称校内公开课全套材料一键生成、差异化样例智能编写、A4精准打印与Word导出工具。',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${plusJakarta.variable} ${notoSansSC.variable} ${notoSerifSC.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="font-sans antialiased bg-slate-100 text-slate-900 selection:bg-slate-900 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
