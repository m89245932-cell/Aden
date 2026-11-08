import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Business } from './types/index';
import { fetchBusinesses, recordView } from './services/businessService';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { InquiryModal } from './components/InquiryModal';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { BusinessProfilePage } from './pages/BusinessProfilePage';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { PricingPage } from './pages/PricingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Anchor, AlertTriangle, ExternalLink, X } from 'lucide-react';

function AppContent() {
  const { lang, t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const [activePage, setActivePage] = useState<string>('home');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('adengo_theme') === 'dark';
  });

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryBusiness, setInquiryBusiness] = useState<Business | null>(null);

  // Sync dark theme with document.documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adengo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adengo_theme', 'light');
    }
  }, [isDark]);

  // Load businesses from Firestore
  const loadBusinesses = async () => {
    try {
      const data = await fetchBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.warn('Failed to fetch businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, []);

  // Google Maps Platform Tier 2 Quota Defense listener
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setGmpQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const handleOpenInquiry = (b: Business) => {
    setInquiryBusiness(b);
    setInquiryModalOpen(true);
  };

  const handleSelectBusiness = (b: Business) => {
    setSelectedBusiness(b);
    setActivePage('business-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Record view in Firestore asynchronously
    recordView(b.id).catch(() => {});
  };

  const handleLeadRecorded = (businessId: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === businessId ? { ...b, leads: (b.leads || 0) + 1 } : b))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={(p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDark}
        setIsDark={setIsDark}
        openAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Case A: Google Maps Platform Quota Exceeded Sticky Defense Banner */}
      {gmpQuotaExceeded && (
        <div className="sticky top-0 z-50 bg-amber-500 dark:bg-amber-600 text-slate-950 font-medium px-4 py-3 shadow-lg border-b border-amber-600 dark:border-amber-700 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 max-w-5xl">
            <AlertTriangle className="w-5 h-5 shrink-0 text-slate-950" />
            <p className="leading-snug">
              {lang === 'ar' ? (
                <>
                  <span className="font-bold">تنبيه حصة الخرائط:</span> تم تجاوز الحصة المجانية المؤقتة لمفتاح Google Maps التجريبي. للاستمرار في عرض الخرائط بكامل طاقتها، يرجى التبديل إلى مفتاحك الشخصي مع تفعيل الفوترة:{' '}
                </>
              ) : (
                <>
                  <span className="font-bold">Google Maps Quota Notice:</span> Demo key quota exceeded. Switch to a personal key with billing enabled:{' '}
                </>
              )}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold inline-flex items-center gap-1 hover:text-black ml-1"
              >
                <span>{lang === 'ar' ? 'دليل إعداد المفتاح والفوترة' : 'Setup Guide & Billing'}</span>
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>
            </p>
          </div>
          <button
            onClick={() => setGmpQuotaExceeded(false)}
            aria-label="Dismiss banner"
            className="p-1.5 rounded-lg hover:bg-amber-600/40 text-slate-950 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-700 via-sky-600 to-sky-400 text-white flex items-center justify-center animate-pulse shadow-lg shadow-sky-600/30">
              <Anchor className="w-7 h-7 animate-spin" />
            </div>
            <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {lang === 'ar' ? 'جاري تحميل دليل أعمال عدن...' : 'Loading AdenGo Directory...'}
            </p>
          </div>
        ) : (
          <>
            {activePage === 'home' && (
              <HomePage
                businesses={businesses}
                setActivePage={setActivePage}
                setSelectedBusiness={handleSelectBusiness}
                setSelectedCategory={setSelectedCategory}
                setSelectedDistrict={setSelectedDistrict}
                openInquiryModal={handleOpenInquiry}
              />
            )}

            {activePage === 'listings' && (
              <ListingsPage
                businesses={businesses}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setActivePage={setActivePage}
                setSelectedBusiness={handleSelectBusiness}
                openInquiryModal={handleOpenInquiry}
              />
            )}

            {activePage === 'business-profile' && selectedBusiness && (
              <BusinessProfilePage
                business={selectedBusiness}
                setActivePage={setActivePage}
                openInquiryModal={handleOpenInquiry}
              />
            )}

            {activePage === 'merchant-dashboard' && (
              <MerchantDashboard
                businesses={businesses}
                onBusinessesUpdated={loadBusinesses}
                setActivePage={setActivePage}
                setSelectedBusiness={handleSelectBusiness}
              />
            )}

            {activePage === 'pricing' && (
              <PricingPage setActivePage={setActivePage} />
            )}

            {activePage === 'admin-dashboard' && (
              <AdminDashboard
                businesses={businesses}
                onBusinessesUpdated={loadBusinesses}
                setActivePage={setActivePage}
                setSelectedBusiness={handleSelectBusiness}
              />
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setActivePage={setActivePage}
        setSelectedDistrict={setSelectedDistrict}
      />

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccessNavigate={(target) => setActivePage(target)}
      />

      {/* Global WhatsApp Inquiry Modal */}
      <InquiryModal
        business={inquiryBusiness}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        onLeadRecorded={handleLeadRecorded}
      />

      {/* Global Floating WhatsApp Support Button */}
      <FloatingWhatsApp />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
