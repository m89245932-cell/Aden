import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Booking, Business, Review } from '../types/index';
import { fetchUserBookings, updateBookingStatus } from '../services/bookingService';
import { ADEN_DISTRICTS } from '../data/seedData';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  Save,
  CheckCircle,
  XCircle,
  Clock3,
  MessageCircle,
  Star,
  ShieldCheck,
  Store,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface UserProfilePageProps {
  businesses: Business[];
  setActivePage: (page: string) => void;
  setSelectedBusiness: (b: Business) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  businesses,
  setActivePage,
  setSelectedBusiness
}) => {
  const { lang, t } = useLanguage();
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'reviews'>('bookings');
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Profile Form state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+967 770 123 456');
  const [district, setDistrict] = useState(user?.district || 'crater');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setPhoneNumber(user.phoneNumber || '+967 770 123 456');
      setDistrict(user.district || 'crater');
      setBio(user.bio || '');

      setLoadingBookings(true);
      fetchUserBookings(user.uid)
        .then((b) => setUserBookings(b))
        .finally(() => setLoadingBookings(false));
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setIsSaving(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
        district,
        bio: bio.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك بإلغاء هذا الحجز؟' : 'Are you sure you want to cancel this booking?')) {
      await updateBookingStatus(bookingId, 'cancelled');
      setUserBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-slate-800 text-sky-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {lang === 'ar' ? 'يرجى تسجيل الدخول لعرض ملفك الشخصي' : 'Please Sign In to View Your Profile'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {lang === 'ar'
            ? 'سجّل دخولك لمتابعة حالة حجوزات الطاولات والعيادات، وتعديل بيانات الاتصال الخاصة بك.'
            : 'Sign in to review your reservations, track confirmation status, and update your profile.'}
        </p>
        <button
          onClick={() => setActivePage('listings')}
          className="py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition"
        >
          {lang === 'ar' ? 'تصفح الدليل التجاري' : 'Explore AdenGo Directory'}
        </button>
      </div>
    );
  }

  const pendingCount = userBookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = userBookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Profile Header Hero */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-300 text-slate-950 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shadow-sky-950/50 shrink-0">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {user.displayName}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30">
                  {user.role === 'admin'
                    ? (lang === 'ar' ? 'مسؤول النظام' : 'Admin')
                    : user.role === 'merchant'
                    ? (lang === 'ar' ? 'تاجر عدني موثق' : 'Merchant')
                    : (lang === 'ar' ? 'مستخدم معتمد' : 'Verified Member')}
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 opacity-70" />
                  <span>{user.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 opacity-70" />
                  <span>{ADEN_DISTRICTS.find((d) => d.id === user.district)?.[lang] || 'عدن'}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'merchant' || user.role === 'admin' ? (
              <button
                onClick={() => setActivePage('merchant-dashboard')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-sky-950 font-bold text-xs hover:bg-sky-50 transition shadow-md"
              >
                <Store className="w-4 h-4 text-sky-600" />
                <span>{lang === 'ar' ? 'بوابة التاجر' : 'Merchant Portal'}</span>
              </button>
            ) : null}

            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl border border-sky-400/40 text-sky-200 hover:bg-white/10 font-bold text-xs transition"
            >
              {lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'ar' ? 'حجوزاتي ومواعيدي' : 'My Reservations'}</span>
          {userBookings.length > 0 && (
            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${activeTab === 'bookings' ? 'bg-sky-800 text-sky-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
              {userBookings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'سجل الحجوزات والمواعيد' : 'My Reservations History'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'ar'
                  ? 'متابعة حالة حجوزات الطاولات في المطاعم وشاليهات المنتجعات والمواعيد الطبية'
                  : 'Track confirmation status for your dining, resorts, and appointment bookings'}
              </p>
            </div>

            <button
              onClick={() => setActivePage('listings')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:underline"
            >
              <span>{lang === 'ar' ? 'حجز جديد من الدليل' : 'Book a New Venue'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          {loadingBookings ? (
            <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
              {lang === 'ar' ? 'جاري تحميل الحجوزات...' : 'Loading your reservations...'}
            </div>
          ) : userBookings.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
                {lang === 'ar' ? 'لا توجد لديك حجوزات حتى الآن' : 'No Reservations Yet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'يمكنك الآن حجز طاولة أو موعد في أشهر مطاعم وفنادق وعيادات عدن بنقرة واحدة.'
                  : 'Explore verified restaurants, seaside resorts, and clinics in Aden to make your first booking.'}
              </p>
              <button
                onClick={() => setActivePage('listings')}
                className="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-md"
              >
                {lang === 'ar' ? 'تصفح الأماكن المتاحة للحجز' : 'Find Places to Book'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userBookings.map((booking) => {
                const venue = businesses.find((b) => b.id === booking.businessId);
                const isPending = booking.status === 'pending';
                const isConfirmed = booking.status === 'confirmed';
                const isDeclined = booking.status === 'declined';
                const isCancelled = booking.status === 'cancelled';

                return (
                  <div
                    key={booking.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">
                            #{booking.id.slice(-6)}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isConfirmed
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                                : isPending
                                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                                : isDeclined
                                ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isConfirmed
                              ? (lang === 'ar' ? '✓ تم التأكيد' : 'Confirmed')
                              : isPending
                              ? (lang === 'ar' ? '⏳ بانتظار التأكيد' : 'Pending')
                              : isDeclined
                              ? (lang === 'ar' ? '✕ تم الاعتذار' : 'Declined')
                              : (lang === 'ar' ? 'ملغي' : 'Cancelled')}
                          </span>
                        </div>
                        <h3
                          onClick={() => {
                            if (venue) {
                              setSelectedBusiness(venue);
                              setActivePage('business-profile');
                            }
                          }}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-sky-600 cursor-pointer transition line-clamp-1"
                        >
                          {lang === 'ar' ? booking.businessNameAr : booking.businessName}
                        </h3>
                      </div>

                      {venue && (
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                        <span>{lang === 'ar' ? 'عدد الضيوف:' : 'Guests:'}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {booking.guestsCount} {lang === 'ar' ? 'أشخاص' : 'guests'}
                        </span>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">
                        "{booking.specialRequests}"
                      </p>
                    )}

                    {booking.merchantNotes && (
                      <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[11px] text-sky-800 dark:text-sky-300">
                        <span className="font-bold">{lang === 'ar' ? 'رد الإدارة:' : 'Merchant Note:'} </span>
                        <span>{booking.merchantNotes}</span>
                      </div>
                    )}

                    {/* Quick actions for booking */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {venue && (
                        <a
                          href={`https://wa.me/${venue.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            lang === 'ar'
                              ? `مرحباً ${venue.nameAr}، أود الاستفسار عن حجزي رقم #${booking.id.slice(-6)} لتاريخ ${booking.date}.`
                              : `Hello ${venue.name}, inquiring about reservation #${booking.id.slice(-6)} on ${booking.date}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'واتساب المحل' : 'WhatsApp'}</span>
                        </a>
                      )}

                      {isPending && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-[11px] font-semibold text-rose-500 hover:underline"
                        >
                          {lang === 'ar' ? 'إلغاء الطلب' : 'Cancel Request'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'ar' ? 'بيانات الحساب والملف الشخصي' : 'Profile & Account Settings'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'تحديث اسمك ورقم هاتفك والمديرية الافتراضية لتسهيل الحجوزات والتواصل'
                : 'Update your display details to streamline fast bookings and communications'}
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'تم حفظ التعديلات بنجاح!' : 'Profile updated successfully!'}</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'الاسم الظاهر' : 'Display Name'} *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'رقم الواتساب أو الهاتف' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+967 770 123 456"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'ar' ? 'المديرية المفضلة في عدن' : 'Preferred District in Aden'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {ADEN_DISTRICTS.slice(1).map((d) => (
                    <option key={d.id} value={d.id}>
                      {lang === 'ar' ? d.ar : d.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'ar' ? 'نبذة شخصية قصيرة' : 'Short Bio / Notes'}
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'اكتب نبذة عن اهتماماتك أو تفضيلاتك في زيارة مطاعم وشواطئ عدن...'
                    : 'A short sentence about your dining preferences in Aden...'
                }
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ التعديلات' : 'Save Profile')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
