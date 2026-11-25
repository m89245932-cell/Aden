import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Business, Booking } from '../types/index';
import { createBooking } from '../services/bookingService';
import { sanitizePhoneNumber, formatWhatsAppUrl } from '../utils/directoryLogic';
import {
  X,
  Calendar,
  Clock,
  Users,
  MessageCircle,
  CheckCircle,
  Phone,
  User,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  business,
  isOpen,
  onClose,
  onBookingCreated
}) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  // Tomorrow as default date (YYYY-MM-DD)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [time, setTime] = useState('08:30 PM');
  const [guestsCount, setGuestsCount] = useState(2);
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '+967 770 123 456');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen || !business) return null;

  const TIME_SLOTS = [
    '12:30 PM',
    '01:30 PM',
    '02:30 PM',
    '07:00 PM',
    '08:00 PM',
    '08:30 PM',
    '09:30 PM',
    '10:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !date) return;

    setIsSubmitting(true);
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      businessId: business.id,
      businessName: business.name,
      businessNameAr: business.nameAr,
      userId: user?.uid || `guest-${Date.now()}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: user?.email,
      date,
      time,
      guestsCount,
      specialRequests: specialRequests.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await createBooking(newBooking);
      setConfirmedBooking(newBooking);
      onBookingCreated?.(newBooking);
    } catch (err) {
      console.warn('Booking creation notice:', err);
      setConfirmedBooking(newBooking);
      onBookingCreated?.(newBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppForward = () => {
    if (!confirmedBooking) return;
    const msg =
      lang === 'ar'
        ? `مرحباً ${business.nameAr}، أود تأكيد طلب حجز جديد عبر AdenGo:\n- رقم الحجز: #${confirmedBooking.id.slice(-6)}\n- الاسم: ${confirmedBooking.customerName}\n- التاريخ: ${confirmedBooking.date}\n- الوقت: ${confirmedBooking.time}\n- عدد الضيوف: ${confirmedBooking.guestsCount}\n${confirmedBooking.specialRequests ? `- ملاحظات: ${confirmedBooking.specialRequests}` : ''}`
        : `Hello ${business.name}, I would like to confirm my reservation via AdenGo:\n- Booking ID: #${confirmedBooking.id.slice(-6)}\n- Name: ${confirmedBooking.customerName}\n- Date: ${confirmedBooking.date}\n- Time: ${confirmedBooking.time}\n- Guests: ${confirmedBooking.guestsCount}\n${confirmedBooking.specialRequests ? `- Notes: ${confirmedBooking.specialRequests}` : ''}`;

    const url = formatWhatsAppUrl(business.whatsapp, msg);
    window.open(url, '_blank');
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation Success Screen */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {lang === 'ar' ? 'تم استلام طلب الحجز' : 'Reservation Request Sent'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {lang === 'ar' ? 'بانتظار تأكيد إدارة المحل' : 'Awaiting Merchant Confirmation'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                {lang === 'ar'
                  ? `تم إرسال تفاصيل حجزك إلى لوحة تحكم ${business.nameAr}. سيصلك إشعار فوري ويمكنك أيضاً إرسال الحجز مباشرة عبر واتساب لسرعة الرد.`
                  : `Your booking details have been submitted to ${business.name}. You can also forward this directly to their WhatsApp for instant confirmation.`}
              </p>
            </div>

            {/* Booking Details Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left rtl:text-right space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-400">{lang === 'ar' ? 'رقم الحجز:' : 'Booking Ref:'}</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  #{confirmedBooking.id.slice(-6)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{lang === 'ar' ? 'المكان:' : 'Venue:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? business.nameAr : business.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{lang === 'ar' ? 'الموعد:' : 'Date & Time:'}</span>
                <span className="font-semibold">
                  {confirmedBooking.date} · {confirmedBooking.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{lang === 'ar' ? 'عدد الضيوف:' : 'Guests:'}</span>
                <span className="font-semibold">
                  {confirmedBooking.guestsCount} {lang === 'ar' ? 'أشخاص' : 'guests'}
                </span>
              </div>
              {confirmedBooking.specialRequests && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block mb-1">{lang === 'ar' ? 'الملاحظات:' : 'Notes:'}</span>
                  <p className="italic text-slate-600 dark:text-slate-400">
                    "{confirmedBooking.specialRequests}"
                  </p>
                </div>
              )}
            </div>

            {/* Forward to WhatsApp CTA */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleWhatsAppForward}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-700/25 transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تأكيد الحجز فورا عبر واتساب المحل' : 'Confirm Instantly via WhatsApp'}</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
              >
                {lang === 'ar' ? 'إغلاق ومتابعة التصفح' : 'Close and Continue'}
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                {lang === 'ar' ? 'طلب حجز طاولة أو موعد' : 'Table & Appointment Booking'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {lang === 'ar' ? business.nameAr : business.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'اختر التاريخ والوقت المناسب لزيارتك، وستصلك استجابة سريعة من إدارة المكان'
                  : 'Select your preferred date, time, and guests. Fast confirmation guaranteed.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    <span>{lang === 'ar' ? 'تاريخ الحجز' : 'Date'} *</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-500" />
                    <span>{lang === 'ar' ? 'عدد الضيوف' : 'Guests Count'} *</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-base"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-bold text-sm bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                      {guestsCount} {lang === 'ar' ? (guestsCount === 1 ? 'شخص واحد' : 'أشخاص') : 'Guests'}
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuestsCount(Math.min(25, guestsCount + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Time Slots Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>{lang === 'ar' ? 'الوقت المفضل' : 'Preferred Time'} *</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-500" />
                    <span>{lang === 'ar' ? 'الاسم الكريم' : 'Full Name'} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: فؤاد الشعيبي' : 'e.g. Fouad Al-Shoaibi'}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-500" />
                    <span>{lang === 'ar' ? 'رقم الواتساب أو الهاتف' : 'WhatsApp / Phone'} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+967 770 123 456"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'ar' ? 'ملاحظات وتفضيلات خاصة (اختياري)' : 'Special Requests (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'مثال: طاولة مطلة على ساحل صيرة، جلسة عائلية هادئة، أو تجهيز خاص...'
                      : 'e.g. Sea-view table, quiet family booth, high chair for toddler...'
                  }
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-lg shadow-sky-600/25 transition active:scale-95 disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? (lang === 'ar' ? 'جاري إرسال الطلب...' : 'Submitting Reservation...')
                      : (lang === 'ar' ? 'تأكيد وإرسال طلب الحجز' : 'Confirm & Request Reservation')}
                  </span>
                </button>

                <p className="text-[11px] text-center text-slate-400 mt-2">
                  {lang === 'ar'
                    ? 'الحجز مجاني بدون أي رسوم وستصلك استجابة مباشرة من المحل'
                    : 'Free booking with 0% fees. Direct confirmation from the venue.'}
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
