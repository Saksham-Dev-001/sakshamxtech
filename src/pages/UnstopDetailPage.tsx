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
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { formatFullDate, getRelativeTimeString } from '../utils/realTime';
import { UnstopEditorModal } from './admin/ContentEditorModals';

interface UnstopDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const UnstopDetailPage: React.FC<UnstopDetailPageProps> = ({ slug, navigate }) => {
  const { unstopProblems, updateUnstopProblem, isBookmarked, toggleBookmark, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [selectedLang, setSelectedLang] = useState<'c' | 'cpp' | 'java' | 'python' | 'javascript'>('c');
  const [copied, setCopied] = useState(false);
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

  const currentCode = problem.codeSolutions.find((s) => s.language === selectedLang)?.code 
    || problem.codeSolutions[0]?.code 
    || '// Solution in preparation';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bookmarked = isBookmarked(problem.id);

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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/60 dark:border-amber-500/50 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
            <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
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
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['c', 'cpp', 'java', 'python', 'javascript'] as const).map((lang) => {
              const hasSol = problem.codeSolutions.some((s) => s.language === lang);
              return (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors uppercase ${
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

          <div className="flex items-center gap-2">
            {selectedLang === 'c' && (
              <button
                onClick={handleOpenInPlayground}
                className="px-3 py-1 text-xs font-semibold bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/40 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Run in Playground</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
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
