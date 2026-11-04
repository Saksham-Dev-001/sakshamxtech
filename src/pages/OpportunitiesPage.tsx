import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  ChevronRight,
  ArrowRight,
  Plus,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { formatRealDate, getTodayISODate } from '../utils/realTime';
import { OpportunityEditorModal } from './admin/ContentEditorModals';
import { Opportunity } from '../types';

interface OpportunitiesPageProps {
  navigate: (path: string) => void;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ navigate }) => {
  const { opportunities, addOpportunity, updateOpportunity, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Inline Admin Modal State
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    data: Opportunity | null;
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

  const handleOpenEditModal = (opp: Opportunity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditorModal({
      isOpen: true,
      data: opp,
    });
  };

  const handleSaveModal = (data: Partial<Opportunity>) => {
    if (editorModal.data && editorModal.data.id) {
      updateOpportunity(editorModal.data.id, data);
    } else {
      addOpportunity({
        title: data.title || 'New Opportunity',
        company: data.company || 'Tech Organization',
        slug: data.slug || (data.title || 'opp').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logo: data.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
        category: data.category || 'Internships',
        type: data.type || 'Remote',
        description: data.description || '',
        eligibility: data.eligibility || 'Open to students.',
        benefits: data.benefits || ['Certificate', 'Experience'],
        deadline: data.deadline || '2026-12-31',
        officialUrl: data.officialUrl || 'https://sakshamxtech.com',
        status: data.status || 'Active',
        featured: data.featured ?? false,
        postedDate: data.postedDate || getTodayISODate(),
      });
    }
    setEditorModal({ isOpen: false, data: null });
  };

  const categories = [
    'All',
    'Internships',
    'Hackathons',
    'Events',
    'Competitions',
  ];

  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = 
      selectedCategory === 'All' || 
      opp.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Events' && (opp.category.includes('Program') || opp.category.includes('Event')));

    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-8 sm:py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100">
      <SEOHead
        title="Student Tech Opportunities, Internships & Hackathons | SakshamXTech"
        description="Discover active engineering internships, global hackathons, Google Summer of Code, student ambassador cohorts, and tech fellowships."
      />

      {/* Breadcrumb matching Mockup */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Opportunities</span>
      </div>

      {/* Header Banner matching Mockup */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 flex items-center justify-center shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Opportunities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Latest internships, hackathons, events and programs for students.
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
              placeholder="Search opportunities..."
              maxLength={120}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Opportunity</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills matching Mockup */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Opportunities List matching Mockup Cards */}
      <div className="space-y-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 group"
          >
            <div className="flex items-start gap-4">
              <img
                src={opp.logo}
                alt={opp.company}
                className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shrink-0 shadow-sm"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {opp.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
                    {opp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-3xl">
                  {opp.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {opp.location || opp.type}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Deadline: {formatRealDate(opp.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full sm:w-auto shrink-0 flex items-center justify-end gap-2.5">
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => handleOpenEditModal(opp, e)}
                  className="px-4 py-2.5 rounded-full font-bold text-xs bg-slate-100 hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-purple-950/60 text-slate-700 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Edit opportunity"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}

              <a
                href={opp.officialUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('opportunity', opp.title)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* FULL INLINE ADMIN OPPORTUNITY STUDIO MODAL */}
      {editorModal.isOpen && (
        <OpportunityEditorModal
          isOpen={editorModal.isOpen}
          onClose={() => setEditorModal({ isOpen: false, data: null })}
          initialData={editorModal.data}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};