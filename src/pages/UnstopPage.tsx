import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code2, 
  Flame, 
  Calendar, 
  Search, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Bell,
  Check,
  Plus,
  Edit3,
  X,
  ExternalLink,
  Clock,
  Send,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { 
  formatRealDate, 
  formatFullDate, 
  getRelativeTimeString, 
  isDateToday, 
  getTodayISODate 
} from '../utils/realTime';
import { UnstopEditorModal } from './admin/ContentEditorModals';
import { UnstopProblem } from '../types';

interface UnstopPageProps {
  navigate: (path: string) => void;
}

export const UnstopPage: React.FC<UnstopPageProps> = ({ navigate }) => {
  const { unstopProblems, addUnstopProblem, updateUnstopProblem, trackEvent, siteSettings } = useApp();
  const { isAdmin } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  // Persistent reminder state tied to today's ISO date in localStorage
  const [reminderSet, setReminderSet] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`unstop_reminder_${getTodayISODate()}`) === 'true';
    } catch {
      return false;
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modal state for direct adding / editing
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    data: UnstopProblem | null;
  }>({
    isOpen: false,
    data: null,
  });

  // Real-time date auto-sync ticker: checks every 30 seconds for date roll-overs
  const [currentDateStr, setCurrentDateStr] = useState(() => getTodayISODate());
  useEffect(() => {
    const timer = setInterval(() => {
      const freshDateStr = getTodayISODate();
      if (freshDateStr !== currentDateStr) {
        setCurrentDateStr(freshDateStr);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [currentDateStr]);

  // Keep reminder state aligned when date rolls over
  useEffect(() => {
    try {
      setReminderSet(localStorage.getItem(`unstop_reminder_${currentDateStr}`) === 'true');
    } catch {
      setReminderSet(false);
    }
  }, [currentDateStr]);

  // Today's problem detection: strictly looks for a problem matching today's calendar date
  const todaysProblem = useMemo(() => {
    return unstopProblems.find((p) => isDateToday(p.date));
  }, [unstopProblems, currentDateStr]);

  // Next Day Number auto-calculation: always previous max + 1 (e.g. Day 1 -> Day 2)
  const nextDayNumber = useMemo(() => {
    if (!unstopProblems || unstopProblems.length === 0) return 1;
    return Math.max(...unstopProblems.map((p) => Number(p.dayNumber) || 0)) + 1;
  }, [unstopProblems]);

  // Other past problems (everything except today's problem to avoid duplicate listing)
  const pastProblems = useMemo(() => {
    if (todaysProblem) {
      return unstopProblems.filter((p) => p.id !== todaysProblem.id);
    }
    return unstopProblems;
  }, [unstopProblems, todaysProblem]);

  // Filtered past problems based on search & difficulty filter
  const filteredProblems = useMemo(() => {
    return pastProblems.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.dayNumber.toString().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

      return matchesSearch && matchesDiff;
    });
  }, [pastProblems, searchQuery, selectedDifficulty]);

  const handleSetReminder = () => {
    setReminderSet(true);
    try {
      localStorage.setItem(`unstop_reminder_${getTodayISODate()}`, 'true');
    } catch (e) {
      console.error('Failed to save reminder in storage', e);
    }
    setToastMessage("🔔 Reminder Set! You'll be notified the moment Saksham posts today's solution.");
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleOpenNewModal = () => {
    setEditorModal({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEditModal = (prob: UnstopProblem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditorModal({
      isOpen: true,
      data: prob,
    });
  };

  const handleSaveModal = (data: Partial<UnstopProblem>) => {
    if (editorModal.data && editorModal.data.id) {
      updateUnstopProblem(editorModal.data.id, {
        ...data,
        date: data.date || editorModal.data.date || getTodayISODate(),
      });
    } else {
      const chosenDay = Number(data.dayNumber) || nextDayNumber;
      addUnstopProblem({
        dayNumber: chosenDay,
        title: data.title || 'Untitled Problem',
        slug: data.slug || `day-${chosenDay}-solution`,
        difficulty: data.difficulty || 'Medium',
        description: data.description || '',
        inputFormat: data.inputFormat || '',
        outputFormat: data.outputFormat || '',
        constraints: data.constraints || [],
        examples: data.examples || [],
        solutionExplanation: data.solutionExplanation || '',
        codeSolutions: data.codeSolutions || [],
        date: data.date || getTodayISODate(),
        tags: data.tags || ['Unstop POTD', 'Data Structures', 'Algorithms'],
      });
    }
    setEditorModal({ isOpen: false, data: null });
  };

  return (
    <div className="py-6 sm:py-10 max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100 space-y-8">
      <SEOHead
        title="Unstop Problem of the Day (POTD) Solutions | SakshamXTech"
        description="Daily Unstop Problem of the Day solutions, optimal algorithms, test cases, and code snippets in C, C++, Java, Python, and JavaScript."
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Unstop POTD</span>
      </div>

      {/* Floating / Inline Success Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-500/20">
              U
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Unstop Problem of the Day (POTD)</span>
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Daily optimal algorithm blueprints, test-case verified logic, and clean multi-language code in C, C++, Java, and Python by Saksham Sharma.
          </p>
        </div>

        {/* Right Action Row: Search + Admin Add Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Day number or topic..."
              maxLength={120}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add POTD</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP SPOTLIGHT SECTION: ALWAYS TODAY'S POTD (OR NOT YET UPLOADED REMINDER) */}
      {/* ========================================================================= */}
      {todaysProblem ? (
        /* STATE A: SAKSHAM HAS POSTED TODAY'S SOLUTION */
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
          {/* Subtle glowing background orbs */}
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Day {todaysProblem.dayNumber} • Today's Problem</span>
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/20 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>{formatFullDate(new Date())}</span>
              </span>

              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                todaysProblem.difficulty === 'Easy'
                  ? 'bg-emerald-400 text-slate-950'
                  : todaysProblem.difficulty === 'Hard'
                  ? 'bg-rose-500 text-white'
                  : 'bg-amber-400 text-slate-950'
              }`}>
                {todaysProblem.difficulty}
              </span>

              {isAdmin && (
                <button
                  onClick={(e) => handleOpenEditModal(todaysProblem, e)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors cursor-pointer ml-auto sm:ml-0"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              {todaysProblem.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {todaysProblem.description}
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-800/60">
                {todaysProblem.codeSolutions.length} Solutions Available (C, C++, Java, Python)
              </span>
            </div>
          </div>

          <div className="relative z-10 shrink-0 flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                trackEvent('pageView', `/unstop/${todaysProblem.slug}`);
                navigate(`/unstop/${todaysProblem.slug}`);
              }}
              className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-2xl font-black text-xs bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer mobile-tap"
            >
              <span>View Today's Solution</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Decorative code decal */}
          <div className="absolute right-6 bottom-4 font-mono text-7xl font-black text-white/5 pointer-events-none select-none">
            {'{ ; }'}
          </div>
        </div>
      ) : (
        /* STATE B: SAKSHAM HAS NOT YET UPLOADED TODAY'S SOLUTION -> SET REMAINDER STATE */
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Subtle glowing background orbs */}
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>Today's POTD • Solution Pending</span>
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/20 font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" />
                <span>{formatFullDate(new Date())}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Solution Not Yet Uploaded by Saksham</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Saksham is currently solving today's Unstop Problem of the Day and preparing tested, optimal solutions in C, C++, Java, and Python. Set a reminder below or join our official community to get alerted the second it goes live!
            </p>

          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleSetReminder}
              disabled={reminderSet}
              className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                reminderSet
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 cursor-pointer active:scale-95'
              }`}
            >
              {reminderSet ? <Check className="w-4 h-4 text-emerald-400" /> : <Bell className="w-4 h-4" />}
              <span>{reminderSet ? 'Reminder Active (Alerts On)' : 'Set Reminder'}</span>
            </button>

            <a
              href={siteSettings.socialLinks.telegram}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Telegram Alert</span>
            </a>

            {isAdmin && (
              <button
                onClick={handleOpenNewModal}
                className="px-5 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Today's Solution</span>
              </button>
            )}
          </div>

          {/* Decorative code decal */}
          <div className="absolute right-6 bottom-4 font-mono text-7xl font-black text-white/5 pointer-events-none select-none">
            {'{ ; }'}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. OTHER DATES / PREVIOUS DAYS ARCHIVE                                   */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Previous Days &amp; Problem Archive</span>
              <span className="text-xs font-mono font-normal text-slate-400">({filteredProblems.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Browse previous POTD solutions, sliding window techniques, DP patterns, and two-pointer code implementations.
            </p>
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => {
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <div className="py-16 text-center space-y-3 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No matching problems found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or reset the difficulty filter to browse all archives.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('All');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Problems Card List */}
        <div className="space-y-3">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              onClick={() => {
                trackEvent('pageView', `/unstop/${prob.slug}`);
                navigate(`/unstop/${prob.slug}`);
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-2xs hover:shadow-xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 pr-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/80 font-mono">
                    Day {prob.dayNumber}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatRealDate(prob.date)}</span>
                    <span className="text-slate-400">({getRelativeTimeString(prob.date)})</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}
                  >
                    {prob.difficulty}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={(e) => handleOpenEditModal(prob, e)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Edit this problem"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {prob.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {prob.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  {prob.codeSolutions.length} Languages
                </span>
                <button className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 rounded-xl transition-all flex items-center gap-1 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white cursor-pointer">
                  <span>View Solution</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL INLINE ADMIN UNSTOP STUDIO MODAL */}
      {editorModal.isOpen && (
        <UnstopEditorModal
          isOpen={editorModal.isOpen}
          onClose={() => setEditorModal({ isOpen: false, data: null })}
          initialData={editorModal.data}
          suggestedDayNumber={nextDayNumber}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};
