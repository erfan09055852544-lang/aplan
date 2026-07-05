import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products, brands, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import type { SortOption } from '@/types';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const brandFilter = searchParams.get('brand') || '';
  const categoryFilter = searchParams.get('category') || '';
  const featuredFilter = searchParams.get('featured') === 'true';
  const conditionFilter = searchParams.get('condition') || '';
  const sortParam = (searchParams.get('sort') || 'newest') as SortOption;
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (brandFilter) result = result.filter(p => p.brand === brandFilter);
    if (categoryFilter) result = result.filter(p => p.category === categoryFilter);
    if (featuredFilter) result = result.filter(p => p.is_featured);
    if (conditionFilter) result = result.filter(p => p.condition === conditionFilter);

    result = result.filter(p => p.base_price >= priceRange[0] && p.base_price <= priceRange[1]);

    switch (sortBy) {
      case 'price_low': result.sort((a, b) => a.base_price - b.base_price); break;
      case 'price_high': result.sort((a, b) => b.base_price - a.base_price); break;
      case 'bestselling': result.sort((a, b) => b.sales_count - a.sales_count); break;
      default: result.sort((a, b) => b.id - a.id); break;
    }

    return result;
  }, [searchQuery, brandFilter, categoryFilter, featuredFilter, conditionFilter, sortBy, priceRange]);

  const activeFiltersCount = [brandFilter, categoryFilter, conditionFilter].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/" className="hover:text-amber-600">خانه</Link>
            <span>/</span>
            <span>محصولات</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">محصولات</h1>
          <p className="text-slate-500 mt-1">{filteredProducts.length} محصول یافت شد</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); }}
              placeholder="جستجو در محصولات..."
              className="w-full h-11 pr-10 pl-4 bg-slate-100 border-0 rounded-xl text-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 h-11 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              فیلترها
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">{activeFiltersCount}</span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="h-11 px-4 bg-slate-100 rounded-xl text-sm border-0 cursor-pointer"
            >
              <option value="newest">جدیدترین</option>
              <option value="price_low">قیمت: کم به زیاد</option>
              <option value="price_high">قیمت: زیاد به کم</option>
              <option value="bestselling">پرفروش‌ترین</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 overflow-hidden hidden lg:block"
              >
                <div className="w-[280px] space-y-6">
                  {/* Brand */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">برند</h4>
                    <div className="space-y-2">
                      {brands.map(b => (
                        <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="brand"
                            checked={brandFilter === b.name}
                            onChange={() => updateFilter('brand', brandFilter === b.name ? '' : b.name)}
                            className="w-4 h-4 text-amber-600 accent-amber-600"
                          />
                          <span className="text-sm text-slate-600">{b.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">دسته‌بندی</h4>
                    <div className="space-y-2">
                      {categories.map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={categoryFilter === c}
                            onChange={() => updateFilter('category', categoryFilter === c ? '' : c)}
                            className="w-4 h-4 text-amber-600 accent-amber-600"
                          />
                          <span className="text-sm text-slate-600">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">وضعیت</h4>
                    <div className="space-y-2">
                      {['new', 'used'].map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="condition"
                            checked={conditionFilter === c}
                            onChange={() => updateFilter('condition', conditionFilter === c ? '' : c)}
                            className="w-4 h-4 text-amber-600 accent-amber-600"
                          />
                          <span className="text-sm text-slate-600">{c === 'new' ? 'نو' : 'کارکرده'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3">محدوده قیمت</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-24 h-9 px-2 bg-slate-100 rounded-lg text-sm"
                        placeholder="از"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-24 h-9 px-2 bg-slate-100 rounded-lg text-sm"
                        placeholder="تا"
                      />
                    </div>
                  </div>

                  {/* Clear filters */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams();
                        if (searchQuery) newParams.set('search', searchQuery);
                        setSearchParams(newParams);
                        setPriceRange([0, 100000000]);
                      }}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      پاک کردن فیلترها
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">محصولی یافت نشد</h3>
                <p className="text-slate-500">لطفاً فیلترهای خود را تغییر دهید</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
