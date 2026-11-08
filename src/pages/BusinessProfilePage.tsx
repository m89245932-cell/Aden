import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Business, Review } from '../types/index';
import { ADEN_DISTRICTS, CATEGORIES } from '../data/seedData';
import { fetchReviews } from '../services/businessService';
import { SEOHelmet } from '../components/SEOHelmet';
import { ReviewModal } from '../components/ReviewModal';
import { BusinessLocationMap } from '../components/BusinessLocationMap';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Globe,
  Star,
  CheckCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  Building,
  Calendar
} from 'lucide-react';

interface BusinessProfilePageProps {
  business: Business;
  setActivePage: (page: string) => void;
  openInquiryModal: (b: Business) => void;
}

export const BusinessProfilePage: React.FC<BusinessProfilePageProps> = ({
  business,
  setActivePage,
  openInquiryModal
}) => {
  const { lang, t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePhoto, setActivePhoto] = useState(business.image);

  useEffect(() => {
    setActivePhoto(business.image);
    fetchReviews(business.id).then((data) => setReviews(data));
  }, [business.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: lang === 'ar' ? business.nameAr : business.name,
        text: lang === 'ar' ? business.descriptionAr : business.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const gallery = business.gallery && business.gallery.length > 0 ? [business.image, ...business.gallery] : [business.image];
  // Deduplicate gallery
  const uniquePhotos = Array.from(new Set(gallery));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEOHelmet
        title={lang === 'ar' ? business.nameAr : business.name}
        description={lang === 'ar' ? business.descriptionAr : business.description}
        business={business}
      />

      {/* Back button & Action controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActivePage('listings')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white transition py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{lang === 'ar' ? 'العودة للدليل' : 'Back to Directory'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? (lang === 'ar' ? 'تم نسخ الرابط!' : 'Copied!') : (lang === 'ar' ? 'مشاركة' : 'Share')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-sky-100 dark:border-slate-800">
              <img
                src={activePhoto}
                alt={business.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

              {business.verified && (
                <span className="absolute top-4 rtl:right-4 ltr:left-4 bg-sky-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('verifiedBadge')}</span>
                </span>
              )}

              <span className="absolute bottom-4 rtl:left-4 ltr:right-4 bg-black/65 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-md">
                {business.priceLevel}
              </span>
            </div>

            {/* Thumbnail Row */}
            {uniquePhotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {uniquePhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(photo)}
                    className={`h-16 w-24 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      activePhoto === photo ? 'border-sky-500 scale-95' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Business Titles and Attributes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="text-sky-600 dark:text-sky-400 font-bold">
                  {CATEGORIES.find((c) => c.id === business.category)?.[lang] || business.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>{ADEN_DISTRICTS.find((d) => d.id === business.district)?.[lang] || business.district}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {lang === 'ar' ? business.nameAr : business.name}
              </h1>
              {lang === 'ar' && (
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">{business.name}</p>
              )}
            </div>

            {/* Rating Box */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <div className="text-3xl font-black text-amber-500 flex items-center gap-1">
                <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                <span>{business.rating}</span>
              </div>
              <div className="border-l rtl:border-r rtl:border-l-0 border-amber-200 dark:border-amber-800 px-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'ar' ? 'تقييم العملاء والزوار' : 'Verified Reviews'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {business.reviewsCount} {t('reviews')}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                {lang === 'ar' ? 'عن هذا النشاط التجاري' : 'About This Business'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {lang === 'ar' ? business.descriptionAr : business.description}
              </p>
            </div>

            {/* Address & Hours Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{t('addressLocation')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'ar' ? business.addressAr : business.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{t('openHours')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lang === 'ar' ? business.hoursAr : business.hoursEn}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Geographic Map */}
          <BusinessLocationMap business={business} />

          {/* Customer Reviews Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('customerReviews')}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {reviews.length} {t('reviews')}
                </p>
              </div>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 font-bold text-xs transition border border-sky-200 dark:border-slate-700"
              >
                {t('writeReview')}
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">{t('beFirstReview')}</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-white">{r.authorName}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{r.rating} / 5</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {r.comment}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">{r.createdAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sticky WhatsApp Direct Conversion Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-sky-100 dark:border-slate-800 shadow-xl space-y-6">
            
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                {lang === 'ar' ? 'تواصل فوري ومباشر' : 'Instant Direct Contact'}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                {lang === 'ar' ? 'اطلب أو احجز عبر واتساب' : 'Order or Book via WhatsApp'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'محادثة فورية مع إدارة المحل لطلب الأسعار والحجوزات'
                  : 'Fast response for inquiries, delivery, and table bookings.'}
              </p>
            </div>

            {/* Big WhatsApp CTA Button */}
            <button
              onClick={() => openInquiryModal(business)}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-700/25 transition-transform active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('contactWhatsapp')}</span>
            </button>

            {/* Phone Call Alternative */}
            <a
              href={`tel:${business.phone || business.whatsapp}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition"
            >
              <Phone className="w-4 h-4 text-sky-500" />
              <span>{t('callPhone')}: {business.phone}</span>
            </a>

            {/* Website Link if available */}
            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sky-600 dark:text-sky-400 hover:underline font-semibold text-xs"
              >
                <Globe className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{business.website.replace('https://', '')}</span>
              </a>
            )}

            {/* Direct WhatsApp details card */}
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sky-800 dark:text-sky-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'ar' ? 'ضمان التواصل المباشر' : 'Direct Merchant Guarantee'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'رقم الواتساب مسجل ومعتمد لدى فريق منصة عدن جو لضمان سرعة الاستجابة.'
                  : 'This contact number is verified by AdenGo for authentic merchant communication.'}
              </p>
            </div>

            {/* Merchant views and leads badge */}
            <div className="pt-2 text-[11px] text-slate-400 text-center flex items-center justify-center gap-3">
              <span>👁️ {business.views} {lang === 'ar' ? 'مشاهدة' : 'views'}</span>
              <span>•</span>
              <span>💬 {business.leads} {lang === 'ar' ? 'طلب واتساب' : 'leads'}</span>
            </div>

          </div>
        </div>

      </div>

      <ReviewModal
        business={business}
        existingReviews={reviews}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewSubmitted={(newRev) => setReviews([newRev, ...reviews])}
      />
    </div>
  );
};
