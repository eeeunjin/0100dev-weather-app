import type { Metadata } from "next";
import localFont from "next/font/local";
import { FavoritesHydrator } from "@/components/FavoritesHydrator";
import { Header } from "@/components/Header";
import "./globals.css";

const elevenStreetGothic = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    {
      path: "../assets/fonts/11STREET_Gothic_light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/11STREET_Gothic_regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/11STREET_Gothic_bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "날씨 좋다",
  description: "도시별 날씨 조회 및 관심 도시 저장 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${elevenStreetGothic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-muted/40">
        <FavoritesHydrator />
        <div className="mx-auto flex min-h-full w-full max-w-[393px] flex-col bg-background shadow-xl">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
