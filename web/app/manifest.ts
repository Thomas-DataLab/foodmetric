import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FoodMetric — Săn Deal & Món Ăn Vặt Hot TikTok Shop",
    short_name: "FoodMetric",
    description:
      "Bảng xếp hạng món ăn vặt nổ đơn nhất TikTok Shop Việt Nam. Bóc tách doanh thu 24h, video viral triệu view và săn deal giảm 20% - 50% cùng Kênh Food Lén Lút.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#EA580C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
