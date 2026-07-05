import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CartItem, WishlistItem, User, Order, Review, Address, Coupon } from '@/types';

interface AppState {
  // Auth
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, phone: string) => boolean;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, color?: string) => void;
  updateCartQuantity: (productId: number, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (productId: number, color?: string) => void;
  removeFromWishlist: (productId: number, color?: string) => void;
  isInWishlist: (productId: number, color?: string) => boolean;

  // Compare
  compare: number[];
  addToCompare: (productId: number) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isInCompare: (productId: number) => boolean;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;

  // Addresses
  addresses: Address[];
  addAddress: (address: Address) => void;
  removeAddress: (id: number) => void;

  // Coupons
  coupons: Coupon[];
  applyCoupon: (code: string) => Coupon | null;

  // Recently viewed
  recentlyViewed: number[];
  addRecentlyViewed: (productId: number) => void;

  // Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEYS = {
  user: 'vin_user',
  cart: 'vin_cart',
  wishlist: 'vin_wishlist',
  compare: 'vin_compare',
  orders: 'vin_orders',
  reviews: 'vin_reviews',
  addresses: 'vin_addresses',
  recentlyViewed: 'vin_recently_viewed',
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage(STORAGE_KEYS.user, null));
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => loadFromStorage(STORAGE_KEYS.wishlist, []));
  const [compare, setCompare] = useState<number[]>(() => loadFromStorage(STORAGE_KEYS.compare, []));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage(STORAGE_KEYS.orders, []));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage(STORAGE_KEYS.reviews, []));
  const [addresses, setAddresses] = useState<Address[]>(() => loadFromStorage(STORAGE_KEYS.addresses, []));
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => loadFromStorage(STORAGE_KEYS.recentlyViewed, []));
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEYS.user, user); }, [user]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.cart, cart); }, [cart]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.wishlist, wishlist); }, [wishlist]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.compare, compare); }, [compare]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.orders, orders); }, [orders]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.reviews, reviews); }, [reviews]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.addresses, addresses); }, [addresses]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.recentlyViewed, recentlyViewed); }, [recentlyViewed]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  // Auth
  const login = useCallback((email: string, password: string) => {
    const users = loadFromStorage<{ email: string; password: string; name: string; phone: string }[]>('vin_users', []);
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const newUser: User = { id: Date.now(), name: found.name, email: found.email, phone: found.phone, role: 'user' };
      setUser(newUser);
      showToast('ورود با موفقیت انجام شد', 'success');
      return true;
    }
    // Demo accounts
    if (email === 'admin@mobile-shop.com' && password === 'admin123') {
      setUser({ id: 1, name: 'مدیر اصلی', email, phone: '09123456789', role: 'admin' });
      showToast('ورود با موفقیت انجام شد', 'success');
      return true;
    }
    if (email === 'user@example.com' && password === 'user123') {
      setUser({ id: 2, name: 'کاربر آزمایشی', email, phone: '09123456788', role: 'user' });
      showToast('ورود با موفقیت انجام شد', 'success');
      return true;
    }
    showToast('ایمیل یا رمز عبور اشتباه است', 'error');
    return false;
  }, [showToast]);

  const register = useCallback((name: string, email: string, password: string, phone: string) => {
    const users = loadFromStorage<{ email: string; password: string; name: string; phone: string }[]>('vin_users', []);
    if (users.some(u => u.email === email)) {
      showToast('این ایمیل قبلاً ثبت شده است', 'error');
      return false;
    }
    users.push({ email, password, name, phone });
    saveToStorage('vin_users', users);
    const newUser: User = { id: Date.now(), name, email, phone, role: 'user' };
    setUser(newUser);
    showToast('ثبت‌نام با موفقیت انجام شد', 'success');
    return true;
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    showToast('با موفقیت خارج شدید', 'info');
  }, [showToast]);

  // Cart
  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const key = `${item.product_id}_${item.color || ''}`;
      const existing = prev.find(c => `${c.product_id}_${c.color || ''}` === key);
      if (existing) {
        return prev.map(c => `${c.product_id}_${c.color || ''}` === key ? { ...c, quantity: c.quantity + item.quantity } : c);
      }
      return [...prev, item];
    });
    showToast('محصول به سبد خرید اضافه شد', 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId: number, color?: string) => {
    setCart(prev => prev.filter(c => !(c.product_id === productId && c.color === color)));
    showToast('محصول از سبد خرید حذف شد', 'info');
  }, [showToast]);

  const updateCartQuantity = useCallback((productId: number, color: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart(prev => prev.map(c => (c.product_id === productId && c.color === color) ? { ...c, quantity } : c));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const addToWishlist = useCallback((productId: number, color?: string) => {
    setWishlist(prev => {
      if (prev.some(w => w.product_id === productId && w.color === color)) {
        showToast('محصول قبلاً در علاقه‌مندی‌ها وجود دارد', 'info');
        return prev;
      }
      showToast('به علاقه‌مندی‌ها اضافه شد', 'success');
      return [...prev, { product_id: productId, color, added_at: new Date().toISOString() }];
    });
  }, [showToast]);

  const removeFromWishlist = useCallback((productId: number, color?: string) => {
    setWishlist(prev => prev.filter(w => !(w.product_id === productId && w.color === color)));
    showToast('از علاقه‌مندی‌ها حذف شد', 'info');
  }, [showToast]);

  const isInWishlist = useCallback((productId: number, color?: string) => {
    return wishlist.some(w => w.product_id === productId && w.color === color);
  }, [wishlist]);

  // Compare
  const addToCompare = useCallback((productId: number) => {
    setCompare(prev => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 4) {
        showToast('حداکثر ۴ محصول می‌توانید مقایسه کنید', 'error');
        return prev;
      }
      showToast('به مقایسه اضافه شد', 'success');
      return [...prev, productId];
    });
  }, [showToast]);

  const removeFromCompare = useCallback((productId: number) => {
    setCompare(prev => prev.filter(id => id !== productId));
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const isInCompare = useCallback((productId: number) => compare.includes(productId), [compare]);

  // Orders
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    clearCart();
    showToast(`سفارش شما با کد پیگیری ${order.tracking_code} ثبت شد`, 'success');
  }, [clearCart, showToast]);

  // Reviews
  const addReview = useCallback((review: Review) => {
    setReviews(prev => [review, ...prev]);
    showToast('نظر شما با موفقیت ثبت شد', 'success');
  }, [showToast]);

  // Addresses
  const addAddress = useCallback((address: Address) => {
    setAddresses(prev => [...prev, address]);
    showToast('آدرس اضافه شد', 'success');
  }, [showToast]);

  const removeAddress = useCallback((id: number) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('آدرس حذف شد', 'info');
  }, [showToast]);

  // Coupons
  const coupons: Coupon[] = [
    { id: 1, code: 'WELCOME10', discount_percent: 10, uses: 0, max_uses: 100, expires_at: '2026-12-31' },
    { id: 2, code: 'SUMMER20', discount_percent: 20, uses: 0, max_uses: 50, expires_at: '2026-09-01' },
  ];

  const applyCoupon = useCallback((code: string): Coupon | null => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) {
      showToast('کد تخفیف یافت نشد', 'error');
      return null;
    }
    showToast(`کد تخفیف ${coupon.discount_percent}٪ اعمال شد`, 'success');
    return coupon;
  }, [showToast, coupons]);

  // Recently viewed
  const addRecentlyViewed = useCallback((productId: number) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  const value: AppState = {
    user, login, register, logout,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartCount,
    wishlist, addToWishlist, removeFromWishlist, isInWishlist,
    compare, addToCompare, removeFromCompare, clearCompare, isInCompare,
    orders, addOrder,
    reviews, addReview,
    addresses, addAddress, removeAddress,
    coupons, applyCoupon,
    recentlyViewed, addRecentlyViewed,
    toast, showToast, clearToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
