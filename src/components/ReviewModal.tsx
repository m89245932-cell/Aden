import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Business, Review } from '../types/index';
import { addReview } from '../services/businessService';
import { X, Star, CheckCircle, Send } from 'lucide-react';

interface ReviewModalProps {
  business: Business | null;
  existingReviews: Review[];
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReview: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  business,
  existingReviews,
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(user?.displayName || '');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !business) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      businessId: business.id,
      authorName: name.trim(),
      authorEmail: user?.email,
      rating,
      comment: comment.trim(),
      userId: user?.uid || `guest-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      await addReview(business.id, newReview, existingReviews);
      onReviewSubmitted(newReview);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setComment('');
      }, 900);
    } catch (err) {
      console.warn('Error saving review to Firestore:', err);
      // Fallback local addition
      onReviewSubmitted(newReview);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-sky-100 dark:border-slate-800"
        role="dialog"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
          {t('writeReview')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          {lang === 'ar' ? business.nameAr : business.name}
        </p>

        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">
              {lang === 'ar' ? 'تم إضافة تقييمك بنجاح! شكراً لك' : 'Review published successfully! Thank you.'}
            </h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {lang === 'ar' ? 'اختر عدد النجوم:' : 'Select Star Rating:'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} stars`}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                  {rating} / 5
                </span>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'الاسم الكريم' : 'Your Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: محمد العمري' : 'e.g. Mohammed Al-Amri'}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('yourReview')}
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'شاركنا رأيك في جودة الأكل، النظافة، سرعة الخدمة، والتعامل...'
                    : 'Share details of your experience, food quality, service, and atmosphere...'
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Publishing...') : t('submitReview')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
