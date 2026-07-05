import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, ShoppingCart, User, Menu, X, Heart, GitCompare, LogOut, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const { user, logout, cartCount, wishlist, compare } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-extrabold text-amber-600 shrink-0">
              وین موبایل
            </Link>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className={`relative w-full transition-all duration-300 ${searchFocused ? 'max-w-lg' : 'max-w-md'}`}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="جستجوی گوشی موبایل..."
                  className="w-full h-10 pr-10 pl-4 bg-slate-100 border-0 rounded-full text-sm transition-all focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Compare */}
              <Link
                to="/profile?tab=compare"
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex"
              >
                <GitCompare className="w-5 h-5 text-slate-600" />
                {compare.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {compare.length}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                to="/profile?tab=wishlist"
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex"
              >
                <Heart className="w-5 h-5 text-slate-600" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-slate-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium hidden lg:inline">{user.name}</span>
                  </button>
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4" /> پروفایل
                    </Link>
                    <Link to="/profile?tab=orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors">
                      <Package className="w-4 h-4" /> سفارشات من
                    </Link>
                    <Link to="/profile?tab=wishlist" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 transition-colors">
                      <Heart className="w-4 h-4" /> علاقه‌مندی‌ها
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" /> خروج
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-full hover:bg-amber-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">ورود</span>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 pt-16 bg-white md:hidden">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="جستجوی گوشی موبایل..."
                className="w-full h-12 pr-10 pl-4 bg-slate-100 border-0 rounded-xl text-base"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </form>
            <div className="space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-medium">خانه</Link>
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-medium">محصولات</Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-medium">سبد خرید</Link>
              <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-medium">پیگیری سفارش</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-medium">تماس با ما</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 text-base font-medium">درباره ما</Link>
            </div>
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 text-center bg-amber-600 text-white rounded-xl font-medium"
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
