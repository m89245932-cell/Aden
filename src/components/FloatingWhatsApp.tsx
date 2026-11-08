import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ADENGO_OFFICIAL_WHATSAPP, ADENGO_OFFICIAL_PHONE_DISPLAY } from '../utils/directoryLogic';
import { MessageCircle, X, Send, PhoneCall, Sparkles, ShieldCheck } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);

  const startChat = (topicMessage: string) => {
    const url = `https://wa.me/${ADENGO_OFFICIAL_WHATSAPP}?text=${encodeURIComponent(topicMessage)}`;
    window.open(url, '_blank');
    setOpen(false);
  };

  const quickPrompts = [
    {
      id: 'add',
      ar: '📝 أود إدراج نشاطي التجاري في دليل عدن جو',
      en: '📝 I want to list my business on AdenGo'
    },
    {
      id: 'pro',
      ar: '⭐ استفسار عن باقة المحترف العدني وشارة التوثيق',
      en: '⭐ Inquire about the Aden Pro Verified Badge'
    },
    {
      id: 'support',
      ar: '💬 السلام عليكم، أحتاج مساعدة أو استفسار عام',
      en: '💬 Hello, I need help or have a general inquiry'
    }
  ];

  return (
    <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50 flex flex-col items-end rtl:items-start select-none">
      
      {/* Expanded Quick Contact Card */}
      {open && (
        <div className="mb-3 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-emerald-200 dark:border-emerald-900/60 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{lang === 'ar' ? 'فريق دعم عدن جو' : 'AdenGo WhatsApp Desk'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </h4>
                <p className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {ADENGO_OFFICIAL_PHONE_DISPLAY}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp card"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              {lang === 'ar'
                ? 'أهلاً بك! تواصل معنا مباشرة عبر واتساب للإدراج، التوثيق، أو الدعم الفني في عدن:'
                : 'Welcome! Chat directly with our Aden team for listing inquiries, verification, or support:'}
            </p>

            <div className="space-y-2">
              {quickPrompts.map((p) => {
                const text = lang === 'ar' ? p.ar : p.en;
                return (
                  <button
                    key={p.id}
                    onClick={() => startChat(text)}
                    className="w-full text-right rtl:text-right ltr:text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300 text-xs font-semibold transition flex items-center justify-between group"
                  >
                    <span>{text}</span>
                    <Send className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 rtl:rotate-180 transition shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <a
              href={`https://wa.me/${ADENGO_OFFICIAL_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 text-[11px]"
            >
              <span>{lang === 'ar' ? 'فتح محادثة مخصصة' : 'Open Custom Chat'}</span>
              <MessageCircle className="w-3.5 h-3.5" />
            </a>

            <a
              href={`tel:+${ADENGO_OFFICIAL_WHATSAPP}`}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1 text-[11px]"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-500" />
              <span>{lang === 'ar' ? 'اتصال مباشر' : 'Call'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Circle Button */}
      <div className="relative group">
        <button
          onClick={() => setOpen(!open)}
          aria-label="Open AdenGo WhatsApp Support"
          className="relative flex items-center gap-2.5 py-3 px-4 sm:px-4.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-700/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
          </span>

          <MessageCircle className="w-5 h-5 fill-white" />

          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            {lang === 'ar' ? 'واتساب عدن جو' : 'AdenGo WhatsApp'}
          </span>
        </button>
      </div>

    </div>
  );
};
