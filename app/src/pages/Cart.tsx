import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, Tag, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart, applyCoupon } = useApp();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const shippingCost = cartTotal > 2000000 ? 0 : 50000;

  const handleApplyCoupon = () => {
    const coupon = applyCoupon(couponCode);
    if (coupon) {
      setAppliedCoupon({ code: coupon.code, discount: coupon.discount_percent });
    }
  };

  const discountAmount = appliedCoupon ? Math.round(cartTotal * appliedCoupon.discount / 100) : 0;
  const finalTotal = cartTotal + shippingCost - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">سبد خرید شما خالی است</h2>
          <p className="text-slate-500 mt-2">محصولات مورد نظر خود را به سبد اضافه کنید</p>
          <Link to="/products" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700">
            <ArrowLeft className="w-5 h-5" />
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-amber-600">خانه</Link>
            <span>/</span>
            <span>سبد خرید</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">سبد خرید</h1>
            <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
              <Trash2 className="w-4 h-4" />
              پاک کردن سبد
            </button>
          </div>
          <p className="text-slate-500 mt-1">{cart.length} کالا</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1 space-y-4">
            {cart.map((item, i) => (
              <motion.div
                key={`${item.product_id}_${item.color}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4"
              >
                <Link to={`/products/${item.product_id}`} className="w-24 h-24 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product_id}`} className="text-sm font-semibold text-slate-800 line-clamp-1 hover:text-amber-600">
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-500 mt-0.5">{item.brand}</p>
                  {item.color && <p className="text-xs text-slate-500">رنگ: {item.color}</p>}
                  <p className="text-sm font-bold text-amber-600 mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product_id, item.color)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.product_id, item.color, item.quantity - 1)}
                      className="p-2 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product_id, item.color, item.quantity + 1)}
                      className="p-2 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-80 shrink-0"
          >
            <div className="bg-slate-50 rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">خلاصه سفارش</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">جمع کل</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">هزینه ارسال</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف ({appliedCoupon.discount}٪)</span>
                    <span className="font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Coupon */}
              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="کد تخفیف"
                    className="w-full h-10 pr-9 pl-4 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 h-10 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
                >
                  اعمال
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between text-sm text-green-600">
                  <span>کد {appliedCoupon.code} اعمال شد</span>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-red-500">حذف</button>
                </div>
              )}

              <div className="border-t border-slate-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">مبلغ قابل پرداخت</span>
                  <span className="text-xl font-bold text-amber-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout', { state: { coupon: appliedCoupon, discountAmount } })}
                className="w-full mt-4 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                ادامه جهت تسویه حساب
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
