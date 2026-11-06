import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Bookmark, 
  Play, 
  Flame, 
  CheckCircle2, 
  ArrowUpRight,
  Edit3,
  Share2,
  Youtube,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { formatFullDate, getRelativeTimeString } from '../utils/realTime';
import { UnstopEditorModal, extractYouTubeVideoId } from './admin/ContentEditorModals';

interface UnstopDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const UnstopDetailPage: React.FC<UnstopDetailPageProps> = ({ slug, navigate }) => {
  const { unstopProblems, updateUnstopProblem, isBookmarked, toggleBookmark, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [selectedLang, setSelectedLang] = useState<'c' | 'cpp' | 'java' | 'python' | 'javascript'>('c');
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const problem = unstopProblems.find((p) => p.slug === slug) || unstopProblems[0];

  if (!problem) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Problem not found.</p>
        <button
          onClick={() => navigate('/unstop')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
        >
          Return to POTD List
        </button>
      </div>
    );
  }

  const cleanVideoId = extractYouTubeVideoId(problem.youtubeVideoId || '');

  const currentCode = problem.codeSolutions.find((s) => s.language === selectedLang)?.code 
    || problem.codeSolutions[0]?.code 
    || '// Solution in preparation';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bookmarked = isBookmarked(problem.id);

  const handleShareLink = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://sakshamxtech.vercel.app/unstop/${problem.slug}`;
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `Day ${problem.dayNumber}: ${problem.title} | Unstop POTD Solution`,
          text: `🔥 Day ${problem.dayNumber}: ${problem.title}\n\nCheck out the verified multi-language solution (C, C++, Java, Python, JS) on SakshamXTech:`,
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

  const handleOpenInPlayground = () => {
    // Save code to playground buffer
    localStorage.setItem('sakshamxtech_playground_code', currentCode);
    trackEvent('pageView', '/c-playground');
    navigate('/c-playground');
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`Unstop Day ${problem.dayNumber}: ${problem.title} Solution | SakshamXTech`}
        description={`Detailed solution and multi-language code (C, C++, Java, Python, JS) for Unstop POTD: ${problem.title}.`}
        image={cleanVideoId ? `https://i.ytimg.com/vi/${cleanVideoId}/hqdefault.jpg` : 'https://sakshamxtech.vercel.app/assets/branding/potd_day7.png'}
      />

      {/* Navigation & Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/unstop')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Unstop Solutions</span>
        </button>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/60 text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Edit POTD Solution"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Solution</span>
            </button>
          )}

          <button
            onClick={() => toggleBookmark(problem.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all cursor-pointer ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-500/50 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleShareLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs shadow-2xs transition-all cursor-pointer ${
              copiedLink
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold scale-105'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Share POTD Solution (Mobile share sheet / PC 1-click copy)"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="font-semibold">{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Problem Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/20 mb-8 bg-white dark:bg-slate-950/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-black bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-500/40 dark:text-emerald-300">
            Day {problem.dayNumber}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/30">
            {problem.difficulty}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {formatFullDate(problem.date)} ({getRelativeTimeString(problem.date)})
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {problem.title}
        </h1>

        <div className="mt-4 prose max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
          <p>{problem.description}</p>
        </div>

        {/* Input/Output Format & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Input Format</span>
            <pre className="font-mono text-slate-800 dark:text-slate-300 text-xs whitespace-pre-wrap">{problem.inputFormat}</pre>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Output Format</span>
            <pre className="font-mono text-slate-800 dark:text-slate-300 text-xs whitespace-pre-wrap">{problem.outputFormat}</pre>
          </div>
        </div>

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">Constraints:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {problem.examples && (
          <div className="mt-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Example Cases</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Input:</span>
                  <pre className="font-mono text-blue-700 dark:text-cyan-300 text-xs bg-slate-100 dark:bg-slate-950 p-2 rounded mt-1 overflow-x-auto border border-slate-200 dark:border-slate-800">{ex.input}</pre>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Output:</span>
                  <pre className="font-mono text-emerald-700 dark:text-emerald-300 text-xs bg-slate-100 dark:bg-slate-950 p-2 rounded mt-1 overflow-x-auto border border-slate-200 dark:border-slate-800">{ex.output}</pre>
                </div>
                {ex.explanation && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-300">Explanation:</strong> {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {/* YouTube Video Walkthrough Player */}
        {cleanVideoId && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md">
            <div className="flex items-center justify-between p-3.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <Youtube className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Video Walkthrough &amp; Code Logic</span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${cleanVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${cleanVideoId}?rel=0`}
                title={`Day ${problem.dayNumber}: ${problem.title}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Solution Explanation */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 space-y-3 bg-white dark:bg-slate-950 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Optimal Algorithm Intuition</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {problem.solutionExplanation}
        </p>
      </div>

      {/* Multi-Language Code Editor Box */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden mb-12 shadow-2xl">
        {/* Languages Tab Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-950 border-b border-slate-800 gap-2 overflow-x-auto no-scrollbar scroll-px-3">
          <div className="flex items-center gap-1.5 shrink-0">
            {(['c', 'cpp', 'java', 'python', 'javascript'] as const).map((lang) => {
              const hasSol = problem.codeSolutions.some((s) => s.language === lang);
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors uppercase shrink-0 mobile-tap cursor-pointer ${
                    selectedLang === lang
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : hasSol
                      ? 'bg-slate-900 text-slate-300 hover:text-white'
                      : 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                  }`}
                  disabled={!hasSol}
                >
                  {lang === 'cpp' ? 'C++' : lang}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedLang === 'c' && (
              <button
                onClick={handleOpenInPlayground}
                className="px-2.5 sm:px-3 py-1 text-xs font-semibold bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/40 rounded-lg transition-colors flex items-center gap-1 shrink-0 mobile-tap cursor-pointer"
              >
                <span>Playground</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleCopy}
              className="px-2.5 sm:px-3 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1 shrink-0 mobile-tap cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="relative bg-slate-950 p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-emerald-300 leading-relaxed selection:bg-emerald-500/30">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>

      {/* SOCIAL SHARING BAR */}
      <div className="mb-10 p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Share Day {problem.dayNumber} Solution with friends &amp; batchmates
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Help fellow learners solve today's challenge with verified multi-language codes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *Unstop POTD Day ${problem.dayNumber}: ${problem.title}*\nRead full code solutions (C, C++, Java, Python, JS) on SakshamXTech: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>WhatsApp</span>
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(`🔥 Unstop POTD Day ${problem.dayNumber}: ${problem.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Telegram</span>
          </a>
          <button
            onClick={handleShareLink}
            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* INLINE ADMIN UNSTOP STUDIO MODAL */}
      {isEditOpen && (
        <UnstopEditorModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={problem}
          suggestedDayNumber={problem.dayNumber}
          onSave={(data) => {
            updateUnstopProblem(problem.id, data);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
};
