import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Business, Booking, BookingStatus } from '../types/index';
import { ADEN_DISTRICTS, CATEGORIES } from '../data/seedData';
import { validateBusinessInput, calculateConversionRate, formatWhatsAppUrl } from '../utils/directoryLogic';
import { createBusiness, updateBusiness, deleteBusiness } from '../services/businessService';
import { fetchMerchantBookings, updateBookingStatus } from '../services/bookingService';
import {
  BarChart3,
  TrendingUp,
  MessageCircle,
  Eye,
  Star,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Store,
  Save,
  X,
  Calendar,
  Clock,
  Users,
  Phone,
  CheckCircle2,
  XCircle,
  Filter,
  UserCheck
} from 'lucide-react';

interface MerchantDashboardProps {
  businesses: Business[];
  onBusinessesUpdated: () => void;
  setActivePage: (page: string) => void;
  setSelectedBusiness: (b: Business) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  businesses,
  onBusinessesUpdated,
  setActivePage,
  setSelectedBusiness
}) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  // Active sub-tab: 'listings' or 'bookings'
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings'>('listings');

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // If user has specific listings, filter; otherwise for demo purposes show merchant listings
  const merchantBusinesses = businesses.length > 0 ? businesses.slice(0, 3) : [];
  const merchantBusinessIds = merchantBusinesses.map((b) => b.id);

  useEffect(() => {
    if (merchantBusinessIds.length > 0) {
      setLoadingBookings(true);
      fetchMerchantBookings(merchantBusinessIds).then((items) => {
        setBookings(items);
        setLoadingBookings(false);
      });
    }
  }, [merchantBusinesses.length]);

  const refreshBookings = async () => {
    if (merchantBusinessIds.length > 0) {
      const items = await fetchMerchantBookings(merchantBusinessIds);
      setBookings(items);
    }
  };

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  const totalViews = merchantBusinesses.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalLeads = merchantBusinesses.reduce((acc, b) => acc + (b.leads || 0), 0);
  const avgRating = merchantBusinesses.length > 0
    ? (merchantBusinesses.reduce((acc, b) => acc + b.rating, 0) / merchantBusinesses.length).toFixed(1)
    : '5.0';
  const conversionRate = calculateConversionRate(totalViews, totalLeads);

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState('restaurants');
  const [district, setDistrict] = useState('crater');
  const [address, setAddress] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [priceLevel, setPriceLevel] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [hoursEn, setHoursEn] = useState('9:00 AM - 10:00 PM');
  const [hoursAr, setHoursAr] = useState('9:00 ص - 10:00 م');
  const [lat, setLat] = useState<number>(12.7758);
  const [lng, setLng] = useState<number>(45.0392);
  const [acceptsBookings, setAcceptsBookings] = useState<boolean>(true);

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const openAddForm = () => {
    setEditingBusiness(null);
    setName('');
    setNameAr('');
    setCategory('restaurants');
    setDistrict('crater');
    setAddress('Main Road, Crater, Aden');
    setAddressAr('الشارع العام، كريتر، عدن');
    setPriceLevel('$$');
    setWhatsapp('+967 770 123 456');
    setPhone('+967 2 250000');
    setWebsite('');
    setImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80');
    setDescription('Serving authentic Adeni dishes and fresh beverages with warm local hospitality.');
    setDescriptionAr('أشهى المأكولات والمشروبات العدنية الأصيلة بضيافة محلية راقية.');
    setHoursEn('9:00 AM - 11:00 PM');
    setHoursAr('9:00 ص - 11:00 م');
    setLat(12.7758);
    setLng(45.0392);
    setAcceptsBookings(true);
    setFormErrors([]);
    setFormOpen(true);
  };

  const openEditForm = (b: Business) => {
    setEditingBusiness(b);
    setName(b.name);
    setNameAr(b.nameAr);
    setCategory(b.category);
    setDistrict(b.district);
    setAddress(b.address);
    setAddressAr(b.addressAr);
    setPriceLevel(b.priceLevel);
    setWhatsapp(b.whatsapp);
    setPhone(b.phone);
    setWebsite(b.website || '');
    setImage(b.image);
    setDescription(b.description);
    setDescriptionAr(b.descriptionAr);
    setHoursEn(b.hoursEn);
    setHoursAr(b.hoursAr);
    setLat(b.lat || 12.8000);
    setLng(b.lng || 45.0100);
    setAcceptsBookings(b.acceptsBookings ?? true);
    setFormErrors([]);
    setFormOpen(true);
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const found = ADEN_DISTRICTS.find((d) => d.id === newDist);
    if (found && found.lat && found.lng) {
      setLat(found.lat);
      setLng(found.lng);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Business> = {
      name: name.trim(),
      nameAr: nameAr.trim(),
      category,
      district,
      address: address.trim(),
      addressAr: addressAr.trim(),
      priceLevel,
      whatsapp: whatsapp.trim(),
      phone: phone.trim(),
      website: website.trim(),
      image: image.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      description: description.trim(),
      descriptionAr: descriptionAr.trim(),
      hoursEn: hoursEn.trim(),
      hoursAr: hoursAr.trim(),
      lat: Number(lat),
      lng: Number(lng),
      acceptsBookings
    };

    const validation = validateBusinessInput(payload);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSaving(true);
    try {
      if (editingBusiness) {
        await updateBusiness(editingBusiness.id, payload);
      } else {
        const newBiz: Business = {
          id: `biz-${Date.now()}`,
          name: payload.name!,
          nameAr: payload.nameAr!,
          category: payload.category!,
          district: payload.district!,
          address: payload.address!,
          addressAr: payload.addressAr!,
          priceLevel: payload.priceLevel as any,
          whatsapp: payload.whatsapp!,
          phone: payload.phone!,
          website: payload.website,
          image: payload.image!,
          description: payload.description!,
          descriptionAr: payload.descriptionAr!,
          hoursEn: payload.hoursEn!,
          hoursAr: payload.hoursAr!,
          lat: payload.lat,
          lng: payload.lng,
          acceptsBookings: payload.acceptsBookings ?? true,
          rating: 5.0,
          reviewsCount: 1,
          verified: false,
          featured: false,
          ownerId: user?.uid || 'merchant-local',
          views: 12,
          leads: 2,
          createdAt: new Date().toISOString()
        };
        await createBusiness(newBiz);
      }

      setSaveSuccess(true);
      onBusinessesUpdated();
      setTimeout(() => {
        setSaveSuccess(false);
        setFormOpen(false);
      }, 700);
    } catch (err) {
      console.warn('Failed saving business:', err);
      onBusinessesUpdated();
      setFormOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك بحذف هذا النشاط التجاري؟' : 'Are you sure you want to delete this listing?')) {
      try {
        await deleteBusiness(id);
        onBusinessesUpdated();
      } catch (err) {
        console.warn('Delete failed:', err);
        onBusinessesUpdated();
      }
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    await updateBookingStatus(bookingId, status);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b))
    );
    const msg =
      status === 'confirmed'
        ? (lang === 'ar' ? 'تم تأكيد الحجز بنجاح' : 'Reservation confirmed successfully')
        : (lang === 'ar' ? 'تم الاعتذار عن الحجز' : 'Reservation declined');
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleContactCustomerWhatsApp = (b: Booking) => {
    const businessName = lang === 'ar' ? b.businessNameAr : b.businessName;
    const msg =
      lang === 'ar'
        ? `مرحباً أخي ${b.customerName}، معكم إدارة ${businessName}. بخصوص طلب حجزكم رقم #${b.id.slice(-6)} بتاريخ ${b.date} الساعة ${b.time} لعدد ${b.guestsCount} أشخاص: تم استلام طلبكم ومرحباً بكم!`
        : `Hello ${b.customerName}, this is ${businessName}. Regarding your booking ref #${b.id.slice(-6)} on ${b.date} at ${b.time} for ${b.guestsCount} guests: We look forward to welcoming you!`;
    const url = formatWhatsAppUrl(b.customerPhone, msg);
    window.open(url, '_blank');
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-sky-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-700/60 text-sky-200 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بوابة إدارة أعمال عدن' : 'Aden Merchant Center'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {lang === 'ar' ? 'لوحة تحليلات ونشاط متجرك' : 'Merchant Business Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
            {lang === 'ar'
              ? 'متابعة نقرات الواتساب، إدارة الحجوزات المباشرة، وتحديث بيانات القائمة وساعات العمل'
              : 'Track incoming WhatsApp leads, manage table reservations, and update listing details.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-lg transition active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('addNewBusiness')}</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Views */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {t('totalViews')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalViews.toLocaleString()}
            </div>
            <span className="text-[10px] text-sky-500 font-bold mt-1 block">
              ↑ 18% {lang === 'ar' ? 'هذا الأسبوع' : 'this week'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        {/* WhatsApp Leads */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {t('whatsappLeads')}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {totalLeads.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-500 font-bold mt-1 block">
              ↑ 24% {lang === 'ar' ? 'طلبات مباشرة' : 'direct inquiries'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Bookings */}
        <div
          onClick={() => setActiveTab('bookings')}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition"
        >
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {lang === 'ar' ? 'حجوزات جديدة بانتظار التأكيد' : 'Pending Reservations'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
              {pendingBookingsCount}
            </div>
            <span className="text-[10px] text-sky-500 font-bold mt-1 block">
              {bookings.length} {lang === 'ar' ? 'إجمالي الحجوزات' : 'total requests'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center relative">
            <Calendar className="w-6 h-6" />
            {pendingBookingsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
            )}
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {lang === 'ar' ? 'متوسط تقييم العملاء' : 'Average Rating'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{avgRating}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
            </div>
            <span className="text-[10px] text-emerald-500 font-bold mt-1 block">
              {lang === 'ar' ? 'ممتاز في عدن' : 'Top rated in city'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-2xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'listings'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>{lang === 'ar' ? 'المتاجر والأنشطة' : 'My Listings'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 text-white font-mono">
            {merchantBusinesses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-2xl font-bold text-xs sm:text-sm transition relative ${
            activeTab === 'bookings'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{lang === 'ar' ? 'حجوزات الزبائن والمواعيد' : 'Customer Bookings'}</span>
          {pendingBookingsCount > 0 ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono font-bold animate-pulse">
              {pendingBookingsCount}
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
              {bookings.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Bookings Management */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{lang === 'ar' ? 'إدارة طلبات الحجوزات الواردة' : 'Incoming Reservation Requests'}</span>
                {pendingBookingsCount > 0 && (
                  <span className="text-xs font-bold py-0.5 px-2.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                    {pendingBookingsCount} {lang === 'ar' ? 'جديد بحاجة لتأكيد' : 'require action'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'يمكنك تأكيد الحجز أو الاعتذار والتواصل مباشرة مع الزبون عبر الواتساب لتجهيز الطاولة'
                  : 'Confirm or decline reservation requests, or message customers directly via WhatsApp.'}
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
              {(['all', 'pending', 'confirmed', 'declined'] as const).map((status) => {
                const count =
                  status === 'all'
                    ? bookings.length
                    : bookings.filter((b) => b.status === status).length;
                return (
                  <button
                    key={status}
                    onClick={() => setBookingFilter(status)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition capitalize ${
                      bookingFilter === status
                        ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>
                      {status === 'all'
                        ? (lang === 'ar' ? 'الكل' : 'All')
                        : status === 'pending'
                        ? (lang === 'ar' ? 'قيد الانتظار' : 'Pending')
                        : status === 'confirmed'
                        ? (lang === 'ar' ? 'مؤكدة' : 'Confirmed')
                        : (lang === 'ar' ? 'معتذر عنها' : 'Declined')}
                    </span>
                    <span className="text-[10px] opacity-70 ml-1">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Calendar className="w-12 h-12 mx-auto stroke-1 opacity-40" />
              <p className="text-sm font-semibold">
                {lang === 'ar' ? 'لا توجد حجوزات في هذا التصنيف' : 'No reservations in this status category.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-700 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-900">
                        #{b.id.slice(-6)}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {lang === 'ar' ? b.businessNameAr : b.businessName}
                        </h4>
                        <span className="text-[11px] text-slate-400">{b.createdAt}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : b.status === 'declined'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {b.status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {b.status === 'declined' && <XCircle className="w-3.5 h-3.5" />}
                      {b.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                      <span>
                        {b.status === 'confirmed'
                          ? (lang === 'ar' ? 'حجز مؤكد' : 'Confirmed')
                          : b.status === 'declined'
                          ? (lang === 'ar' ? 'معتذر عنه' : 'Declined')
                          : (lang === 'ar' ? 'بانتظار موافقتكم' : 'Pending Confirmation')}
                      </span>
                    </span>
                  </div>

                  {/* Customer & Booking Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        {lang === 'ar' ? 'اسم الزبون / الضيف' : 'Customer Name'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-sky-500" />
                        <span>{b.customerName}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        {lang === 'ar' ? 'تاريخ ووقت الحجز' : 'Date & Time'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        <span>{b.date} · {b.time}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        {lang === 'ar' ? 'عدد المقاعد / الضيوف' : 'Party Size'}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-500" />
                        <span>{b.guestsCount} {lang === 'ar' ? 'أشخاص' : 'guests'}</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[11px] mb-0.5">
                        {lang === 'ar' ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {b.customerPhone}
                      </span>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {b.specialRequests && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                      <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                        {lang === 'ar' ? 'ملاحظات وتفضيلات الزبون:' : 'Customer Notes:'}
                      </span>
                      <p className="italic text-slate-700 dark:text-slate-300">"{b.specialRequests}"</p>
                    </div>
                  )}

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                            className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{lang === 'ar' ? 'تأكيد الحجز' : 'Confirm'}</span>
                          </button>

                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'declined')}
                            className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs transition"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>{lang === 'ar' ? 'اعتذار عن الحجز' : 'Decline'}</span>
                          </button>
                        </>
                      )}

                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'declined')}
                          className="text-[11px] font-semibold text-slate-500 hover:text-rose-500 transition"
                        >
                          {lang === 'ar' ? 'تغيير إلى اعتذار' : 'Change to Declined'}
                        </button>
                      )}

                      {b.status === 'declined' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                          className="text-[11px] font-semibold text-emerald-600 hover:underline transition"
                        >
                          {lang === 'ar' ? 'إعادة تأكيد الحجز' : 'Re-confirm Booking'}
                        </button>
                      )}
                    </div>

                    {/* Customer Direct Contact */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleContactCustomerWhatsApp(b)}
                        className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lang === 'ar' ? 'مراسلة الزبون واتساب' : 'Message on WhatsApp'}</span>
                      </button>

                      <a
                        href={`tel:${b.customerPhone}`}
                        className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-sky-500" />
                        <span>{lang === 'ar' ? 'اتصال' : 'Call'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Merchant Listings Table */}
      {activeTab === 'listings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar' ? 'الأنشطة والمتاجر المسجلة باسمك' : 'Your Managed Business Listings'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar' ? 'يمكنك تعديل بيانات الاتصال ورقم الواتساب وساعات العمل وتفعيل الحجوزات' : 'Edit photos, WhatsApp contact, hours, and reservation eligibility'}
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('addListing')}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {merchantBusinesses.map((b) => (
              <div
                key={b.id}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {lang === 'ar' ? b.nameAr : b.name}
                      </h3>
                      {b.verified && (
                        <span className="bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-sky-500" />
                          <span>{t('verifiedBadge')}</span>
                        </span>
                      )}
                      {b.acceptsBookings && (
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-500" />
                          <span>{lang === 'ar' ? 'يقبل الحجز' : 'Bookings active'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {ADEN_DISTRICTS.find(d => d.id === b.district)?.[lang]} • {CATEGORIES.find(c => c.id === b.category)?.[lang]} • 💬 {b.whatsapp}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 font-medium">
                      <span>👁️ {b.views} {lang === 'ar' ? 'مشاهدة' : 'views'}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        💬 {b.leads} {lang === 'ar' ? 'نقرة واتساب' : 'leads'}
                      </span>
                      <span>•</span>
                      <span>⭐ {b.rating} ({b.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSelectedBusiness(b);
                      setActivePage('business-profile');
                    }}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-bold flex items-center gap-1"
                    title="View in directory"
                  >
                    <ExternalLink className="w-4 h-4 text-sky-500" />
                    <span className="hidden md:inline">{lang === 'ar' ? 'معاينة' : 'View'}</span>
                  </button>

                  <button
                    onClick={() => openEditForm(b)}
                    className="p-2 rounded-xl text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 transition text-xs font-bold flex items-center gap-1"
                    title="Edit details"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden md:inline">{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteListing(b.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition text-xs font-bold"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit / Add Business Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-100 dark:border-slate-800 my-8">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
              {editingBusiness ? t('editBusiness') : t('addNewBusiness')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {lang === 'ar'
                ? 'أدخل بيانات نشاطك التجاري في عدن ورقم الواتساب المعتمد وتفعيل خدمة الحجوزات'
                : 'Enter details for your Aden establishment, WhatsApp contact, and booking preferences.'}
            </p>

            {/* Error notifications */}
            {formErrors.length > 0 && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                {formErrors.map((err, i) => (
                  <p key={i} className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{err}</span>
                  </p>
                ))}
              </div>
            )}

            {saveSuccess ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'ar' ? 'تم حفظ التغييرات بنجاح في قاعدة البيانات!' : 'Saved successfully to database!'}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('businessNameAr')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      placeholder="مثال: مطعم شاطئ صيرة"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('businessNameEn')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sira Bay Seafood"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* District & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('selectDistrict')} *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {ADEN_DISTRICTS.slice(1).map((d) => (
                        <option key={d.id} value={d.id}>
                          {lang === 'ar' ? d.ar : d.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('selectCategory')} *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {lang === 'ar' ? c.ar : c.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('priceLevel')}
                    </label>
                    <select
                      value={priceLevel}
                      onChange={(e) => setPriceLevel(e.target.value as any)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="$">$ (اقتصادي - Budget)</option>
                      <option value="$$">$$ (متوسط - Moderate)</option>
                      <option value="$$$">$$$ (راقي - Premium)</option>
                      <option value="$$$$">$$$$ (فاخر - Luxury)</option>
                    </select>
                  </div>
                </div>

                {/* Reservation Eligibility Toggle */}
                <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {lang === 'ar' ? 'تفعيل خدمة الحجز المباشر (طاولات / مواعيد)' : 'Enable Online Table & Service Bookings'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === 'ar'
                          ? 'إظهار زر "احجز الآن" لتمكين الزبائن من تحديد التاريخ والوقت والضيوف'
                          : 'Displays "Book Now" CTA on profile for direct reservation requests.'}
                      </span>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptsBookings}
                      onChange={(e) => setAcceptsBookings(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-sky-600"></div>
                  </label>
                </div>

                {/* WhatsApp & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('whatsappLabel')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+967 770 123 456"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('phoneLabel')}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+967 2 250000"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('imageUrlLabel')}
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      العنوان باللغة العربية
                    </label>
                    <input
                      type="text"
                      value={addressAr}
                      onChange={(e) => setAddressAr(e.target.value)}
                      placeholder="شارع أروى، صيرة، عدن"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Address in English
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Arwa Street, Crater, Aden"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* GPS Coordinates for Google Maps */}
                <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-900 dark:text-sky-300">
                      {lang === 'ar' ? 'إحداثيات الموقع على خريطة Google Maps (GPS)' : 'Google Maps Location Coordinates'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'ar' ? 'تتغير تلقائياً مع اختيار المديرية' : 'Auto-syncs with selected district'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Latitude (خط العرض)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Longitude (خط الطول)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lng}
                        onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('descriptionArLabel')}
                    </label>
                    <textarea
                      rows={3}
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      placeholder="نبذة عن المأكولات، الخدمات، وما يميز متجركم..."
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t('descriptionEnLabel')}
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Summary of services, cuisine, and specialties..."
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="py-2.5 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('saveChanges')}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
