import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Briefcase, 
  Award, 
  Bookmark, 
  Building,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { formatRealDate } from '../utils/realTime';
import { OpportunityEditorModal } from './admin/ContentEditorModals';

interface OpportunityDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const OpportunityDetailPage: React.FC<OpportunityDetailPageProps> = ({ slug, navigate }) => {
  const { opportunities, updateOpportunity, isBookmarked, toggleBookmark, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const opp = opportunities.find((o) => o.slug === slug) || opportunities[0];

  if (!opp) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Opportunity not found.</p>
        <button
          onClick={() => navigate('/opportunities')}
          className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
        >
          Return to Opportunities
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(opp.id);

  const handleApplyClick = () => {
    trackEvent('opportunity', opp.title);
  };

  return (
    <div className="py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${opp.title} (${opp.company}) | SakshamXTech`}
        description={opp.description}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/opportunities')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-purple-50 dark:bg-slate-800 dark:hover:bg-purple-950/60 text-slate-700 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Edit Opportunity"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Opportunity</span>
            </button>
          )}

          <button
            onClick={() => toggleBookmark(opp.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-500/50 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{bookmarked ? 'Saved to Bookmarks' : 'Bookmark'}</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-amber-500/30 bg-white dark:bg-slate-950/90 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={opp.logo}
              alt={opp.company}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-sm"
            />
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{opp.category}</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{opp.company}</h1>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {opp.location ? `${opp.location} (${opp.type})` : opp.type}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Application Deadline</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-200 dark:border-rose-500/30 inline-block mt-1 font-mono">
              {formatRealDate(opp.deadline)}
            </span>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {opp.title}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {opp.description}
          </p>
        </div>

        {/* Eligibility Callout */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Eligibility Criteria</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {opp.eligibility}
          </p>
        </div>

        {/* Benefits & Perks */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Benefits, Stipend & Recognition
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opp.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Official application link provided directly by {opp.company}.
          </span>
          <a
            href={opp.officialUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleApplyClick}
            className="w-full sm:w-auto px-8 py-3 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0"
          >
            <span>Apply on Official Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* INLINE ADMIN OPPORTUNITY STUDIO MODAL */}
      {isEditOpen && (
        <OpportunityEditorModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={opp}
          onSave={(data) => {
            updateOpportunity(opp.id, data);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
};
