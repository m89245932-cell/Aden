import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Business } from '../types/index';
import { ADEN_DISTRICTS, CATEGORIES } from '../data/seedData';
import { filterBusinesses } from '../utils/directoryLogic';
import { AdenCityMap } from '../components/AdenCityMap';
import {
  Search,
  MapPin,
  CheckCircle,
  MessageCircle,
  Star,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  PhoneCall,
  LayoutGrid,
  Map as MapIcon,
  Columns
} from 'lucide-react';

interface ListingsPageProps {
  businesses: Business[];
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  setActivePage: (page: string) => void;
  setSelectedBusiness: (b: Business) => void;
  openInquiryModal: (b: Business) => void;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({
  businesses,
  selectedDistrict,
  setSelectedDistrict,
  selectedCategory,
  setSelectedCategory,
  setActivePage,
  setSelectedBusiness,
  openInquiryModal
}) => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [priceLevel, setPriceLevel] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'reviews' | 'views'>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'map'>('grid');
  const [highlightedBusinessId, setHighlightedBusinessId] = useState<string | undefined>();

  const filteredBusinesses = useMemo(() => {
    return filterBusinesses(businesses, {
      search,
      district: selectedDistrict,
      category: selectedCategory,
      priceLevel,
      verifiedOnly,
      sortBy
    });
  }, [businesses, search, selectedDistrict, selectedCategory, priceLevel, verifiedOnly, sortBy]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setPriceLevel('all');
    setVerifiedOnly(false);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedDistrict !== 'all' ||
    selectedCategory !== 'all' ||
    priceLevel !== 'all' ||
    verifiedOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header and Search Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {t('listings')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? `عرض ${filteredBusinesses.length} نشاط ومحل موثق في عدن`
              : `Showing ${filteredBusinesses.length} verified businesses in Aden`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'شبكة' : 'Grid'}</span>
            </button>

            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'split'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'خريطة مقسومة' : 'Split Map'}</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'الخريطة' : 'Map View'}</span>
            </button>
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-slate-700 font-bold text-xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الفلاتر' : 'Filters'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside
          className={`lg:col-span-1 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          } bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm h-fit`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
              <Filter className="w-4 h-4 text-sky-500" />
              <span>{lang === 'ar' ? 'تصفية النتائج' : 'Filter Directory'}</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>

          {/* District Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              {t('filterByDistrict')}
            </label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                aria-label="Filter by District"
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
              >
                {ADEN_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {lang === 'ar' ? d.ar : d.en}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute top-3.5 rtl:left-3 ltr:right-3 pointer-events-none" />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              {t('filterByCategory')}
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
              >
                <option value="all">{lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'ar' ? c.ar : c.en}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute top-3.5 rtl:left-3 ltr:right-3 pointer-events-none" />
            </div>
          </div>

          {/* Price Level Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              {t('priceLevel')}
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-bold">
              {['all', '$', '$$', '$$$'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setPriceLevel(lvl)}
                  className={`py-2 rounded-xl border transition ${
                    priceLevel === lvl
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Only Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('verifiedOnly')}
              </span>
            </label>
          </div>

          {/* Sorting */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              {t('sortBy')}
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort listings"
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer"
              >
                <option value="recommended">{t('recommended')}</option>
                <option value="rating">{t('highestRating')}</option>
                <option value="reviews">{t('mostReviews')}</option>
                <option value="views">{t('mostViews')}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute top-3.5 rtl:left-3 ltr:right-3 pointer-events-none" />
            </div>
          </div>
        </aside>

        {/* Listings Cards Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Quick Search Input */}
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center">
            <Search className="w-5 h-5 text-sky-500 rtl:mr-3 ltr:ml-3 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث بالاسم، المأكولات، العنوان...' : 'Search by name, cuisine, address...'}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 px-3"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold">
                {lang === 'ar' ? 'فلاتر مفعلة:' : 'Active filters:'}
              </span>
              {selectedDistrict !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                  <span>{ADEN_DISTRICTS.find(d => d.id === selectedDistrict)?.[lang]}</span>
                  <button onClick={() => setSelectedDistrict('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                  <span>{CATEGORIES.find(c => c.id === selectedCategory)?.[lang]}</span>
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceLevel !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                  <span>{priceLevel}</span>
                  <button onClick={() => setPriceLevel('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <span>{t('verifiedBadge')}</span>
                  <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Results Display based on viewMode */}
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-500 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t('noResultsFound')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                {t('tryDifferentSearch')}
              </p>
              <button
                onClick={handleClearFilters}
                className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Full Map View */
            <div className="space-y-4">
              <AdenCityMap
                businesses={filteredBusinesses}
                selectedDistrict={selectedDistrict}
                onDistrictChange={setSelectedDistrict}
                selectedCategory={selectedCategory}
                highlightedBusinessId={highlightedBusinessId}
                onSelectBusiness={(b) => {
                  setSelectedBusiness(b);
                  setActivePage('business-profile');
                }}
                onOpenInquiry={openInquiryModal}
                height="620px"
              />
            </div>
          ) : viewMode === 'split' ? (
            /* Split Map & Cards View */
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Compact Cards List */}
              <div className="xl:col-span-5 space-y-4 max-h-[700px] overflow-y-auto pr-1">
                {filteredBusinesses.map((b) => (
                  <div
                    key={b.id}
                    onMouseEnter={() => setHighlightedBusinessId(b.id)}
                    className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all cursor-pointer ${
                      highlightedBusinessId === b.id
                        ? 'border-sky-500 shadow-lg ring-1 ring-sky-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-400 uppercase truncate">
                            {CATEGORIES.find((c) => c.id === b.category)?.[lang] || b.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{b.rating}</span>
                          </div>
                        </div>
                        <h4
                          onClick={() => {
                            setSelectedBusiness(b);
                            setActivePage('business-profile');
                          }}
                          className="font-bold text-xs text-slate-900 dark:text-white hover:text-sky-600 transition truncate"
                        >
                          {lang === 'ar' ? b.nameAr : b.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                          <span>{ADEN_DISTRICTS.find((d) => d.id === b.district)?.[lang] || b.district}</span>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => {
                              setSelectedBusiness(b);
                              setActivePage('business-profile');
                            }}
                            className="text-[11px] font-bold text-sky-600 hover:underline"
                          >
                            {t('viewProfile')}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openInquiryModal(b);
                            }}
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky Map in Split Mode */}
              <div className="xl:col-span-7 sticky top-24">
                <AdenCityMap
                  businesses={filteredBusinesses}
                  selectedDistrict={selectedDistrict}
                  onDistrictChange={setSelectedDistrict}
                  selectedCategory={selectedCategory}
                  highlightedBusinessId={highlightedBusinessId}
                  onSelectBusiness={(b) => {
                    setSelectedBusiness(b);
                    setActivePage('business-profile');
                  }}
                  onOpenInquiry={openInquiryModal}
                  height="680px"
                  showDistrictPills={false}
                />
              </div>
            </div>
          ) : (
            /* Cards Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={b.image}
                      alt={b.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />

                    {/* District */}
                    <span className="absolute top-3 rtl:right-3 ltr:left-3 bg-white/95 dark:bg-slate-900/90 text-sky-700 dark:text-sky-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <MapPin className="w-3 h-3 text-sky-500" />
                      <span>{ADEN_DISTRICTS.find(d => d.id === b.district)?.[lang] || b.district}</span>
                    </span>

                    {/* Price level */}
                    <span className="absolute top-3 rtl:left-3 ltr:right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {b.priceLevel}
                    </span>

                    {/* Verified badge */}
                    {b.verified && (
                      <span className="absolute bottom-3 rtl:right-3 ltr:left-3 bg-sky-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                        <CheckCircle className="w-3 h-3" />
                        <span>{t('verifiedBadge')}</span>
                      </span>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase">
                          {CATEGORIES.find(c => c.id === b.category)?.[lang] || b.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{b.rating}</span>
                          <span className="text-slate-400 text-[10px]">({b.reviewsCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => {
                          setSelectedBusiness(b);
                          setActivePage('business-profile');
                        }}
                        className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 cursor-pointer transition line-clamp-1"
                      >
                        {lang === 'ar' ? b.nameAr : b.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {lang === 'ar' ? b.descriptionAr : b.description}
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
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
          )}
        </main>
      </div>
    </div>
  );
};
