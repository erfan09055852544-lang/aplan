import { useState } from 'react';
import { Link } from 'react-router';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Contact() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      showToast('لطفاً همه فیلدها را پر کنید', 'error');
      return;
    }
    if (form.message.length < 10) {
      showToast('پیام باید حداقل ۱۰ کاراکتر باشد', 'error');
      return;
    }
    showToast('پیام شما با موفقیت ارسال شد', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: MapPin, label: 'آدرس', value: 'تهران، خیابان جمهوری، پاساژ علاءالدین' },
    { icon: Phone, label: 'تلفن', value: '۰۲۱-۱۲۳۴۵۶۷۸' },
    { icon: Mail, label: 'ایمیل', value: 'info@vinmobile.ir' },
    { icon: Clock, label: 'ساعت کار', value: 'شنبه تا پنجشنبه: ۹ صبح تا ۹ شب' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-amber-600">خانه</Link>
            <span>/</span>
            <span>تماس با ما</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">تماس با ما</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">راه‌های ارتباطی</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              ما همیشه در کنار شما هستیم. برای هرگونه سوال، پیشنهاد یا مشکل، از طریق راه‌های زیر با ما در تماس باشید.
            </p>
            <div className="space-y-5">
              {contactInfo.map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="font-medium text-slate-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">فرم تماس</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="نام و نام خانوادگی *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm"
              />
              <input
                type="email"
                placeholder="ایمیل *"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm"
              />
              <input
                type="text"
                placeholder="موضوع *"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm"
              />
              <textarea
                placeholder="پیام شما *"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full h-12 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                ارسال پیام
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
