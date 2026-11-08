import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Anchor,
  Globe,
  Sun,
  Moon,
  PlusCircle,
  User,
  ShieldAlert,
  Menu,
  X,
  Compass,
  Store,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  isDark,
  setIsDark,
  openAuthModal
}) => {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('home'), icon: Compass },
    { id: 'listings', label: t('listings'), icon: Layers },
    { id: 'pricing', label: t('pricing'), icon: Store },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-sky-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-800 via-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-600/30 group-hover:scale-105 transition-transform duration-200">
            <Anchor className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {lang === 'ar' ? 'عدن' : 'Aden'}<span className="text-sky-500">Go</span>
              </span>
              <span className="text-[10px] bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-extrabold px-1.5 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                YEMEN
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              {lang === 'ar' ? 'دليل وخريطة أعمال عدن' : 'Aden Smart Directory & Leads'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-1 ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 opacity-70" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick('merchant-dashboard')}
            className={`text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg border ${
              activePage === 'merchant-dashboard'
                ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400'
            }`}
          >
            {t('merchantPortal')}
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className={`text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                activePage === 'admin-dashboard'
                  ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700'
                  : 'border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400 hover:bg-orange-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{t('adminPortal')}</span>
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-700 transition"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Dark Mode Switcher */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-700 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-800" />}
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => handleNavClick(isAdmin ? 'admin-dashboard' : 'merchant-dashboard')}
                className="flex items-center gap-2 cursor-pointer text-xs font-bold px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-800 hover:border-sky-400"
              >
                <User className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span className="truncate max-w-[110px]">{user.displayName}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold px-1.5 py-1"
              >
                {t('signOut')}
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {t('signIn')}
            </button>
          )}

          {/* Add Business CTA */}
          <button
            onClick={() => handleNavClick('merchant-dashboard')}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white shadow-md shadow-sky-600/20 hover:shadow-lg transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('addListing')}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-800" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 py-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>{lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}</span>
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{user.displayName}</span>
                <button onClick={logout} className="text-xs text-rose-500 font-bold">{t('signOut')}</button>
              </div>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); openAuthModal(); }} className="text-xs font-bold text-sky-600 dark:text-sky-400">
                {t('signIn')}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-right rtl:text-right ltr:text-left py-2 px-3 rounded-lg text-sm font-semibold ${
                activePage === 'home' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              {t('home')}
            </button>
            <button
              onClick={() => handleNavClick('listings')}
              className={`text-right rtl:text-right ltr:text-left py-2 px-3 rounded-lg text-sm font-semibold ${
                activePage === 'listings' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              {t('listings')}
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className={`text-right rtl:text-right ltr:text-left py-2 px-3 rounded-lg text-sm font-semibold ${
                activePage === 'pricing' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              {t('pricing')}
            </button>
            <button
              onClick={() => handleNavClick('merchant-dashboard')}
              className={`text-right rtl:text-right ltr:text-left py-2 px-3 rounded-lg text-sm font-semibold ${
                activePage === 'merchant-dashboard' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold' : ''
              }`}
            >
              {t('merchantPortal')}
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className="text-right rtl:text-right ltr:text-left py-2 px-3 rounded-lg text-sm font-semibold text-orange-600 dark:text-orange-400"
              >
                {t('adminPortal')}
              </button>
            )}
          </div>

          <button
            onClick={() => handleNavClick('merchant-dashboard')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 text-white font-bold text-xs shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('addListing')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
