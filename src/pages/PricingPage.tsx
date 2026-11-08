import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PRICING_PLANS } from '../data/seedData';
import {
  Check,
  Zap,
  ShieldCheck,
  Crown,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  CreditCard,
  Building2
} from 'lucide-react';

interface PricingPageProps {
  setActivePage: (page: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ setActivePage }) => {
  const { lang, t } = useLanguage();
  const [currency, setCurrency] = useState<'YER' | 'USD'>('YER');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      qAr: 'كيف يستقبل متجري في عدن طلبات واستفسارات الزبائن؟',
      qEn: 'How will my Aden store receive customer orders and inquiries?',
      aAr: 'تصلك كافة الاستفسارات والطلبات مباشرة كرسالة محادثة خاصة على رقم واتساب المحل الرسمي، دون أي عمولة أو وسيط بينك وبين الزبون.',
      aEn: 'All inquiries land straight into your official WhatsApp chat with pre-formatted questions, with 0% commissions or middlemen.'
    },
    {
      qAr: 'ما هي طرق الدفع المتاحة للاشتراك في باقات عدن جو؟',
      qEn: 'What payment methods are supported in Aden?',
      aAr: 'ندعم كافة طرق الدفع المحلية المعتمدة في عدن: بنك الكريمي، بنك القطيبي، التضامن، المحافظ الإلكترونية (جيب، كاش، ون كاش)، أو سداد نقدي مباشر.',
      aEn: 'We support local Aden payment gateways: Kuraimi Bank, Al-Qutaibi, Tadhamon, local e-wallets, or cash at our Aden branch.'
    },
    {
      qAr: 'كيف أحصل على شارة التوثيق الرسمية (Verified Badge)؟',
      qEn: 'How do I obtain the verified blue badge?',
      aAr: 'عند ترقية حسابك إلى باقة المحترف، يقوم فريقنا الميداني في عدن بالتحقق من السجل التجاري ورقم الواتساب لمنحك شارة التوثيق لزيادة مصداقية نشاطك.',
      aEn: 'Upon choosing the Pro plan, our local Aden team verifies your trade presence and WhatsApp contact to activate the verified seal.'
    },
    {
      qAr: 'هل يمكنني إدراج أكثر من فرع لنفس المطعم أو المتجر في عدن؟',
      qEn: 'Can I list multiple branches across Aden districts?',
      aAr: 'نعم، تتيح باقة VIP Marina تغطية حتى 5 فروع مختلفة في صيرة، المعلا، المنصورة، وخورمكسر مع لوحة تحكم موحدة.',
      aEn: 'Yes, the VIP Marina package covers up to 5 branch locations across Crater, Mualla, Khormaksar, and Mansoura.'
    }
  ];

  const handleSelectPlan = (planId: string, planName: string) => {
    const text =
      lang === 'ar'
        ? `مرحباً فريق AdenGo، أود تفعيل باقة (${planName}) لنشاطي التجاري في عدن.`
        : `Hello AdenGo team, I would like to subscribe to the ${planName} package for my business.`;
    window.open(`https://wa.me/967736739355?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{lang === 'ar' ? 'حلول التسويق الرقمي الأول في عدن' : 'Premier Local Growth Engine'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('pricingTitle')}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          {t('pricingSubtitle')}
        </p>

        {/* Currency Switcher */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrency('YER')}
              className={`py-2 px-5 rounded-xl text-xs font-bold transition ${
                currency === 'YER'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'الريال اليمني (YER)' : 'Yemeni Rial (YER)'}
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`py-2 px-5 rounded-xl text-xs font-bold transition ${
                currency === 'USD'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'ar' ? 'الدولار الأمريكي ($)' : 'US Dollar (USD)'}
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const isPro = plan.popular;
          const displayPrice = currency === 'YER' ? plan.priceYer : plan.priceUsd;
          const features = lang === 'ar' ? plan.featuresAr : plan.featuresEn;
          const planName = lang === 'ar' ? plan.nameAr : plan.nameEn;
          const ctaText = lang === 'ar' ? plan.ctaAr : plan.ctaEn;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? 'bg-gradient-to-b from-sky-950 to-slate-900 text-white shadow-2xl border-2 border-sky-400 scale-102 lg:-translate-y-2'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-sky-100 dark:border-slate-800 shadow-md hover:shadow-xl'
              }`}
            >
              {isPro && (
                <div className="absolute -top-4 rtl:left-1/2 rtl:translate-x-1/2 ltr:left-1/2 ltr:-translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-white" />
                  <span>{lang === 'ar' ? 'الباقة الأكثر اختياراً' : 'Most Popular in Aden'}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isPro ? 'text-sky-300' : 'text-sky-600 dark:text-sky-400'}`}>
                    {plan.id === 'free' ? '⚓ Basic' : plan.id === 'pro' ? '⭐ Verified' : '👑 Enterprise'}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black mb-2">
                  {planName}
                </h3>

                {/* Price */}
                <div className="my-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight">{displayPrice}</span>
                    <span className={`text-xs ${isPro ? 'text-sky-200' : 'text-slate-400'}`}>
                      / {lang === 'ar' ? plan.periodAr : plan.periodEn}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 text-xs">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${isPro ? 'bg-sky-400 text-slate-950' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'}`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className={isPro ? 'text-sky-100' : 'text-slate-600 dark:text-slate-300'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6">
                <button
                  onClick={() => handleSelectPlan(plan.id, planName)}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs transition shadow-md flex items-center justify-center gap-2 ${
                    isPro
                      ? 'bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 active:scale-95'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{ctaText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Local Payment Badges */}
      <div className="p-6 rounded-3xl bg-sky-50/70 dark:bg-slate-900 border border-sky-100 dark:border-slate-800 text-center space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2">
          <CreditCard className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>{lang === 'ar' ? 'طرق الدفع والتحويل المحلية المدعومة داخل العاصمة عدن:' : 'Supported Local Payment Options in Aden:'}</span>
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">بنك الكريمي (Kuraimi)</span>
          <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">بنك القطيبي الإسلامي (Al-Qutaibi)</span>
          <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">محفظة جيب / كاش (E-Wallets)</span>
          <span className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">الدفع نقداً بمقرنا في عدن (Cash)</span>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {t('faqTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar' ? 'إجابات واضحة لأهم استفسارات التجّار' : 'Clear answers for business partners'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-sky-100 dark:border-slate-800 overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-right rtl:text-right ltr:text-left p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <span>{lang === 'ar' ? faq.qAr : faq.qEn}</span>
                  <span className="text-sky-500 text-lg">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {lang === 'ar' ? faq.aAr : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
