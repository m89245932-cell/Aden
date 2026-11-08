import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Business } from '../types/index';
import { ADEN_DISTRICTS, CATEGORIES } from '../data/seedData';
import { updateBusiness, deleteBusiness } from '../services/businessService';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Building,
  Users
} from 'lucide-react';

interface AdminDashboardProps {
  businesses: Business[];
  onBusinessesUpdated: () => void;
  setActivePage: (page: string) => void;
  setSelectedBusiness: (b: Business) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  businesses,
  onBusinessesUpdated,
  setActivePage,
  setSelectedBusiness
}) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalVerified = businesses.filter((b) => b.verified).length;
  const totalFeatured = businesses.filter((b) => b.featured).length;
  const totalViews = businesses.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalLeads = businesses.reduce((acc, b) => acc + (b.leads || 0), 0);

  const filtered = businesses.filter((b) => {
    const matchDistrict = districtFilter === 'all' || b.district === districtFilter;
    const matchSearch =
      searchTerm.trim() === '' ||
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.nameAr.includes(searchTerm) ||
      b.whatsapp.includes(searchTerm);
    return matchDistrict && matchSearch;
  });

  const handleToggleVerified = async (b: Business) => {
    setUpdatingId(b.id);
    try {
      await updateBusiness(b.id, { verified: !b.verified });
      onBusinessesUpdated();
    } catch (err) {
      console.warn('Toggle verified failed:', err);
      onBusinessesUpdated();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (b: Business) => {
    setUpdatingId(b.id);
    try {
      await updateBusiness(b.id, { featured: !b.featured });
      onBusinessesUpdated();
    } catch (err) {
      console.warn('Toggle featured failed:', err);
      onBusinessesUpdated();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا النشاط؟' : 'Confirm deleting this listing?')) {
      try {
        await deleteBusiness(id);
        onBusinessesUpdated();
      } catch (err) {
        console.warn('Delete failed:', err);
        onBusinessesUpdated();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-orange-900/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-600/40 text-orange-200 text-xs font-bold mb-2 border border-orange-500/30">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            <span>{lang === 'ar' ? 'لوحة القيادة الإدارية المركزية' : 'AdenGo System Command'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t('adminPortal')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {lang === 'ar'
              ? `المسؤول الحالي: ${user?.email || 'admin@adengo.ye'} • اعتماد وتوثيق الأنشطة التجارية في عدن`
              : `Active SuperAdmin: ${user?.email || 'admin@adengo.ye'} • Verify and promote Aden merchants`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'ar' ? 'نظام عدن متصل وفوري' : 'Live Firestore Sync'}</span>
          </span>
        </div>
      </div>

      {/* Admin Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {lang === 'ar' ? 'إجمالي الأنشطة' : 'Total Listings'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {businesses.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {lang === 'ar' ? 'أنشطة موثقة' : 'Verified Listings'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400">
              {totalVerified}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {lang === 'ar' ? 'المميزة في الواجهة' : 'Featured on Home'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-500">
              {totalFeatured}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {lang === 'ar' ? 'إجمالي نقرات واتساب' : 'Total WhatsApp Leads'}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {totalLeads.toLocaleString()}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Directory Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 rtl:right-3.5 ltr:left-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث بالاسم أو رقم الواتساب...' : 'Search by name or WhatsApp...'}
              className="w-full text-xs py-2.5 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white outline-none"
            >
              {ADEN_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {lang === 'ar' ? d.ar : d.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Listings List */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <th className="py-3 px-3">{lang === 'ar' ? 'النشاط التجاري' : 'Business'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'المديرية' : 'District'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'الواتساب' : 'WhatsApp'}</th>
                <th className="py-3 px-3">{lang === 'ar' ? 'النقرات' : 'Leads'}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'التوثيق' : 'Verified'}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'مميز' : 'Featured'}</th>
                <th className="py-3 px-3 text-center">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-3 flex items-center gap-3">
                    <img
                      src={b.image}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {lang === 'ar' ? b.nameAr : b.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {CATEGORIES.find(c => c.id === b.category)?.[lang]}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-medium">
                    {ADEN_DISTRICTS.find(d => d.id === b.district)?.[lang]}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {b.whatsapp}
                  </td>

                  <td className="py-3.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {b.leads}
                  </td>

                  {/* Toggle Verified */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleVerified(b)}
                      disabled={updatingId === b.id}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                        b.verified
                          ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {b.verified ? (lang === 'ar' ? '✓ موثق' : '✓ Verified') : (lang === 'ar' ? 'غير موثق' : 'Unverified')}
                    </button>
                  </td>

                  {/* Toggle Featured */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleFeatured(b)}
                      disabled={updatingId === b.id}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                        b.featured
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {b.featured ? (lang === 'ar' ? '★ مميز' : '★ Featured') : (lang === 'ar' ? 'عادي' : 'Standard')}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedBusiness(b);
                          setActivePage('business-profile');
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800"
                        title="View profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
