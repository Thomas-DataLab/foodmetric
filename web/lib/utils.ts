import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    const b = (amount / 1_000_000_000).toFixed(2).replace(".", ",");
    return `${b} tỷ ₫`;
  }
  if (amount >= 1_000_000) {
    const m = (amount / 1_000_000).toFixed(1).replace(".", ",");
    return `${m} tr ₫`;
  }
  if (amount >= 1_000) {
    const k = (amount / 1_000).toFixed(0);
    return `${k}k ₫`;
  }
  return formatVND(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(".", ",")}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(".", ",")}k`;
  }
  return formatNumber(num);
}
