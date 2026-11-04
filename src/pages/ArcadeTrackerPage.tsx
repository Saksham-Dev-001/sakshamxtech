import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Sparkles, 
  Target, 
  Share2, 
  Download, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';

interface ArcadeTrackerPageProps {
  navigate: (path: string) => void;
}

export const ArcadeTrackerPage: React.FC<ArcadeTrackerPageProps> = ({ navigate }) => {
  const { arcadeSolutions, arcadeCalculatorConfig } = useApp();

  const [completedLabIds, setCompletedLabIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sakshamxtech_tracked_labs');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : ['arc-1'];
    } catch {
      return ['arc-1'];
    }
  });

  const [targetGoal, setTargetGoal] = useState<number>(30); // 30 points for Premium tier
  const [userName, setUserName] = useState<string>('Cloud Achiever');

  useEffect(() => {
    try {
      localStorage.setItem('sakshamxtech_tracked_labs', JSON.stringify(completedLabIds.slice(0, 100)));
    } catch {}
  }, [completedLabIds]);

  const toggleLab = (id: string) => {
    setCompletedLabIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const completedPoints = completedLabIds.reduce((sum, id) => {
    const lab = arcadeSolutions.find((l) => l.id === id);
    return sum + (lab ? lab.pointsAwarded : 1);
  }, 0);

  const percentAchieved = Math.min(100, Math.round((completedPoints / targetGoal) * 100));

  return (
    <div className="py-10 max-w-[1440px] xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <SEOHead
        title="Google Cloud Arcade Personal Progress Tracker | SakshamXTech"
        description="Track your completed Google Cloud Arcade labs, monitor milestone goals, and generate your personal achievement badge."
      />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 dark:bg-indigo-950 dark:border-indigo-500/40 dark:text-indigo-300 text-xs font-bold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Milestone Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Arcade Progress Tracker
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Keep track of labs you've executed, check off completed skill badges, and monitor your path toward your goal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Tracker Overview & Goal Setting */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-indigo-500/30 bg-white dark:bg-slate-950/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
              <span>Target Point Goal</span>
            </h3>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Your Name / Handle</label>
              <input
                type="text"
                maxLength={40}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Target Points</label>
              <div className="flex gap-2">
                {[10, 20, 30, 45].map((pts) => (
                  <button
                    key={pts}
                    onClick={() => setTargetGoal(pts)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      targetGoal === pts
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {pts} pts
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Meter */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">
                  Completed: <strong className="text-blue-600 dark:text-cyan-300">{completedPoints}</strong> / {targetGoal} pts
                </span>
                <span className="text-blue-600 dark:text-indigo-400 font-bold">{percentAchieved}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${percentAchieved}%` }}
                />
              </div>
            </div>
          </div>

          {/* Shareable Achievement Badge Preview */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400 font-bold">
                Arcade 2026 Passport
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">SakshamXTech</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                SX
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">{userName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Google Cloud Arcade Challenger</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center py-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 mb-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Completed Labs</p>
                <p className="text-lg font-black text-blue-600 dark:text-cyan-400">{completedLabIds.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Points Earned</p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{completedPoints}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
              Screenshot & share your progress on LinkedIn or Discord with #SakshamXTech!
            </p>
          </div>
        </div>

        {/* Right Interactive Lab Checklist */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Available Arcade Labs Checklist</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {completedLabIds.length} of {arcadeSolutions.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {arcadeSolutions.map((sol) => {
              const isDone = completedLabIds.includes(sol.id);
              return (
                <div
                  key={sol.id}
                  onClick={() => toggleLab(sol.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isDone
                      ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-cyan-950/30 dark:border-cyan-500/40 dark:text-cyan-200'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <button className="text-blue-600 dark:text-cyan-400 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 fill-blue-500/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                          {sol.labCode}
                        </span>
                        <h4 className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {sol.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sol.difficulty} • {sol.durationMinutes} mins</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0">
                    +{sol.pointsAwarded} pt
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
