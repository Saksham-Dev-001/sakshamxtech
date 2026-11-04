import React, { useState } from 'react';
import { 
  Gift, 
  ExternalLink, 
  ChevronRight,
  Info,
  Edit3,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { SwagItem } from '../types';
import { SwagEditorModal } from './admin/ContentEditorModals';

interface ArcadeSwagsPageProps {
  navigate: (path: string) => void;
}

export const ArcadeSwagsPage: React.FC<ArcadeSwagsPageProps> = ({ navigate }) => {
  const { swags, addSwag, updateSwag } = useApp();
  const { isAdmin } = useAuth();
  const [selectedTier, setSelectedTier] = useState<string>('All Tiers');

  // Inline Admin Swags Modal State
  const [swagEditorModal, setSwagEditorModal] = useState<{
    isOpen: boolean;
    data: SwagItem | null;
  }>({
    isOpen: false,
    data: null,
  });

  const handleOpenNewSwagModal = () => {
    setSwagEditorModal({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEditSwagModal = (swag: SwagItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSwagEditorModal({
      isOpen: true,
      data: swag,
    });
  };

  const handleSaveSwagModal = (data: Partial<SwagItem>) => {
    if (swagEditorModal.data && swagEditorModal.data.id) {
      updateSwag(swagEditorModal.data.id, data);
    } else {
      addSwag({
        title: data.title || 'New Swag Item',
        brand: data.brand || 'Google Cloud Arcade',
        category: data.category || 'Magic Mug',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
        description: data.description || '',
        tierRequired: data.tierRequired || 'Champion',
        tierTags: data.tierTags || ['Champion'],
        revealedDate: data.revealedDate || '3 November 2026',
        eligibility: data.eligibility || '50+ Arcade Points in 2026 season',
        howToClaim: data.howToClaim || ['Complete required points', 'Check claim email', 'Order swags'],
        campaignStartDate: data.campaignStartDate || '2026-10-01',
        campaignEndDate: data.campaignEndDate || '2026-12-31',
        officialSourceUrl: data.officialSourceUrl || 'https://go.qwiklabs.com/arcade',
        status: data.status || 'Active',
        featured: data.featured ?? true,
      });
    }
    setSwagEditorModal({ isOpen: false, data: null });
  };

  const arcadeSwags = swags.filter((s) => s.brand === 'Google Cloud Arcade');

  const filteredSwags = arcadeSwags.filter((s) => {
    if (selectedTier === 'All Tiers' || selectedTier === 'All') return true;
    if (s.tierTags && s.tierTags.includes(selectedTier as any)) return true;
    if (s.tierRequired && s.tierRequired.toLowerCase().includes(selectedTier.toLowerCase())) return true;
    return false;
  });

  const tierFilters = ['All Tiers', 'Trooper', 'Ranger', 'Champion', 'Legend'];

  const getTierBadgeStyle = (tag: string) => {
    switch (tag) {
      case 'Trooper':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60';
      case 'Ranger':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border-sky-300 dark:border-sky-700/60';
      case 'Champion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700/60';
      case 'Legend':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700/60';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getCardInnerBg = (index: number) => {
    const bgs = [
      'bg-[#f6ebd4] dark:bg-amber-950/30',
      'bg-[#191929] dark:bg-slate-900',
      'bg-[#eb5e57] dark:bg-rose-950/40',
      'bg-[#f7eddc] dark:bg-amber-950/30',
      'bg-[#f6ebd4] dark:bg-amber-950/30',
      'bg-[#1a2238] dark:bg-blue-950/40',
    ];
    return bgs[index % bgs.length];
  };

  return (
    <div className="py-8 sm:py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100 font-sans space-y-8">
      <SEOHead
        title="Google Cloud Arcade Swags 2026 | Official Prize Tiers & Swag Drops | SakshamXTech"
        description="Official Google Cloud Arcade 2026 Swag Drops. Explore Trooper (50 Pts), Ranger (75 Pts), Champion (95 Pts), and Legend (120 Pts) physical merchandise."
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/google-arcade')} className="hover:text-blue-600 transition-colors">Google Cloud Arcade</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Arcade Swags 2026</span>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold shadow-xs">
          <Gift className="w-4 h-4" />
          <span>Official 2026 Prize Counter Drops</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Arcade Swag Drops &amp; Rewards
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Official physical merchandise reveals across the 4 Arcade Prize Tiers: Trooper (50 Pts), Ranger (75 Pts), Champion (95 Pts), and Legend (120 Pts).
        </p>
      </div>

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        {/* Tier Filter Pills Bar matching Image 2 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mx-auto sm:mx-0">
          {tierFilters.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                selectedTier === tier
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenNewSwagModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Swag Drop</span>
          </button>
        )}
      </div>

      <div className="text-center sm:text-left">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <strong>{filteredSwags.length}</strong> swag items
        </span>
      </div>

      {/* Swags Grid matching Screenshot Exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredSwags.map((swag, idx) => (
          <div
            key={swag.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-3 sm:p-3.5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Top Image Container matching Image 2 with colorful background */}
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center p-3 transition-transform duration-300 ${getCardInnerBg(idx)}`}>
                <img
                  src={swag.imageUrl}
                  alt={swag.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80';
                  }}
                />

                {/* Admin 1-Click Edit Button */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditSwagModal(swag, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 shadow-md border border-slate-200/80 dark:border-slate-700 text-xs transition-colors cursor-pointer"
                    title="Edit Swag Drop"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Content below image */}
              <div className="pt-3 px-1 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block truncate">
                  {swag.revealedDate ? `Revealed on ${swag.revealedDate}` : 'Revealed in 2026'}
                </span>

                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {swag.title}
                </h3>

                {/* Tier Badges (Trooper, Ranger, Champion, Legend) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {swag.tierTags && swag.tierTags.length > 0 ? (
                    swag.tierTags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getTierBadgeStyle(tag)}`}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200">
                      {swag.tierRequired || 'Arcade Swag'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Button (Swag Drop ↗ with Manual Link) */}
            <div className="pt-4 px-1">
              <a
                href={swag.officialSourceUrl || 'https://go.qwiklabs.com/arcade'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-black shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Swag Drop</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSwags.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Gift className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">No swags found for {selectedTier}</h4>
          <p className="text-xs text-slate-500 mt-1">Switch to "All Tiers" or add a new swag drop using the button above.</p>
        </div>
      )}

      {/* Official Logistics Note */}
      <div className="p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 max-w-4xl mx-auto shadow-xs">
        <Info className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <b>Official Google Logistics Notice:</b> All merchandise is packed and dispatched directly by Google LLC through authorized regional fulfillment partners with 100% free international shipping. Once the seasonal Prize Counter opens, qualifying participants receive an email with their custom redemption voucher.
        </p>
      </div>

      {/* FULL INLINE ADMIN SWAGS STUDIO MODAL */}
      {swagEditorModal.isOpen && (
        <SwagEditorModal
          isOpen={swagEditorModal.isOpen}
          onClose={() => setSwagEditorModal({ isOpen: false, data: null })}
          initialData={swagEditorModal.data}
          onSave={handleSaveSwagModal}
        />
      )}
    </div>
  );
};
