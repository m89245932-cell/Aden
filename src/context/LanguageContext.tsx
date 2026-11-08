import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    appName: 'عدن جو',
    appSlogan: 'دليل وخريطة أعمال العاصمة عدن الذكية',
    heroBadge: 'المنصة الرسمية المعتمدة لأعمال عدن ⚓',
    heroTitle: 'اكتشف أرقى مفاخر التجارة والحياة في عدن',
    heroSubtitle: 'دليلك الذكي للوصول إلى أفخم المطاعم، الفنادق، الكافيهات والشركات في صيرة، المعلا، والمنصورة مع تواصل فوري مباشر عبر واتساب.',
    searchPlaceholder: 'ابحث باسم المطعم، كافيه، فندق، عيادة، طاقة شمسية...',
    searchButton: 'بحث في عدن',
    allDistricts: 'كل مناطق عدن',
    allCategories: 'جميع التصنيفات',
    browseCategories: 'تصفح حسب قطاع الأعمال',
    featuredBusinesses: 'وجهات مميزة في عدن',
    verifiedBadge: 'موثق رسمياً',
    contactWhatsapp: 'واتساب مباشر',
    callPhone: 'اتصال هاتفي',
    viewProfile: 'عرض التفاصيل والأسعار',
    home: 'الرئيسية',
    listings: 'الدليل التجاري',
    pricing: 'باقات التجّار',
    merchantPortal: 'بوابة التاجر',
    adminPortal: 'لوحة الإدارة',
    signIn: 'تسجيل الدخول',
    signOut: 'خروج',
    addListing: 'أضف نشاطك التجاري',
    rating: 'التقييم',
    reviews: 'مراجعة',
    filterByDistrict: 'تصفية حسب المديرية',
    filterByCategory: 'تصفية حسب التصنيف',
    priceLevel: 'مستوى الأسعار',
    allPrices: 'الكل',
    verifiedOnly: 'الأنشطة الموثقة فقط',
    sortBy: 'ترتيب حسب',
    recommended: 'الموصى به (الأعلى تميزاً)',
    highestRating: 'الأعلى تقييماً',
    mostReviews: 'الأكثر مراجعات',
    mostViews: 'الأكثر مشاهدة',
    clearFilters: 'إعادة ضبط الفلاتر',
    noResultsFound: 'لم نتمكن من العثور على أنشطة مطابقة للبحث المحدد.',
    tryDifferentSearch: 'جرّب البحث بكلمات أخرى أو اختر مديرية مختلفة.',
    writeReview: 'أضف تقييمك ورأيك',
    yourReview: 'رأيك وتجربتك',
    submitReview: 'نشر التقييم',
    openHours: 'ساعات العمل',
    addressLocation: 'العنوان والموقع في عدن',
    contactInfo: 'معلومات التواصل المباشر',
    customerReviews: 'آراء وتقييمات العملاء',
    beFirstReview: 'كن أول من يشارك تجربته مع هذا النشاط!',
    whatsappInquiryPrompt: 'إرسال استفسار فوري عبر واتساب',
    whatsappCustomNotice: 'سيتم نقلك مباشرة إلى تطبيق واتساب لبدء المحادثة مع إدارة المتجر مع نص استفسار معدّ مسبقاً.',
    totalViews: 'إجمالي المشاهدات',
    whatsappLeads: 'نقرات التواصل عبر واتساب',
    conversionRate: 'معدل التحويل التقديري',
    addNewBusiness: 'إضافة نشاط تجاري جديد',
    editBusiness: 'تعديل بيانات النشاط',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    businessNameEn: 'اسم النشاط (بالإنجليزي)',
    businessNameAr: 'اسم النشاط (بالعربي)',
    selectDistrict: 'اختر المديرية',
    selectCategory: 'اختر التصنيف',
    phoneLabel: 'رقم الهاتف الأرضي أو المحمول',
    whatsappLabel: 'رقم الواتساب (مثال: +967 770 123 456)',
    websiteLabel: 'الموقع الإلكتروني (اختياري)',
    imageUrlLabel: 'رابط صورة النشاط (URL)',
    descriptionEnLabel: 'الوصف (بالإنجليزي)',
    descriptionArLabel: 'الوصف (بالعربي)',
    hoursEnLabel: 'أوقات العمل (بالإنجليزي)',
    hoursArLabel: 'أوقات العمل (بالعربي)',
    deleteListing: 'حذف النشاط',
    confirmDelete: 'هل أنت متأكد من رغبتك بحذف هذا النشاط التجاري؟',
    verifiedStatus: 'حالة التوثيق',
    featuredStatus: 'إبراز في الصفحة الرئيسية',
    pricingTitle: 'باقات اشتراك تجار وأعمال عدن',
    pricingSubtitle: 'اختر الخطة المناسبة لمشروعك وابدأ باستقبال زبائنك من كافة مديريات عدن مباشرة عبر واتساب بدون أي وسيط.',
    faqTitle: 'الأسئلة الشائعة لأصحاب الأنشطة في عدن',
    allRightsReserved: 'جميع الحقوق محفوظة لمنصة AdenGo © 2026 عدن، اليمن.'
  },
  en: {
    appName: 'AdenGo',
    appSlogan: 'Smart City Business Directory for Aden, Yemen',
    heroBadge: 'The Official Certified Business Engine of Aden ⚓',
    heroTitle: 'Discover Premier Businesses & Services in Aden',
    heroSubtitle: 'Your smart local gateway to top restaurants, stays, cafes, and suppliers across Crater, Mualla, Khormaksar, and Mansoura with instant WhatsApp contact.',
    searchPlaceholder: 'Search seafood restaurant, specialty cafe, resort, clinic, solar...',
    searchButton: 'Explore Aden',
    allDistricts: 'All Aden Districts',
    allCategories: 'All Categories',
    browseCategories: 'Explore by Industry',
    featuredBusinesses: 'Featured in Aden',
    verifiedBadge: 'Verified Listing',
    contactWhatsapp: 'Chat on WhatsApp',
    callPhone: 'Call Phone',
    viewProfile: 'View Details & Menu',
    home: 'Home',
    listings: 'Directory',
    pricing: 'Merchant Plans',
    merchantPortal: 'Merchant Portal',
    adminPortal: 'Admin Panel',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    addListing: 'Add Your Business',
    rating: 'Rating',
    reviews: 'reviews',
    filterByDistrict: 'Filter by District',
    filterByCategory: 'Filter by Category',
    priceLevel: 'Price Level',
    allPrices: 'All',
    verifiedOnly: 'Verified Only',
    sortBy: 'Sort by',
    recommended: 'Recommended (Featured first)',
    highestRating: 'Highest Rating',
    mostReviews: 'Most Reviews',
    mostViews: 'Most Viewed',
    clearFilters: 'Reset Filters',
    noResultsFound: 'No businesses found matching your criteria.',
    tryDifferentSearch: 'Try searching different terms or selecting another district.',
    writeReview: 'Write a Review',
    yourReview: 'Your Review & Feedback',
    submitReview: 'Submit Review',
    openHours: 'Working Hours',
    addressLocation: 'Location & Address in Aden',
    contactInfo: 'Direct Contact Details',
    customerReviews: 'Customer Reviews',
    beFirstReview: 'Be the first to share your experience with this business!',
    whatsappInquiryPrompt: 'Send Instant WhatsApp Inquiry',
    whatsappCustomNotice: 'You will be redirected straight to WhatsApp with a pre-formatted inquiry text.',
    totalViews: 'Total Views',
    whatsappLeads: 'WhatsApp Leads Generated',
    conversionRate: 'Est. Conversion Rate',
    addNewBusiness: 'Add New Business Listing',
    editBusiness: 'Edit Listing Details',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    businessNameEn: 'Business Name (English)',
    businessNameAr: 'Business Name (Arabic)',
    selectDistrict: 'Select District',
    selectCategory: 'Select Category',
    phoneLabel: 'Landline / Phone Number',
    whatsappLabel: 'WhatsApp Number (e.g. +967 770 123 456)',
    websiteLabel: 'Website URL (Optional)',
    imageUrlLabel: 'Cover Image URL',
    descriptionEnLabel: 'Description (English)',
    descriptionArLabel: 'Description (Arabic)',
    hoursEnLabel: 'Working Hours (English)',
    hoursArLabel: 'Working Hours (Arabic)',
    deleteListing: 'Delete Listing',
    confirmDelete: 'Are you sure you want to delete this listing?',
    verifiedStatus: 'Verified Status',
    featuredStatus: 'Featured on Homepage',
    pricingTitle: 'Merchant Plans for Aden Businesses',
    pricingSubtitle: 'Choose the best plan for your brand and start receiving high-intent customer leads directly on WhatsApp with 0% commissions.',
    faqTitle: 'Frequently Asked Questions by Aden Merchants',
    allRightsReserved: 'All rights reserved to AdenGo © 2026 Aden, Yemen.'
  }
};

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ar']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('adengo_lang');
    return saved === 'en' ? 'en' : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('adengo_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = () => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
  };

  const t = (key: keyof typeof translations['ar']): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
