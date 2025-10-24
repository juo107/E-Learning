import React, { useState } from 'react';
import { ShoppingCart, Heart, Globe, User, LayoutDashboard, LogOut, GraduationCap, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GlobalSearch from '../search/GlobalSearch';
import MegaCategories from './MegaCategories';
import { useTranslation } from 'react-i18next';
import { ThemeToggleSimple } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'EN' | 'VI'>(
    (localStorage.getItem('lang') as 'EN' | 'VI') || 'EN'
  );

  const toggleLang = () => {
    const next = lang === 'EN' ? 'VI' : 'EN';
    setLang(next);
    localStorage.setItem('lang', next);
    i18n.changeLanguage(next.toLowerCase());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    const role = user.role.toLowerCase();
    if (role === 'admin') return '/admin';
    if (role === 'teacher' || role === 'instructor') return '/instructor';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (!user) return t('navigation.dashboard');
    const role = user.role.toLowerCase();
    if (role === 'admin') return 'Admin';
    if (role === 'teacher' || role === 'instructor') return 'Instructor';
    return t('navigation.dashboard');
  };

  const getDashboardIcon = () => {
    if (!user) return LayoutDashboard;
    const role = user.role.toLowerCase();
    if (role === 'admin') return Settings;
    if (role === 'teacher' || role === 'instructor') return GraduationCap;
    return LayoutDashboard;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="w-full px-4 h-14 flex items-center gap-4">
        {/* Left cluster */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="font-bold text-lg">{t('appName')}</Link>
          {/* Categories mega menu */}
          <MegaCategories />
        </div>

        {/* Center search */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-[760px]"><GlobalSearch /></div>
        </div>

        {/* Right actions */}
        <nav className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="hidden sm:inline-flex items-center px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium">
                {React.createElement(getDashboardIcon(), { className: "w-4 h-4 mr-1" })}
                {getDashboardLabel()}
              </Link>
              <Link to="/courses" className="hidden sm:inline px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium">
                {t('navigation.courses')}
              </Link>
              <div className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
                {user?.fullName}
              </div>
              <button 
                onClick={handleLogout}
                className="px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                {t('navigation.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-sm font-medium">
                {t('navigation.login')}
              </Link>
              <Link to="/register" className="px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-semibold">
                {t('navigation.register')}
              </Link>
            </>
          )}
          <ThemeToggleSimple />
          <button onClick={toggleLang} aria-label="Language" className="px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-1">
            <Globe className="size-4" /> {lang}
          </button>
          <Link to="/cart" aria-label={t('navigation.cart')} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900">
            <ShoppingCart className="inline size-5" />
          </Link>
          <Link to="/wishlist" aria-label={t('navigation.wishlist')} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900">
            <Heart className="inline size-5" />
          </Link>
          <Link to="/settings" aria-label={t('navigation.account')} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900">
            <User className="inline size-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}



