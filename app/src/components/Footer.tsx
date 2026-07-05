import { Link } from 'react-router';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-extrabold text-amber-600">وین موبایل</Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              تجربه‌ای متفاوت از خرید موبایل. آخرین مدل‌ها با بهترین قیمت و ضمانت اصالت کالا.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">راهنمای خرید</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">نحوه ثبت سفارش</Link></li>
              <li><Link to="/products" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">شرایط گارانتی</Link></li>
              <li><Link to="/products" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">راهنمای انتخاب گوشی</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2">
              <li><Link to="/track-order" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">پیگیری سفارش</Link></li>
              <li><Link to="/about" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">شرایط بازگشت کالا</Link></li>
              <li><Link to="/about" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">سوالات متداول</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">تماس با ما</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                تهران، خیابان جمهوری، پاساژ علاءالدین
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="w-4 h-4 shrink-0 text-amber-600" />
                ۰۲۱-۱۲۳۴۵۶۷۸
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4 shrink-0 text-amber-600" />
                info@vinmobile.ir
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                شنبه تا پنجشنبه: ۹ صبح تا ۹ شب
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-center text-xs text-slate-400">
            تمامی حقوق محفوظ است. وین موبایل ۱۴۰۳
          </p>
        </div>
      </div>
    </footer>
  );
}
