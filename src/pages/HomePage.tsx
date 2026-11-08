import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Business } from '../types/index';
import { CATEGORIES, ADEN_DISTRICTS } from '../data/seedData';
import { AdenCityMap } from '../components/AdenCityMap';
import {
  Search,
  MapPin,
  CheckCircle,
  MessageCircle,
  Star,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  Award,
  Sparkles
} from 'lucide-react';

interface HomePageProps {
  businesses: Business[];
  setActivePage: (page: string) => void;
  setSelectedBusiness: (b: Business) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedDistrict: (dist: string) => void;
  openInquiryModal: (b: Business) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  businesses,
  setActivePage,
  setSelectedBusiness,
  setSelectedCategory,
  setSelectedDistrict,
  openInquiryModal
}) => {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrictState, setSelectedDistrictState] = useState('all');
  const [homeMapDistrict, setHomeMapDistrict] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedDistrict(selectedDistrictState);
    setActivePage('listings');
  };

  const featured = businesses.filter((b) => b.featured);
  const totalLeads = businesses.reduce((acc, b) => acc + (b.leads || 0), 0);
  const totalViews = businesses.reduce((acc, b) => acc + (b.views || 0), 0);

  return (
    <div className="w-full">
      {/* Nautical Ocean Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-sky-950 to-slate-900 text-white py-20 lg:py-28">
        
        {/* Coastal ambient grid & lights */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 rtl:left-1/4 ltr:right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-900/60 border border-sky-500/30 text-sky-200 text-xs font-bold mb-6 backdrop-blur-md shadow-lg shadow-sky-900/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t('heroBadge')}</span>
          </div>

          {/* Hero Headlines */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            {t('heroTitle')}
          </h1>
          <p className="mt-5 text-sm sm:text-lg text-sky-100 max-w-3xl mx-auto font-light leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Unified Floating Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto bg-white/95 dark:bg-slate-900/95 p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-sky-300/30 text-slate-800 dark:text-slate-100 backdrop-blur-md">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
              
              {/* Text Search */}
              <div className="flex-1 flex items-center px-4 py-2.5 border-b sm:border-b-0 sm:rtl:border-l sm:ltr:border-r border-slate-200 dark:border-slate-800">
                <Search className="w-5 h-5 text-sky-500 shrink-0" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none px-3 text-xs sm:text-sm placeholder:text-slate-400"
                />
              </div>

              {/* District Dropdown */}
              <div className="flex items-center px-3 py-2.5">
                <MapPin className="w-5 h-5 text-sky-500 shrink-0" />
                <select
                  value={selectedDistrictState}
                  onChange={(e) => setSelectedDistrictState(e.target.value)}
                  aria-label="Select Aden District"
                  className="w-full bg-transparent border-none focus:outline-none px-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {ADEN_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                      {lang === 'ar' ? d.ar : d.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl sm:rounded-2xl transition shadow-md shadow-sky-600/30 flex items-center justify-center gap-2"
              >
                <span>{t('searchButton')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          </div>

          {/* Real Metrics Ticker */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8 border-t border-sky-900/60 text-center">
            <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-sky-800/30">
              <div className="text-2xl sm:text-3xl font-black text-sky-300">{businesses.length}+</div>
              <div className="text-xs text-sky-200/80 mt-1 font-medium">
                {lang === 'ar' ? 'نشاط تجاري معتمد' : 'Verified Places in Aden'}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-sky-800/30">
              <div className="text-2xl sm:text-3xl font-black text-sky-300">8</div>
              <div className="text-xs text-sky-200/80 mt-1 font-medium">
                {lang === 'ar' ? 'مديريات مغطاة بالكامل' : 'Covered Districts'}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-sky-800/30">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{totalLeads > 0 ? `${totalLeads.toLocaleString()}+` : '3,200+'}</div>
              <div className="text-xs text-sky-200/80 mt-1 font-medium">
                {lang === 'ar' ? 'طلب واتساب مباشر' : 'WhatsApp Leads Sent'}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-sky-800/30">
              <div className="text-2xl sm:text-3xl font-black text-amber-300">100%</div>
              <div className="text-xs text-sky-200/80 mt-1 font-medium">
                {lang === 'ar' ? 'بدون عمولة على المبيعات' : '0% Commission'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('browseCategories')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'استكشف المأكولات البحرية، الكافيهات، الفنادق الساحلية، والخدمات'
                : 'Browse seafood dining, beach hotels, specialty roasteries, and medical centers'}
            </p>
          </div>
          <button
            onClick={() => setActivePage('listings')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>{lang === 'ar' ? 'عرض الدليل كاملاً' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const count = businesses.filter(b => b.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActivePage('listings');
                }}
                className="group cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-sky-100 dark:border-slate-800 hover:border-sky-400 hover:shadow-xl hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="w-13 h-13 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm">
                  <span className="text-2xl">
                    {cat.id === 'restaurants' ? '🐟' :
                     cat.id === 'cafes' ? '☕' :
                     cat.id === 'hotels' ? '🏨' :
                     cat.id === 'shopping' ? '⚡' :
                     cat.id === 'clinics' ? '🩺' : '💼'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                  {lang === 'ar' ? cat.ar : cat.en}
                </h3>
                <span className="text-[10px] text-slate-400 mt-1">
                  {count} {lang === 'ar' ? 'نشاط مسجل' : 'listings'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Businesses Showcase */}
      <section className="py-14 bg-sky-50/60 dark:bg-slate-900/60 border-y border-sky-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'ar' ? 'موصى به في عدن' : 'Top Picks in Aden'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t('featuredBusinesses')}
              </h2>
            </div>
            <button
              onClick={() => setActivePage('listings')}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'استكشف المزيد' : 'Explore More'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image and Badges */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* District badge */}
                  <span className="absolute top-3 rtl:right-3 ltr:left-3 bg-white/95 dark:bg-slate-900/90 text-sky-700 dark:text-sky-300 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <MapPin className="w-3 h-3 text-sky-500" />
                    <span>{ADEN_DISTRICTS.find((d) => d.id === b.district)?.[lang] || b.district}</span>
                  </span>

                  {/* Verified badge */}
                  {b.verified && (
                    <span className="absolute top-3 rtl:left-3 ltr:right-3 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle className="w-3 h-3 text-white" />
                      <span>{t('verifiedBadge')}</span>
                    </span>
                  )}

                  {/* Price Level in image */}
                  <span className="absolute bottom-3 rtl:right-3 ltr:left-3 text-white text-xs font-bold bg-black/60 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                    {b.priceLevel}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating row */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {CATEGORIES.find((c) => c.id === b.category)?.[lang] || b.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{b.rating}</span>
                        <span className="text-[10px] text-slate-400">({b.reviewsCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => {
                        setSelectedBusiness(b);
                        setActivePage('business-profile');
                      }}
                      className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 cursor-pointer transition line-clamp-1"
                    >
                      {lang === 'ar' ? b.nameAr : b.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {lang === 'ar' ? b.descriptionAr : b.description}
                    </p>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedBusiness(b);
                        setActivePage('business-profile');
                      }}
                      className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition"
                    >
                      {t('viewProfile')}
                    </button>

                    <button
                      onClick={() => openInquiryModal(b)}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-md shadow-emerald-700/20 active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{t('contactWhatsapp')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Aden Coastal Map Explorer Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-sky-50/50 dark:from-slate-950 dark:to-slate-900 border-y border-sky-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 text-xs font-bold mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'خريطة عدن الرقمية التفاعلية' : 'Interactive Aden Live Map'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? 'اكتشف الأنشطة جغرافياً عبر سواحل ومناطق عدن' : 'Discover Places Geographically in Aden'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                {lang === 'ar'
                  ? 'تصفح مواقع المطاعم، المقاهي، الفنادق والمتاجر في كريتر والمعلا والتواهي وخورمكسر والمنصورة مع إمكانية التواصل الفوري عبر واتساب.'
                  : 'Locate restaurants, coffee roasteries, beach resorts, and specialty clinics across Crater, Mualla, Tawahi, and Khormaksar with direct WhatsApp connectivity.'}
              </p>
            </div>

            <button
              onClick={() => setActivePage('listings')}
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 group py-2"
            >
              <span>{lang === 'ar' ? 'عرض كافة الأنشطة على الخريطة' : 'Explore All on Map'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Interactive Map Embed */}
          <AdenCityMap
            businesses={businesses}
            selectedDistrict={homeMapDistrict}
            onDistrictChange={setHomeMapDistrict}
            onSelectBusiness={(b) => {
              setSelectedBusiness(b);
              setActivePage('business-profile');
            }}
            onOpenInquiry={openInquiryModal}
            height="520px"
            showDistrictPills={true}
          />
        </div>
      </section>

      {/* Aden Districts Spotlight */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {lang === 'ar' ? 'استكشف مديريات عدن التاريخية والتجارية' : 'Explore Aden’s Historic Districts'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            {lang === 'ar'
              ? 'من قلعة صيرة وبحر جولدمور إلى شوارع المعلا وأسواق المنصورة النابضة بالحياة'
              : 'From Sira Fortress and Gold Mohur Beach to Mualla Main Street and Mansoura markets'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ADEN_DISTRICTS.slice(1, 5).map((dist) => (
            <div
              key={dist.id}
              onClick={() => {
                setSelectedDistrict(dist.id);
                setActivePage('listings');
              }}
              className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={dist.image}
                alt={dist.en}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  {lang === 'ar' ? 'مديرية' : 'District'}
                </span>
                <h3 className="text-xl font-black text-white group-hover:text-sky-300 transition">
                  {lang === 'ar' ? dist.ar : dist.en}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-light">
                  {lang === 'ar' ? dist.descriptionAr : dist.descriptionEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Merchant Call to Action Banner */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 p-8 sm:p-12 text-white shadow-2xl border border-sky-700/40">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-700/60 text-sky-200 text-xs font-bold mb-4">
              <Building className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'للتجّار وأصحاب المطاعم في عدن' : 'For Aden Business Owners'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black mb-3 leading-snug">
              {lang === 'ar'
                ? 'استقبل طلبات الزبائن مباشرة على رقم واتساب الخاص بمحلك'
                : 'Receive High-Intent Inquiries Directly on Your Business WhatsApp'}
            </h3>

            <p className="text-xs sm:text-sm text-sky-100 mb-6 leading-relaxed">
              {lang === 'ar'
                ? 'انضم اليوم لدليل AdenGo المعتمد. شارة توثيق زرقاء، أولوية في الظهور، بدون أي عمولة على الطلبات، مع لوحة تحليلات يومية لمشاهدات واستفسارات الزبائن.'
                : 'Join the verified AdenGo network today. Blue verified badge, category boost, 0% commissions, and direct customer WhatsApp leads.'}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActivePage('pricing')}
                className="bg-white hover:bg-sky-50 text-sky-900 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition"
              >
                {lang === 'ar' ? 'استعراض باقات الاشتراك' : 'Explore Pricing Plans'}
              </button>
              <button
                onClick={() => setActivePage('merchant-dashboard')}
                className="bg-sky-600/80 hover:bg-sky-600 border border-sky-400/40 text-white px-6 py-3 rounded-xl font-bold text-xs transition"
              >
                {lang === 'ar' ? 'تجربة بوابة التاجر الفورية' : 'Open Merchant Portal Demo'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
