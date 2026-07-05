export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  base_price: number;
  stock: number;
  sales_count: number;
  images: string[];
  specifications: Record<string, string>;
  colors: ProductColor[];
  videos: string[];
  is_featured: boolean;
  condition: 'new' | 'used';
  created_at: string;
  rating?: number;
  rating_count?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  price: number;
  image: string;
}

export interface Brand {
  id: number;
  name: string;
  logo_url: string;
  description: string;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  image: string;
  brand: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Order {
  id: number;
  tracking_code: string;
  items: CartItem[];
  shipping_info: ShippingInfo;
  payment_method: string;
  total_price: number;
  shipping_cost: number;
  final_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status_history: StatusHistoryItem[];
  estimated_delivery: string;
  created_at: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  notes?: string;
}

export interface StatusHistoryItem {
  status: string;
  date: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  avatar_url?: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_percent: number;
  uses: number;
  max_uses: number;
  expires_at: string;
}

export interface WishlistItem {
  product_id: number;
  color?: string;
  added_at: string;
}

export interface CompareItem {
  product_id: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
}

export type SortOption = 'newest' | 'price_low' | 'price_high' | 'bestselling';
