import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ADEN_DISTRICTS } from '../data/seedData';
import { Anchor, MessageCircle, Heart, MapPin, Phone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
  setSelectedDistrict: (districtId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, setSelectedDistrict }) => {
  const { lang, t } = useLanguage();

  const handleDistrictClick = (id: string) => {
    setSelectedDistrict(id);
    setActivePage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md">
                <Anchor className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-white">
                {lang === 'ar' ? 'عدن' : 'Aden'}<span className="text-sky-400">Go</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {lang === 'ar'
                ? 'المنصة الذكية الأولى في عدن المخصصة لدعم الأعمال والمتاجر المحلية. نربط أهالي وزوار عدن بأفضل الأنشطة مع تواصل فوري مباشر عبر واتساب بدون وسطاء.'
                : 'Aden’s premier smart business discovery platform. Connecting residents and visitors with trusted local places and instant WhatsApp ordering with 0% commission.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-sky-400 pt-1">
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'موثق رسمياً لمدينة عدن' : 'Official Aden Directory'}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span>{lang === 'ar' ? 'صُنع بكل فخر لـ' : 'Crafted with'}</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
                <span className="font-semibold text-white">{lang === 'ar' ? 'عروس البحر: عدن' : 'Aden, Yemen'}</span>
              </span>
            </div>
          </div>

          {/* Districts Column */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>{lang === 'ar' ? 'مديريات ومناطق عدن' : 'Aden Districts'}</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {ADEN_DISTRICTS.slice(1, 8).map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => handleDistrictClick(d.id)}
                    className="hover:text-sky-400 transition-colors text-right rtl:text-right ltr:text-left text-slate-400 hover:underline"
                  >
                    {lang === 'ar' ? d.ar : d.en}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Pages */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">
              {lang === 'ar' ? 'أقسام المنصة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handlePageClick('home')} className="hover:text-sky-400 transition">
                  {t('home')}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('listings')} className="hover:text-sky-400 transition">
                  {t('listings')}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('pricing')} className="hover:text-sky-400 transition">
                  {t('pricing')}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('merchant-dashboard')} className="hover:text-sky-400 transition">
                  {t('merchantPortal')}
                </button>
              </li>
              <li>
                <button onClick={() => handlePageClick('admin-dashboard')} className="hover:text-sky-400 transition">
                  {t('adminPortal')}
                </button>
              </li>
            </ul>
          </div>

          {/* Merchant Support Direct */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">
              {lang === 'ar' ? 'فريق الدعم والتسجيل' : 'Aden Support & Leads'}
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {lang === 'ar'
                ? 'هل ترغب بإدراج متجرك أو ترقية حسابك إلى الباقة الموثقة؟ تواصل مع مستشارينا في عدن مباشرة.'
                : 'Want to register your shop or upgrade to verified status? Chat with our Aden local team.'}
            </p>

            <a
              href="https://wa.me/967736739355?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A5%D8%AF%D8%B1%D8%A7%D8%AC%20%D9%86%D8%B4%D8%A7%D8%B7%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A%20%D9%81%D9%8A%20AdenGo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'واتساب: +967 736 739 355' : 'WhatsApp: +967 736 739 355'}</span>
            </a>
          </div>

        </div>

        <div className="mt-14 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{t('allRightsReserved')}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Aden, Crater, Mualla, Khormaksar, Mansoura</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>YER / USD Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
