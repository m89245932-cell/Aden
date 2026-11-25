import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Anchor,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Store,
  LogIn,
  UserPlus,
  Compass
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: (targetPage: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessNavigate }) => {
  const { loginWithGoogle, loginDemo, loginWithEmail, registerUser } = useAuth();
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'merchant'>('user');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = (role: 'merchant' | 'admin' | 'user') => {
    loginDemo(role);
    onClose();
    if (onSuccessNavigate) {
      if (role === 'admin') onSuccessNavigate('admin-dashboard');
      else if (role === 'merchant') onSuccessNavigate('merchant-dashboard');
      else onSuccessNavigate('profile');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
      if (onSuccessNavigate) {
        onSuccessNavigate('profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        if (!displayName.trim()) {
          setErrorMsg(lang === 'ar' ? 'يرجى إدخال الاسم الكريم' : 'Please enter your name');
          setLoading(false);
          return;
        }
        await registerUser(email.trim(), displayName.trim(), selectedRole);
        onClose();
        if (onSuccessNavigate) {
          onSuccessNavigate(selectedRole === 'merchant' ? 'merchant-dashboard' : 'profile');
        }
      } else {
        await loginWithEmail(email.trim(), email.split('@')[0], selectedRole);
        onClose();
        if (onSuccessNavigate) {
          onSuccessNavigate(email.toLowerCase().includes('admin') ? 'admin-dashboard' : (selectedRole === 'merchant' ? 'merchant-dashboard' : 'profile'));
        }
      }
    } catch (err) {
      setErrorMsg(lang === 'ar' ? 'حدث خطأ أثناء الدخول' : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close authentication modal"
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-700 via-sky-600 to-sky-400 text-white flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-sky-600/30">
            <Anchor className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {lang === 'ar' ? 'مرحباً بك في عدن جو' : 'Welcome to AdenGo'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'سجّل دخولك لحجز الطاولات، كتابة التقييمات، وإدارة أنشطتك التجارية'
              : 'Sign in to reserve tables, submit reviews, and manage business listings'}
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-5 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'signin'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
          </button>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800">
          <p className="text-[11px] font-bold text-sky-800 dark:text-sky-200 mb-2 flex items-center justify-between">
            <span>{lang === 'ar' ? '⚡ تجربة فورية بنقرة واحدة:' : '⚡ Instant 1-Click Demo Login:'}</span>
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-[11px] font-bold transition text-center truncate shadow-xs"
            >
              {lang === 'ar' ? '👤 زائر وعميل' : '👤 Customer'}
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('merchant')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-[11px] font-bold transition text-center truncate shadow-xs"
            >
              {lang === 'ar' ? '🏪 تاجر عدني' : '🏪 Merchant'}
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 text-[11px] font-bold transition text-center truncate shadow-xs"
            >
              {lang === 'ar' ? '🛡️ مسؤول' : '🛡️ Admin'}
            </button>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-xs mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{lang === 'ar' ? 'متابعة عبر حساب Google' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-semibold text-slate-400 absolute">
            {lang === 'ar' ? 'أو عبر البريد الإلكتروني' : 'or via Email'}
          </span>
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-500 font-semibold mb-3 text-center">{errorMsg}</p>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: فؤاد الشعيبي' : 'e.g. Fouad Al-Shoaibi'}
                  className="w-full text-xs p-2.5 rtl:pr-9 ltr:pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute top-3 rtl:right-3 ltr:left-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs p-2.5 rtl:pr-9 ltr:pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute top-3 rtl:right-3 ltr:left-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'} *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 rtl:pr-9 ltr:pl-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute top-3 rtl:right-3 ltr:left-3" />
            </div>
          </div>

          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'نوع الحساب' : 'Account Type'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('user')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    selectedRole === 'user'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  {lang === 'ar' ? 'زائر / مستخدم عادي' : 'Customer / User'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('merchant')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    selectedRole === 'merchant'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  {lang === 'ar' ? 'تاجر / صاحب عمل' : 'Merchant / Owner'}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 transition mt-2 disabled:opacity-50"
          >
            {activeTab === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>
              {activeTab === 'signup'
                ? (lang === 'ar' ? 'إنشاء الحساب' : 'Create Account')
                : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
