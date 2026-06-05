import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "命格修仙人生模拟器",
  description: "命格修仙人生模拟器，一个娱乐向武侠修仙人生选择网页游戏。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
