import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck, Truck, Tag } from 'lucide-react';
import { products, brands } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const featuredProducts = products.filter(p => p.is_featured);

const trustBadges = [
  { icon: ShieldCheck, title: 'ضمانت اصالت', desc: 'تمامی محصولات با گارانتی اصالت کالا عرضه می‌شوند' },
  { icon: Truck, title: 'ارسال سریع', desc: 'ارسال به سراسر کشور در کمترین زمان ممکن' },
  { icon: Tag, title: 'بهترین قیمت', desc: 'تضمین کمترین قیمت بازار با تخفیف‌های ویژه' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <motion.div
              className="flex-1 text-center lg:text-right"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                جدیدترین مدل‌های ۲۰۲۵
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                تجربه‌ای متفاوت از
                <br />
                <span className="text-amber-600">خرید موبایل</span>
              </h1>
              <p className="mt-4 text-lg text-slate-500 max-w-md mx-auto lg:mx-0">
                آخرین مدل‌ها با بهترین قیمت. گارانتی اصالت و ضمانت بازگشت کالا در وین موبایل.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  مشاهده محصولات
                </Link>
                <Link
                  to="/products?featured=true"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  پیشنهاد ویژه
                </Link>
              </div>
            </motion.div>

            {/* Phone Images */}
            <motion.div
              className="flex-1 relative hidden lg:block"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-[400px] h-[450px] mx-auto">
                <motion.img
                  src="/hero-phone-main.png"
                  alt="Samsung Galaxy"
                  className="absolute top-0 right-10 w-[220px] z-10 drop-shadow-2xl"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                <motion.img
                  src="/hero-phone-secondary-1.png"
                  alt="iPhone"
                  className="absolute top-10 left-0 w-[180px] z-0 drop-shadow-xl opacity-80"
                  initial={{ y: 30, rotate: -10 }}
                  animate={{ y: 0, rotate: -10 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
                <motion.img
                  src="/hero-phone-secondary-2.png"
                  alt="Xiaomi"
                  className="absolute bottom-10 left-10 w-[160px] z-0 drop-shadow-xl opacity-70"
                  initial={{ y: 40 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <badge.icon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{badge.title}</h3>
                  <p className="text-sm text-slate-500">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">محصولات ویژه</h2>
              <p className="text-slate-500 mt-1">برترین گوشی‌های موجود در فروشگاه</p>
            </div>
            <Link to="/products" className="text-amber-600 font-medium hover:text-amber-700 transition-colors flex items-center gap-1">
              مشاهده همه
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            className="text-3xl font-bold text-slate-900 text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            برندهای محبوب
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.slice(0, 6).map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/products?brand=${encodeURIComponent(brand.name)}`}
                  className="inline-flex items-center px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-700 font-medium hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 hover:scale-105"
                >
                  {brand.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
