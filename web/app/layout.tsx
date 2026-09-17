import type { Metadata, Viewport } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoodMetric — Radar Sản Phẩm Ăn Vặt Hot TikTok Shop",
  description:
    "Bảng xếp hạng doanh số, velocity và radar sản phẩm ăn vặt bùng nổ trên TikTok Shop Việt Nam theo thời gian thực.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${lexend.variable}`}>
      <body className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
        {children}
      </body>
    </html>
  );
}
