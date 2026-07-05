import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, ArrowRight, CreditCard, Banknote } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatPrice, generateTrackingCode } from '@/lib/utils';
import type { Order } from '@/types';

type Step = 'shipping' | 'payment' | 'confirm';

const steps: { key: Step; label: string }[] = [
  { key: 'shipping', label: 'اطلاعات ارسال' },
  { key: 'payment', label: 'روش پرداخت' },
  { key: 'confirm', label: 'تکمیل سفارش' },
];

const paymentMethods = [
  { key: 'card', label: 'کارت به کارت', icon: CreditCard, desc: 'انتقال به شماره حساب فروشگاه' },
  { key: 'online', label: 'پرداخت آنلاین', icon: CreditCard, desc: 'پرداخت امن با درگاه بانکی' },
  { key: 'cod', label: 'پرداخت در محل', icon: Banknote, desc: 'پرداخت هنگام تحویل کالا' },
];

export default function Checkout() {
  const { cart, cartTotal, addOrder, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const couponDiscount = (location.state as { discountAmount?: number })?.discountAmount || 0;
  const [step, setStep] = useState<Step>('shipping');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    province: '',
    city: '',
    address: '',
    postal_code: '',
    notes: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const shippingCost = cartTotal > 2000000 ? 0 : 50000;
  const finalTotal = cartTotal + shippingCost - couponDiscount;

  const handleNext = () => {
    if (step === 'shipping') setStep('payment');
    else if (step === 'payment') setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'payment') setStep('shipping');
    else if (step === 'confirm') setStep('payment');
  };

  const handleSubmitOrder = () => {
    const tracking = generateTrackingCode();
    const order: Order = {
      id: Date.now(),
      tracking_code: tracking,
      items: [...cart],
      shipping_info: { ...shippingInfo },
      payment_method: paymentMethods.find(m => m.key === paymentMethod)?.label || '',
      total_price: cartTotal,
      shipping_cost: shippingCost,
      final_price: finalTotal,
      status: 'pending',
      status_history: [{ status: 'pending', date: new Date().toISOString(), description: 'سفارش ثبت شد' }],
      estimated_delivery: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
    };
    addOrder(order);
    setTrackingCode(tracking);
    setOrderPlaced(true);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold">سبد خرید شما خالی است</h2>
          <button onClick={() => navigate('/products')} className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg">مشاهده محصولات</button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">سفارش شما با موفقیت ثبت شد</h2>
          <p className="text-slate-500 mt-2">کد پیگیری سفارش شما:</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-mono">{trackingCode}</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => navigate('/track-order')} className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              پیگیری سفارش
            </button>
            <button onClick={() => navigate('/')} className="px-6 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50">
              بازگشت به فروشگاه
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const stepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  i < stepIndex ? 'bg-amber-600 text-white' : i === stepIndex ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {i < stepIndex ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs mt-1.5 ${i === stepIndex ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-16 h-0.5 ${i < stepIndex ? 'bg-amber-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-bold mb-6">اطلاعات ارسال</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="نام و نام خانوادگی *" value={shippingInfo.name} onChange={e => setShippingInfo({ ...shippingInfo, name: e.target.value })} className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                <input type="tel" placeholder="شماره موبایل *" value={shippingInfo.phone} onChange={e => setShippingInfo({ ...shippingInfo, phone: e.target.value })} className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                <input type="email" placeholder="ایمیل" value={shippingInfo.email} onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })} className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                <input type="text" placeholder="استان *" value={shippingInfo.province} onChange={e => setShippingInfo({ ...shippingInfo, province: e.target.value })} className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                <input type="text" placeholder="شهر *" value={shippingInfo.city} onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })} className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                <input type="text" placeholder="کد پستی *" value={shippingInfo.postal_code} onChange={e => setShippingInfo({ ...shippingInfo, postal_code: e.target.value })} className="h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                <textarea placeholder="آدرس کامل *" value={shippingInfo.address} onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })} rows={3} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none sm:col-span-2" />
                <textarea placeholder="توضیحات سفارش (اختیاری)" value={shippingInfo.notes} onChange={e => setShippingInfo({ ...shippingInfo, notes: e.target.value })} rows={2} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none sm:col-span-2" />
              </div>
              <button onClick={handleNext} className="w-full mt-6 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 flex items-center justify-center gap-2">
                بعدی
                <ArrowLeft className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-bold mb-6">روش پرداخت</h2>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.key}
                    onClick={() => setPaymentMethod(method.key)}
                    className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-right ${
                      paymentMethod === method.key ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <method.icon className={`w-8 h-8 ${paymentMethod === method.key ? 'text-amber-600' : 'text-slate-400'}`} />
                    <div>
                      <p className="font-semibold text-slate-800">{method.label}</p>
                      <p className="text-sm text-slate-500">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="flex-1 py-3.5 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  قبلی
                </button>
                <button onClick={handleNext} className="flex-1 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 flex items-center justify-center gap-2">
                  بعدی
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-bold mb-6">تأیید سفارش</h2>

              <div className="bg-slate-50 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-sm text-slate-700">محصولات</h3>
                {cart.map(item => (
                  <div key={`${item.product_id}_${item.color}`} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity} عدد</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">ارسال</span><span>{shippingCost === 0 ? 'رایگان' : formatPrice(shippingCost)}</span></div>
                  {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>تخفیف</span><span>-{formatPrice(couponDiscount)}</span></div>}
                  <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-200">
                    <span>مبلغ قابل پرداخت</span>
                    <span className="text-amber-600">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="flex-1 py-3.5 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 flex items-center justify-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  قبلی
                </button>
                <button onClick={handleSubmitOrder} className="flex-1 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 flex items-center justify-center gap-2">
                  ثبت سفارش
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
