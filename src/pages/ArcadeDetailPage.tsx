import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Terminal, 
  Clock, 
  Award, 
  Bookmark, 
  Play, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Edit3,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { ArcadeEditorModal } from './admin/ContentEditorModals';

interface ArcadeDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const ArcadeDetailPage: React.FC<ArcadeDetailPageProps> = ({ slug, navigate }) => {
  const { arcadeSolutions, updateArcadeSolution, isBookmarked, toggleBookmark, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const solution = (arcadeSolutions || []).find((s) => s.slug === slug) || (arcadeSolutions || [])[0];

  if (!solution) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Solution not found.</p>
        <button
          onClick={() => navigate('/google-arcade')}
          className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
        >
          Return to Arcade Hub
        </button>
      </div>
    );
  }

  const prerequisites = Array.isArray(solution.prerequisites) ? solution.prerequisites : [];
  const steps = Array.isArray(solution.steps) ? solution.steps : [];
  const importantCommands = Array.isArray(solution.importantCommands) ? solution.importantCommands : [];

  const handleCopyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShareLink = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://sakshamxtech.vercel.app/arcade/${solution.slug}`;
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `${solution.labCode}: ${solution.title} | Google Cloud Arcade Solution`,
          text: `🔥 Complete Lab Solution & Cloud Shell Commands for ${solution.labCode} on SakshamXTech:`,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const bookmarked = isBookmarked(solution.id);

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${solution.title} (${solution.labCode}) Solution | SakshamXTech`}
        description={`Step-by-step verified solution and commands for Google Cloud Arcade lab ${solution.labCode}: ${solution.title}.`}
        image={solution.youtubeVideoId ? `https://i.ytimg.com/vi/${solution.youtubeVideoId}/hqdefault.jpg` : undefined}
      />

      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/google-arcade')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Solutions</span>
        </button>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Edit Lab Solution"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Lab</span>
            </button>
          )}

          <button
            onClick={() => toggleBookmark(solution.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all cursor-pointer ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-500/50 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{bookmarked ? 'Saved to Bookmarks' : 'Save for Later'}</span>
          </button>

          <button
            onClick={handleShareLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs shadow-2xs transition-all cursor-pointer ${
              copiedLink
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold scale-105'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Share Lab Solution (Mobile share sheet / PC 1-click copy)"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="font-semibold">{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Lab Header Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-cyan-500/20 mb-8 bg-white dark:bg-slate-950/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-cyan-950 dark:border-cyan-500/40 dark:text-cyan-300">
            {solution.labCode}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/30">
            {solution.difficulty}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800">
            {solution.category}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {solution.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          {solution.description}
        </p>

        {/* Quick Meta Stats */}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Estimated: <strong className="text-slate-900 dark:text-white">{solution.durationMinutes} mins</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Points Reward: <strong className="text-amber-600 dark:text-amber-300">+{solution.pointsAwarded} Point</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
            <span>Badge: <strong className="text-blue-600 dark:text-cyan-300">{solution.badgeTitle || 'Arcade Track'}</strong></span>
          </div>
        </div>
      </div>

      {/* Prerequisites Callout */}
      {prerequisites.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 dark:bg-indigo-950/30 dark:border-indigo-500/20 mb-8">
          <h4 className="text-xs font-bold text-blue-700 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
            Prerequisites & Lab Setup
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
            {prerequisites.map((pre, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-indigo-400 shrink-0" />
                <span>{pre}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Step-by-Step Execution Guide */}
      <div className="space-y-6 mb-12">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <span>Step-by-Step Instructions</span>
        </h2>

        {steps.map((step, idx) => (
          <div
            key={step.stepNumber}
            className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 dark:bg-cyan-950 dark:border-cyan-500/40 dark:text-cyan-300 font-black text-sm flex items-center justify-center shrink-0">
                {step.stepNumber}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{step.description}</p>

                {/* Command block */}
                {step.command && (
                  <div className="mt-4 relative group">
                    <pre className="p-4 pr-24 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                      <code>{step.command}</code>
                    </pre>
                    <button
                      onClick={() => handleCopyCommand(step.command!, idx)}
                      className="absolute top-2 right-2 px-2.5 py-1 text-[11px] font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      title="Copy Command"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Important Note */}
                {step.note && (
                  <p className="mt-3 text-xs text-amber-800 dark:text-amber-300/90 bg-amber-50 dark:bg-amber-950/20 border-l-2 border-amber-500 pl-3 py-1">
                    <strong>Note:</strong> {step.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Walkthrough CTA */}
      <div className="p-6 rounded-2xl glass-card border border-rose-200 dark:border-red-500/20 bg-rose-50/50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:border dark:border-red-500/30 dark:text-red-400 flex items-center justify-center shrink-0">
            <Play className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Watch Full Video Walkthrough</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Watch SakshamXTech solve this lab with live Cloud Shell explanations.
            </p>
          </div>
        </div>

        <a
          href={solution.youtubeVideoId ? `https://youtube.com/watch?v=${solution.youtubeVideoId}` : "https://youtube.com/@SakshamXTech"}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent('youtube', `Walkthrough: ${solution.title}`, {
            videoId: solution.youtubeVideoId || 'channel',
            videoTitle: solution.title,
            pagePath: `/google-arcade/${solution.slug}`
          })}
          className="px-5 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors shrink-0 shadow-md shadow-red-500/20"
        >
          Watch on YouTube
        </a>
      </div>

      {/* INLINE ADMIN ARCADE LAB STUDIO MODAL */}
      {isEditOpen && isAdmin && (
        <ArcadeEditorModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={solution}
          onSave={(data) => {
            updateArcadeSolution(solution.id, data);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
};
