import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Search, Check, Package, Truck, Home, ClipboardCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { orderStatusLabels, orderStatusColors, formatPrice } from '@/lib/utils';

const statusSteps = [
  { key: 'pending', label: 'سفارش ثبت شد', icon: ClipboardCheck },
  { key: 'processing', label: 'در حال پردازش', icon: Package },
  { key: 'shipped', label: 'ارسال شد', icon: Truck },
  { key: 'delivered', label: 'تحویل داده شد', icon: Home },
];

export default function TrackOrder() {
  const [trackingCode, setTrackingCode] = useState('');
  const [result, setResult] = useState<ReturnType<typeof findOrder> | null>(null);
  const { orders } = useApp();

  function findOrder(code: string) {
    return orders.find(o => o.tracking_code === code);
  }

  const handleTrack = () => {
    if (!trackingCode.trim()) return;
    const order = findOrder(trackingCode.trim());
    setResult(order || null);
  };

  const getStepStatus = (stepKey: string, orderStatus: string) => {
    const stepIndex = statusSteps.findIndex(s => s.key === stepKey);
    const orderIndex = statusSteps.findIndex(s => s.key === orderStatus);
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-amber-600">خانه</Link>
            <span>/</span>
            <span>پیگیری سفارش</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">پیگیری سفارش</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Search */}
        <div className="flex gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={trackingCode}
              onChange={e => setTrackingCode(e.target.value)}
              placeholder="کد پیگیری را وارد کنید (مثلاً: TRK202507030001)"
              className="w-full h-14 pr-12 pl-4 bg-slate-50 border border-slate-200 rounded-xl text-base"
            />
          </div>
          <button
            onClick={handleTrack}
            className="h-14 px-8 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors"
          >
            پیگیری
          </button>
        </div>

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-500">کد پیگیری</p>
                  <p className="text-lg font-bold font-mono">{result.tracking_code}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${orderStatusColors[result.status]}`}>
                  {orderStatusLabels[result.status]}
                </span>
              </div>
              <p className="text-sm text-slate-500">تاریخ سفارش: {new Date(result.created_at).toLocaleDateString('fa-IR')}</p>
              <p className="text-sm text-slate-500">تحویل تخمینی: {new Date(result.estimated_delivery).toLocaleDateString('fa-IR')}</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {statusSteps.map((step, i) => {
                const stepStatus = getStepStatus(step.key, result.status);
                return (
                  <div key={step.key} className="flex items-start gap-4 mb-6 last:mb-0">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        stepStatus === 'completed' ? 'bg-amber-600 text-white' :
                        stepStatus === 'current' ? 'bg-amber-600 text-white ring-4 ring-amber-100' :
                        'bg-slate-200 text-slate-400'
                      }`}>
                        {stepStatus === 'completed' ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${stepStatus === 'completed' ? 'bg-amber-600' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="pt-2">
                      <p className={`font-medium ${stepStatus === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>{step.label}</p>
                      {result.status_history.find(h => h.status === step.key) && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(result.status_history.find(h => h.status === step.key)!.date).toLocaleDateString('fa-IR')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Items */}
            <div className="mt-8">
              <h3 className="font-semibold mb-3">محصولات سفارش</h3>
              {result.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 mb-2">
                  <img src={item.image} alt="" className="w-12 h-12 object-contain bg-white rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between mt-3 pt-3 border-t border-slate-200">
                <span className="font-semibold">مبلغ کل</span>
                <span className="font-bold text-amber-600">{formatPrice(result.final_price)}</span>
              </div>
            </div>
          </motion.div>
        )}

        {result === null && trackingCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <p className="text-red-500 font-medium">سفارشی با این کد پیگیری یافت نشد</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
