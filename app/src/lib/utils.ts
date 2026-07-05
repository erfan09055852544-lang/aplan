import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNum(num: number | string): string {
  return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
}

export function formatPrice(price: number): string {
  const formatted = price.toLocaleString('fa-IR');
  return `${formatted} تومان`;
}

export function formatPriceWithDiscount(price: number, discountPercent: number): { final: number; formatted: string } {
  const final = Math.round(price * (100 - discountPercent) / 100);
  return { final, formatted: formatPrice(final) };
}

export function generateTrackingCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK${date}${random}`;
}

export function getProductRating(productId: number, reviews: Array<{ product_id: number; rating: number }>): { average: number; count: number } {
  const productReviews = reviews.filter(r => r.product_id === productId);
  if (productReviews.length === 0) return { average: 0, count: 0 };
  const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  return { average: Math.round(avg * 10) / 10, count: productReviews.length };
}

export const orderStatusLabels: Record<string, string> = {
  pending: 'در انتظار',
  processing: 'در حال پردازش',
  shipped: 'ارسال شد',
  delivered: 'تحویل داده شد',
  cancelled: 'لغو شد',
};

export const orderStatusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
