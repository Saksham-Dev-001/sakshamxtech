import React, { useState } from 'react';
import { 
  Gift, 
  Search, 
  Calendar, 
  ChevronRight,
  ArrowRight,
  Award,
  Sparkles,
  Plus,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { SwagEditorModal } from './admin/ContentEditorModals';
import { SwagItem } from '../types';

interface SwagsPageProps {
  navigate: (path: string) => void;
}

export const SwagsPage: React.FC<SwagsPageProps> = ({ navigate }) => {
  const { swags, addSwag, updateSwag, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Inline Admin Modal State
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    data: SwagItem | null;
  }>({
    isOpen: false,
    data: null,
  });

  const handleOpenNewModal = () => {
    setEditorModal({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEditModal = (swag: SwagItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditorModal({
      isOpen: true,
      data: swag,
    });
  };

  const handleSaveModal = (data: Partial<SwagItem>) => {
    if (editorModal.data && editorModal.data.id) {
      updateSwag(editorModal.data.id, data);
    } else {
      addSwag({
        title: data.title || 'Swag Item',
        brand: data.brand || 'Google Cloud Arcade',
        category: data.category || 'Hoodie',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        description: data.description || '',
        tierRequired: data.tierRequired || 'Standard Tier',
        eligibility: data.eligibility || 'Complete designated challenges.',
        howToClaim: data.howToClaim || ['Order from official prize counter'],
        campaignStartDate: data.campaignStartDate || '2026-01-01',
        campaignEndDate: data.campaignEndDate || '2026-12-31',
        officialSourceUrl: data.officialSourceUrl || 'https://go.qwiklabs.com/arcade',
        status: data.status || 'Active',
        featured: data.featured ?? false,
      });
    }
    setEditorModal({ isOpen: false, data: null });
  };

  const brands = ['All', 'Google Cloud', 'Microsoft', 'Unstop', 'Others'];

  const filtered = swags.filter((s) => {
    const matchesBrand = 
      selectedBrand === 'All' || 
      s.brand.toLowerCase().includes(selectedBrand.toLowerCase()) ||
      (selectedBrand === 'Others' && !s.brand.includes('Google') && !s.brand.includes('Microsoft'));

    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBrand && matchesSearch;
  });

  return (
    <div className="py-8 sm:py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100">
      <SEOHead
        title="Free Developer Swag Opportunities & Rewards | SakshamXTech"
        description="Directory of verified student swag opportunities, Google Cloud Arcade prize counter, GitHub Student pack, and developer hackathon kits."
      />

      {/* Breadcrumb matching Mockup */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Free Swags</span>
      </div>

      {/* Header Banner matching Mockup */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/70 text-red-600 flex items-center justify-center shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Free Swags
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Latest free swags, tees and merchandise opportunities for students.
          </p>
        </div>

        {/* Search Input & Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search swags, hoodies..."
              maxLength={120}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Swag</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </div>

      {/* Google Cloud Arcade 2026 Master Shortcut Banner */}
      <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-white/20 backdrop-blur-md">
              Google Cloud Arcade 2026
            </span>
            <span className="text-xs font-bold text-blue-200">Official Prize Counter</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Looking for Google Cloud Arcade 2026 Swags &amp; Points Calculator?
          </h3>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            All Arcade Champion Kit items, standard tier swags, points rules, and live milestone simulator are unified inside the Google Cloud Arcade Hub.
          </p>
        </div>
        <button
          onClick={() => navigate('/google-arcade?tab=swags')}
          className="px-5 py-2.5 bg-white text-blue-600 hover:bg-slate-100 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Open Arcade Swags Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Pills matching Mockup */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedBrand === b
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Swags List matching Mockup Cards */}
      <div className="space-y-4">
        {filtered.map((swag) => (
          <div
            key={swag.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group"
          >
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-center">
                <img
                  src={swag.imageUrl}
                  alt={swag.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {swag.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {swag.brand}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {swag.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                  <span>
                    Eligibility: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{swag.eligibility}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Last Date: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{swag.campaignEndDate || 'Ongoing'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full sm:w-auto shrink-0 flex items-center justify-end gap-2.5">
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => handleOpenEditModal(swag, e)}
                  className="px-4 py-2.5 rounded-full font-bold text-xs bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-950/60 text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Edit swag item"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}

              <a
                href={swag.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('download', swag.title)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* FULL INLINE ADMIN SWAG STUDIO MODAL */}
      {editorModal.isOpen && (
        <SwagEditorModal
          isOpen={editorModal.isOpen}
          onClose={() => setEditorModal({ isOpen: false, data: null })}
          initialData={editorModal.data}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};