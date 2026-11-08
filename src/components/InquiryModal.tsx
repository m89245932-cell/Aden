import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Business } from '../types/index';
import { formatWhatsAppUrl } from '../utils/directoryLogic';
import { recordLead } from '../services/businessService';
import { X, MessageCircle, Send, Sparkles, Check, PhoneCall } from 'lucide-react';

interface InquiryModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadRecorded?: (businessId: string) => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  business,
  isOpen,
  onClose,
  onLeadRecorded
}) => {
  const { lang, t } = useLanguage();
  const [inquiryType, setInquiryType] = useState<'general' | 'price' | 'booking' | 'delivery'>('general');
  const [customNote, setCustomNote] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen || !business) return null;

  const getTemplateMessage = () => {
    const businessName = lang === 'ar' ? business.nameAr : business.name;
    const baseGreeting =
      lang === 'ar'
        ? `مرحباً ${businessName}، لقد وجدتكم عبر منصة AdenGo (عدن جو).`
        : `Hello ${businessName}, I found your listing on AdenGo.`;

    let specific = '';
    if (inquiryType === 'general') {
      specific =
        lang === 'ar'
          ? 'أود الاستفسار عن تفاصيل الخدمات ومواعيد العمل اليوم.'
          : 'I would like to inquire about your available services and operating hours today.';
    } else if (inquiryType === 'price') {
      specific =
        lang === 'ar'
          ? 'أرجو تزويدي بقائمة الأسعار والوجبات/المنتجات المتوفرة.'
          : 'Please provide me with your latest price list or menu catalog.';
    } else if (inquiryType === 'booking') {
      specific =
        lang === 'ar'
          ? 'أرغب بعمل حجز مؤكد، يرجى إفادتي بالإمكانية المتاحة.'
          : 'I would like to check availability and make a reservation.';
    } else if (inquiryType === 'delivery') {
      specific =
        lang === 'ar'
          ? 'هل تتوفر لديكم خدمة التوصيل لموقعي في عدن؟'
          : 'Is delivery service available to my location in Aden?';
    }

    if (customNote.trim()) {
      specific += ` (${lang === 'ar' ? 'ملاحظة خاصة' : 'Note'}: ${customNote.trim()})`;
    }

    return `${baseGreeting}\n${specific}`;
  };

  const handleOpenWhatsApp = async () => {
    const message = getTemplateMessage();
    const url = formatWhatsAppUrl(business.whatsapp, lang === 'ar' ? business.nameAr : business.name, lang, message);

    try {
      await recordLead(business.id);
      if (onLeadRecorded) onLeadRecorded(business.id);
    } catch (err) {
      console.warn('Lead tracking warning:', err);
    }

    setSent(true);
    setTimeout(() => {
      window.open(url, '_blank');
      onClose();
      setSent(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-sky-100 dark:border-slate-800"
        role="dialog"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 rtl:left-5 ltr:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              {lang === 'ar' ? 'محادثة فورية مباشرة' : 'Instant Direct Inquiry'}
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {lang === 'ar' ? business.nameAr : business.name}
            </h3>
          </div>
        </div>

        {/* Inquiry Type Chips */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'ar' ? 'اختر نوع الاستفسار السريع:' : 'Select Inquiry Topic:'}</span>
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {[
              { id: 'general', ar: '💬 استفسار عام ومواعيد', en: '💬 General Inquiry' },
              { id: 'price', ar: '🏷️ قائمة الأسعار والمنيو', en: '🏷️ Pricing & Menu' },
              { id: 'booking', ar: '📅 حجز طاولة أو شاليه', en: '📅 Reservation' },
              { id: 'delivery', ar: '🛵 التوصيل داخل عدن', en: '🛵 Delivery Service' }
            ].map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => setInquiryType(topic.id as any)}
                className={`p-2.5 rounded-xl border text-right rtl:text-right ltr:text-left transition ${
                  inquiryType === topic.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {lang === 'ar' ? topic.ar : topic.en}
              </button>
            ))}
          </div>
        </div>

        {/* Custom optional note */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {lang === 'ar' ? 'ملاحظة خاصة إضافية (اختياري):' : 'Add custom note (Optional):'}
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'مثال: عدد 4 أشخاص، أو توصيل لحي المنصورة...'
                : 'e.g. party of 4, or delivery to Mansoura...'
            }
            className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Message Preview */}
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            {lang === 'ar' ? 'معاينة نص الرسالة في واتساب:' : 'WhatsApp Message Preview:'}
          </span>
          <p className="whitespace-pre-line font-medium text-slate-800 dark:text-slate-200">
            {getTemplateMessage()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition active:scale-95"
          >
            {sent ? <Check className="w-4 h-4 animate-bounce" /> : <Send className="w-4 h-4" />}
            <span>{lang === 'ar' ? 'فتح محادثة واتساب الآن' : 'Launch WhatsApp Now'}</span>
          </button>
          <a
            href={`tel:${business.phone || business.whatsapp}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition"
          >
            <PhoneCall className="w-4 h-4 text-sky-500" />
            <span>{t('callPhone')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
