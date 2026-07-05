import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, GitCompare, ChevronLeft } from 'lucide-react';
import { products } from '@/data/products';
import { useApp } from '@/context/AppContext';
import { formatPrice, getProductRating } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { addToCart, addToWishlist, addToCompare, isInWishlist, isInCompare, addRecentlyViewed, addReview, reviews, recentlyViewed } = useApp();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-700">محصول یافت نشد</h2>
          <Link to="/products" className="text-amber-600 mt-2 inline-block">بازگشت به محصولات</Link>
        </div>
      </div>
    );
  }

  // استفاده از useEffect به جای فراخوانی مستقیم
  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const rating = getProductRating(product.id, reviews);
  const productReviews = reviews.filter(r => r.product_id === product.id);
  const inWishlist = isInWishlist(product.id);
  const inCompareList = isInCompare(product.id);

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
    .slice(0, 4);

  const recentProducts = recentlyViewed
    .filter(id => id !== product.id)
    .slice(0, 4)
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.colors.find(c => c.name === selectedColor)?.price || product.base_price,
      quantity: 1,
      color: selectedColor,
      image: product.images[0] || '',
      brand: product.brand,
    });
  };

  const handleSubmitReview = () => {
    if (!reviewForm.comment.trim() || reviewForm.comment.length < 3) return;
    addReview({
      id: Date.now(),
      product_id: product.id,
      user_name: reviewForm.name || 'کاربر مهمان',
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      created_at: new Date().toISOString(),
    });
    setReviewForm({ name: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const tabs = [
    { key: 'desc' as const, label: 'توضیحات' },
    { key: 'specs' as const, label: 'مشخصات فنی' },
    { key: 'reviews' as const, label: `نقد و بررسی (${productReviews.length})` },
  ];

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-amber-600">خانه</Link>
          <ChevronLeft className="w-4 h-4" />
          <Link to="/products" className="hover:text-amber-600">محصولات</Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-slate-700">{product.name}</span>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${selectedImage === i ? 'border-amber-500' : 'border-slate-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2 bg-slate-50" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <Link to={`/products?brand=${encodeURIComponent(product.brand)}`} className="text-sm text-slate-400 font-medium hover:text-amber-600">
              {product.brand}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={rating.average} />
              <span className="text-sm text-slate-500">({productReviews.length} نقد و بررسی)</span>
              <button onClick={() => setShowReviewForm(true)} className="text-sm text-amber-600 hover:underline">
                افزودن نقد
              </button>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-amber-600">{formatPrice(product.base_price)}</span>
              {product.sales_count > 20 && (
                <>
                  <span className="text-lg text-slate-400 line-through">{formatPrice(Math.round(product.base_price * 1.05))}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-sm font-bold rounded-md">۵٪</span>
                </>
              )}
            </div>

            {/* Condition */}
            <div className="mt-3 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {product.condition === 'new' ? 'نو' : 'کارکرده'}
              </span>
              <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} عدد در انبار` : 'ناموجود'}
              </span>
            </div>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">رنگ: {selectedColor}</h3>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-amber-500 ring-2 ring-amber-200 scale-110' : 'border-slate-300'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Specs preview */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                <div key={key} className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-400">{key}</span>
                  <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                افزودن به سبد خرید
              </button>
              <button
                onClick={() => inWishlist ? addToWishlist(product.id) : addToWishlist(product.id)}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 border rounded-xl font-medium transition-colors ${inWishlist ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-300 text-slate-600 hover:border-slate-400'}`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
              </button>
              <button
                onClick={() => inCompareList ? addToCompare(product.id) : addToCompare(product.id)}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 border rounded-xl font-medium transition-colors ${inCompareList ? 'border-amber-300 bg-amber-50 text-amber-600' : 'border-slate-300 text-slate-600 hover:border-slate-400'}`}
              >
                <GitCompare className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-0 border-b border-slate-200">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'desc' && (
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={key} className={`flex justify-between p-4 rounded-xl ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <span className="text-slate-500">{key}</span>
                    <span className="font-medium text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {showReviewForm && (
                  <div className="bg-slate-50 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold mb-4">ثبت نقد و بررسی</h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="نام شما"
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">امتیاز:</span>
                        <StarRating rating={reviewForm.rating} interactive size={24} onRate={r => setReviewForm({ ...reviewForm, rating: r })} />
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="نظر خود را بنویسید (حداقل ۳ کاراکتر)"
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={handleSubmitReview} className="px-6 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">ثبت</button>
                        <button onClick={() => setShowReviewForm(false)} className="px-6 py-2 border border-slate-300 rounded-lg text-sm">انصراف</button>
                      </div>
                    </div>
                  </div>
                )}

                {productReviews.length > 0 ? (
                  <div className="space-y-4">
                    {productReviews.map(review => (
                      <div key={review.id} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                            {review.user_name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-sm">{review.user_name}</span>
                            <div className="flex items-center gap-1">
                              <StarRating rating={review.rating} size={12} />
                            </div>
                          </div>
                          <span className="mr-auto text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString('fa-IR')}</span>
                        </div>
                        <p className="text-sm text-slate-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">هنوز نقد و بررسی ثبت نشده است.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">محصولات مرتبط</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => p && <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">بازدیدهای اخیر</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentProducts.map(p => p && (
                <Link key={p.id} to={`/products/${p.id}`} className="bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md transition-shadow">
                  <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-contain bg-slate-50 rounded-lg mb-2" />
                  <p className="text-sm font-medium text-slate-700 line-clamp-1">{p.name}</p>
                  <p className="text-sm text-amber-600 font-bold mt-1">{formatPrice(p.base_price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
