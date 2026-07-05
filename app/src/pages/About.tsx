import { motion } from 'framer-motion';
import { ShieldCheck, Undo, Truck, Headset } from 'lucide-react';

const stats = [
  { number: '+۱۰', label: 'سال سابقه فعالیت' },
  { number: '+۵۰۰۰۰', label: 'مشتری راضی' },
  { number: '+۱۰۰۰', label: 'محصول متنوع' },
  { number: '+۱۵', label: 'برند معتبر' },
];

const features = [
  { icon: ShieldCheck, title: 'ضمانت اصالت', desc: 'تمام محصولات ۱۰۰٪ اورجینال و با گارانتی اصالت کالا عرضه می‌شوند.' },
  { icon: Undo, title: '۷ روز ضمانت بازگشت', desc: 'در صورت عدم رضایت، محصول را بدون قید و شرط بازگردانید.' },
  { icon: Truck, title: 'ارسال سریع', desc: 'تحویل سفارشات در تهران کمتر از ۲۴ ساعت و در شهرستان‌ها ۲ تا ۴ روز کاری.' },
  { icon: Headset, title: 'پشتیبانی ۲۴/۷', desc: 'تیم پشتیبانی ما به صورت شبانه‌روزی پاسخگوی سوالات شماست.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-slate-900">داستان ما</h1>
            <p className="text-lg text-slate-500 mt-3">از یک فروشگاه کوچک تا بزرگترین مرجع موبایل کشور</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img
              src="/about-store.jpg"
              alt="فروشگاه وین موبایل"
              className="w-full rounded-2xl shadow-lg"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">درباره فروشگاه ما</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              وین موبایل از سال ۱۳۹۰ با هدف ارائه بهترین محصولات دیجیتال با مناسب‌ترین قیمت فعالیت خود را آغاز کرد. 
              ما باور داریم که هر شخص شایسته دسترسی به بهترین تکنولوژی روز است. با بیش از یک دهه تجربه، 
              امروز به یکی از بزرگترین مراجع خرید موبایل و لوازم جانبی در کشور تبدیل شده‌ایم.
            </p>
            <h3 className="text-lg font-bold text-slate-900 mb-2">ماموریت ما</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              ارائه محصولات اورجینال با ضمانت اصالت، قیمت‌های رقابتی و خدمات پس از فروش بی‌نظیر. 
              هدف ما رضایت کامل مشتریان و ایجاد تجربه خریدی آسان و مطمئن است.
            </p>
            <h3 className="text-lg font-bold text-slate-900 mb-2">سابقه ما</h3>
            <p className="text-slate-600 leading-relaxed">
              بیش از یک دهه تجربه در فروش گوشی و لوازم جانبی موبایل. افتخار ما اعتماد هزاران مشتری وفادار است 
              که سال‌هاست ما را برای خرید انتخاب می‌کنند.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {stats.map(stat => (
            <div key={stat.label} className="bg-slate-50 rounded-2xl p-6 text-center">
              <p className="text-3xl lg:text-4xl font-extrabold text-amber-600">{stat.number}</p>
              <p className="text-sm text-slate-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Why Us */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">چرا وین موبایل؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Store Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-slate-50 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">اطلاعات فروشگاه</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-slate-400 mb-1">آدرس</p>
              <p className="font-medium">تهران، خیابان جمهوری، پاساژ علاءالدین، طبقه اول، واحد ۱۲۳</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">ساعت کار</p>
              <p className="font-medium">شنبه تا پنجشنبه: ۹ صبح تا ۹ شب</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">تماس</p>
              <p className="font-medium">۰۲۱-۱۲۳۴۵۶۷۸</p>
              <p className="font-medium">۰۹۱۲۳۴۵۶۷۸۹</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
