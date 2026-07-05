import { Link } from 'react-router';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatPrice, getProductRating } from '@/lib/utils';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, reviews } = useApp();
  const rating = getProductRating(product.id, reviews);
  const discounted = product.base_price > 0 && product.sales_count > 10;
  const discountPercent = discounted ? Math.round((1 - (product.base_price * 0.9) / product.base_price) * 100) : 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.base_price,
      quantity: 1,
      image: product.images[0] || '',
      brand: product.brand,
    });
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      {/* Image area */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-md">ویژه</span>
          )}
          {discounted && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-md">{discountPercent}٪</span>
          )}
          {product.condition === 'used' && (
            <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs font-bold rounded-md">دست دوم</span>
          )}
        </div>
        {/* Wishlist button */}
        <button
          onClick={e => { e.preventDefault(); handleWishlist(); }}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-white/90 shadow-sm hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-3">
        <span className="text-xs text-slate-400 font-medium">{product.brand}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-semibold text-slate-800 mt-0.5 line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <StarRating rating={rating.average} size={12} />
          <span className="text-xs text-slate-400">({rating.count})</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-amber-600">
            {formatPrice(discounted ? product.base_price * 0.9 : product.base_price)}
          </span>
          {discounted && (
            <span className="text-sm text-slate-400 line-through">{formatPrice(product.base_price)}</span>
          )}
        </div>

        {/* Stock */}
        <p className={`text-xs mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {product.stock > 0 ? `${product.stock} عدد در انبار` : 'ناموجود'}
        </p>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          افزودن به سبد
        </button>
      </div>
    </motion.div>
  );
}
