import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Login() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!form.email || !form.password) { setError('لطفاً همه فیلدها را پر کنید'); return; }
      const success = login(form.email, form.password);
      if (success) navigate('/');
    } else {
      if (!form.name || !form.email || !form.password) { setError('لطفاً همه فیلدها را پر کنید'); return; }
      if (form.password !== form.confirmPassword) { setError('رمز عبور و تکرار آن مطابقت ندارند'); return; }
      if (form.password.length < 4) { setError('رمز عبور باید حداقل ۴ کاراکتر باشد'); return; }
      const success = register(form.name, form.email, form.password, form.phone);
      if (success) navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold text-amber-600">وین موبایل</Link>
          <p className="text-slate-500 mt-2">{isLogin ? 'به حساب خود وارد شوید' : 'حساب کاربری جدید بسازید'}</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            ورود
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${!isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
          >
            ثبت‌نام
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی *"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <input
                  type="tel"
                  placeholder="شماره موبایل"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </>
            )}

            <input
              type="email"
              placeholder="ایمیل *"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="رمز عبور *"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full h-12 px-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isLogin && (
              <input
                type="password"
                placeholder="تکرار رمز عبور *"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full h-12 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors"
            >
              {isLogin ? 'ورود' : 'ثبت‌نام'}
            </button>
          </motion.form>
        </AnimatePresence>

        {/* Demo accounts */}
        <div className="mt-6 p-4 bg-amber-50 rounded-xl text-sm">
          <p className="font-medium text-amber-800 mb-2">حساب‌های آزمایشی:</p>
          <p className="text-amber-700">مدیر: admin@mobile-shop.com / admin123</p>
          <p className="text-amber-700">کاربر: user@example.com / user123</p>
        </div>
      </motion.div>
    </div>
  );
}
