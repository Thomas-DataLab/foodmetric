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
  metadataBase: new URL("https://foodmetric.vercel.app"),
  title: "FoodMetric — Radar Săn Deal & Món Ăn Vặt Hot TikTok Shop",
  description:
    "Bảng xếp hạng món ăn vặt nổ đơn nhất TikTok Shop Việt Nam. Bóc tách doanh thu 24h, video viral triệu view và săn deal giảm 20% - 50% cùng Kênh Food Lén Lút.",
  keywords: [
    "đồ ăn vặt tiktok",
    "bánh tráng phơi sương",
    "bánh pía lava",
    "săn deal tiktok shop",
    "food lén lút",
    "món ăn vặt hot trend",
  ],
  openGraph: {
    title: "FoodMetric — Top Món Ăn Vặt Nổ Đơn Nhất TikTok Shop Hôm Nay",
    description:
      "Bóc tách doanh thu 24h, video viral triệu view & săn deal giảm 20% - 50% cùng Food Lén Lút.",
    url: "https://foodmetric.vercel.app",
    siteName: "FoodMetric",
    images: [
      {
        url: "/images/og-card.png",
        width: 1200,
        height: 630,
        alt: "FoodMetric OpenGraph",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodMetric — Top Món Ăn Vặt Nổ Đơn Nhất TikTok Shop Hôm Nay",
    description: "Bóc tách doanh số 24h & deal ăn vặt cực hời TikTok Shop.",
    images: ["/images/og-card.png"],
  },
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
