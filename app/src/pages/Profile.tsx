import { useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { User, Package, Heart, Star, GitCompare, MapPin, LogOut, Trash2, ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatPrice, orderStatusLabels, orderStatusColors } from '@/lib/utils';
import { products } from '@/data/products';

const sidebarItems = [
  { key: 'dashboard', label: 'داشبورد', icon: User },
  { key: 'orders', label: 'سفارشات من', icon: Package },
  { key: 'wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
  { key: 'reviews', label: 'نقد و بررسی‌ها', icon: Star },
  { key: 'compare', label: 'مقایسه‌ها', icon: GitCompare },
  { key: 'addresses', label: 'آدرس‌ها', icon: MapPin },
];

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const { user, logout, orders, wishlist, reviews, compare, removeFromWishlist, addToCart, addresses, addAddress, removeAddress } = useApp();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', province: '', city: '', address: '', postal_code: '' });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">لطفاً ابتدا وارد شوید</p>
          <Link to="/login" className="mt-4 inline-block px-6 py-2.5 bg-amber-600 text-white rounded-lg">ورود</Link>
        </div>
      </div>
    );
  }

  const setTab = (tab: string) => setSearchParams({ tab });

  const wishlistProducts = wishlist.map(w => products.find(p => p.id === w.product_id)).filter(Boolean);
  const compareProducts = compare.map(id => products.find(p => p.id === id)).filter(Boolean);
  const userReviews = reviews.filter(r => r.user_name === user.name);

  const handleAddAddress = () => {
    if (!addressForm.name || !addressForm.address) return;
    addAddress({ ...addressForm, id: Date.now() });
    setShowAddressForm(false);
    setAddressForm({ name: '', phone: '', province: '', city: '', address: '', postal_code: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-60 shrink-0">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                {sidebarItems.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeTab === item.key ? 'bg-amber-50 text-amber-700 font-medium border-r-2 border-amber-500' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => { logout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">داشبورد</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-xl p-5">
                    <Package className="w-8 h-8 text-amber-600 mb-2" />
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-sm text-slate-500">سفارش</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-5">
                    <Heart className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-2xl font-bold">{wishlist.length}</p>
                    <p className="text-sm text-slate-500">علاقه‌مندی</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-5">
                    <Star className="w-8 h-8 text-amber-500 mb-2" />
                    <p className="text-2xl font-bold">{userReviews.length}</p>
                    <p className="text-sm text-slate-500">نقد و بررسی</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-3">آخرین سفارشات</h3>
                {orders.slice(0, 3).map(order => (
                  <div key={order.id} className="bg-slate-50 rounded-xl p-4 mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{order.tracking_code}</p>
                      <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColors[order.status]}`}>
                        {orderStatusLabels[order.status]}
                      </span>
                      <span className="text-sm font-medium">{formatPrice(order.final_price)}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">سفارشات من</h2>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm">کد پیگیری: {order.tracking_code}</p>
                            <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('fa-IR')}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusColors[order.status]}`}>
                            {orderStatusLabels[order.status]}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <img src={item.image} alt="" className="w-8 h-8 object-contain bg-white rounded" />
                              <span className="text-sm flex-1 line-clamp-1">{item.name}</span>
                              <span className="text-sm">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-3 pt-3 border-t border-slate-200">
                          <span className="text-sm text-slate-500">مبلغ کل</span>
                          <span className="font-bold text-amber-600">{formatPrice(order.final_price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">سفارشی ثبت نشده است</p>
                )}
              </motion.div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">علاقه‌مندی‌ها</h2>
                {wishlistProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map(p => p && (
                      <div key={p.id} className="bg-slate-50 rounded-xl p-4 flex gap-4">
                        <Link to={`/products/${p.id}`} className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-2" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${p.id}`} className="text-sm font-semibold line-clamp-1 hover:text-amber-600">{p.name}</Link>
                          <p className="text-sm text-amber-600 font-bold mt-1">{formatPrice(p.base_price)}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => addToCart({ product_id: p.id, name: p.name, price: p.base_price, quantity: 1, image: p.images[0], brand: p.brand })}
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              سبد
                            </button>
                            <button
                              onClick={() => removeFromWishlist(p.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">لیست علاقه‌مندی‌ها خالی است</p>
                )}
              </motion.div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">نقد و بررسی‌های من</h2>
                {userReviews.length > 0 ? (
                  <div className="space-y-3">
                    {userReviews.map(review => (
                      <div key={review.id} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="font-medium text-sm">{review.rating} از ۵</span>
                          <span className="text-xs text-slate-400 mr-auto">{new Date(review.created_at).toLocaleDateString('fa-IR')}</span>
                        </div>
                        <p className="text-sm text-slate-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">نقد و بررسی ثبت نشده</p>
                )}
              </motion.div>
            )}

            {/* Compare */}
            {activeTab === 'compare' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">مقایسه محصولات</h2>
                {compareProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="text-right p-3 bg-slate-50 rounded-t-xl">ویژگی</th>
                          {compareProducts.map(p => p && <th key={p.id} className="p-3 bg-slate-50 text-center">{p.name}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 font-medium">تصویر</td>
                          {compareProducts.map(p => p && (
                            <td key={p.id} className="p-3 text-center">
                              <img src={p.images[0]} alt="" className="w-20 h-20 object-contain mx-auto" />
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">قیمت</td>
                          {compareProducts.map(p => p && (
                            <td key={p.id} className="p-3 text-center text-amber-600 font-bold">{formatPrice(p.base_price)}</td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">برند</td>
                          {compareProducts.map(p => p && <td key={p.id} className="p-3 text-center">{p.brand}</td>)}
                        </tr>
                        {Object.keys(compareProducts[0]?.specifications || {}).map(specKey => (
                          <tr key={specKey}>
                            <td className="p-3 font-medium text-sm">{specKey}</td>
                            {compareProducts.map(p => p && (
                              <td key={p.id} className="p-3 text-center text-sm">{p.specifications[specKey] || '-'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">محصولی برای مقایسه انتخاب نشده</p>
                )}
              </motion.div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">آدرس‌ها</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"
                  >
                    + آدرس جدید
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="نام *" value={addressForm.name} onChange={e => setAddressForm({ ...addressForm, name: e.target.value })} className="h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm" />
                      <input type="tel" placeholder="شماره تماس" value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} className="h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm" />
                      <input type="text" placeholder="استان" value={addressForm.province} onChange={e => setAddressForm({ ...addressForm, province: e.target.value })} className="h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm" />
                      <input type="text" placeholder="شهر" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} className="h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm" />
                      <input type="text" placeholder="کد پستی" value={addressForm.postal_code} onChange={e => setAddressForm({ ...addressForm, postal_code: e.target.value })} className="h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <textarea placeholder="آدرس کامل *" value={addressForm.address} onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm resize-none" />
                    <div className="flex gap-2">
                      <button onClick={handleAddAddress} className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700">ذخیره</button>
                      <button onClick={() => setShowAddressForm(false)} className="px-4 py-2 border border-slate-300 text-sm rounded-lg">انصراف</button>
                    </div>
                  </div>
                )}

                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <div key={addr.id} className="bg-slate-50 rounded-xl p-4 flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{addr.name}</p>
                          <p className="text-sm text-slate-500 mt-1">{addr.province}، {addr.city}، {addr.address}</p>
                          <p className="text-xs text-slate-400 mt-1">{addr.phone} | {addr.postal_code}</p>
                        </div>
                        <button onClick={() => removeAddress(addr.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">آدرسی ثبت نشده</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
