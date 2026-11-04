import React, { useState } from 'react';
import { 
  Calculator, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Gift, 
  CheckCircle2, 
  Info,
  ChevronRight,
  TrendingUp,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';
import confetti from 'canvas-confetti';

interface ArcadeCalculatorPageProps {
  navigate: (path: string) => void;
}

export const ArcadeCalculatorPage: React.FC<ArcadeCalculatorPageProps> = ({ navigate }) => {
  const { arcadeCalculatorConfig, trackEvent } = useApp();

  const [skillBadges, setSkillBadges] = useState(15);
  const [triviaGames, setTriviaGames] = useState(5);
  const [labCompletions, setLabCompletions] = useState(8);

  // Track calculator usage once per session
  React.useEffect(() => {
    trackEvent('calculator');
  }, []);

  const badgePoints = skillBadges * arcadeCalculatorConfig.pointsPerSkillBadge;
  const triviaPoints = triviaGames * arcadeCalculatorConfig.pointsPerTriviaGame;
  const labPoints = labCompletions * arcadeCalculatorConfig.pointsPerLabCompletion;

  const totalPoints = badgePoints + triviaPoints + labPoints;

  // Find tier
  const tiersAsc = [...arcadeCalculatorConfig.tiers].sort((a, b) => a.minPoints - b.minPoints);
  const tiersDesc = [...arcadeCalculatorConfig.tiers].sort((a, b) => b.minPoints - a.minPoints);

  const currentTier = tiersDesc.find((t) => totalPoints >= t.minPoints) || tiersAsc[0];
  const nextTier = tiersAsc.find((t) => t.minPoints > totalPoints);

  const pointsToNext = nextTier ? nextTier.minPoints - totalPoints : 0;
  const progressPercent = nextTier 
    ? Math.min(100, Math.round((totalPoints / nextTier.minPoints) * 100))
    : 100;

  const handleReset = () => {
    setSkillBadges(0);
    setTriviaGames(0);
    setLabCompletions(0);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#0070f3', '#ff0033', '#f59e0b', '#10b981', '#8b5cf6'],
    });
  };

  return (
    <div className="py-8 sm:py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100">
      <SEOHead
        title="Google Cloud Arcade Points & Tier Calculator 2026 | SakshamXTech"
        description="Estimate your Google Cloud Arcade points, predict your swag tier, and calculate required skill badges and trivia games for the 2026 season."
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/google-arcade')} className="hover:text-blue-600">Google Cloud Arcade</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Points Calculator</span>
      </div>

      {/* Header Banner */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Arcade Points & Swag Tier Calculator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Calculate your estimated points for the Google Cloud Arcade 2026 season. See which physical swag tier you unlock and what remains.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Input Completed Activities</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Skill Badges Slider & Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Google Cloud Skill Badges</span>
              <span className="text-blue-600 font-mono font-bold">+{badgePoints} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="50"
                value={skillBadges}
                onChange={(e) => setSkillBadges(parseInt(e.target.value) || 0)}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={skillBadges}
                onChange={(e) => setSkillBadges(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Each completed Skill Badge awards {arcadeCalculatorConfig.pointsPerSkillBadge} Arcade point.
            </p>
          </div>

          {/* Trivia Games Slider & Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Arcade Trivia Quizzes</span>
              <span className="text-indigo-600 font-mono font-bold">+{triviaPoints} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="25"
                value={triviaGames}
                onChange={(e) => setTriviaGames(parseInt(e.target.value) || 0)}
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="50"
                value={triviaGames}
                onChange={(e) => setTriviaGames(Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Bi-weekly Arcade Trivia challenges award {arcadeCalculatorConfig.pointsPerTriviaGame} Arcade point each.
            </p>
          </div>

          {/* Individual Lab Completions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Non-Badge Lab Completions</span>
              <span className="text-purple-600 font-mono font-bold">+{labPoints} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="50"
                value={labCompletions}
                onChange={(e) => setLabCompletions(parseInt(e.target.value) || 0)}
                className="flex-1 accent-purple-600 cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={labCompletions}
                onChange={(e) => setLabCompletions(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-16 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-center font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Regular standalone arcade labs award {arcadeCalculatorConfig.pointsPerLabCompletion} points each.
            </p>
          </div>

          {/* Formula explainer */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Official Formula Breakdown:</p>
              <p className="font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                Total = ({skillBadges} × {arcadeCalculatorConfig.pointsPerSkillBadge}) + ({triviaGames} × {arcadeCalculatorConfig.pointsPerTriviaGame}) + ({labCompletions} × {arcadeCalculatorConfig.pointsPerLabCompletion}) = {totalPoints.toFixed(1)} Points
              </p>
            </div>
          </div>
        </div>

        {/* Right Output Tier Prediction Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Predicted Swag Tier
              </span>
              <button
                onClick={handleCelebrate}
                className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:bg-amber-100 transition-colors"
              >
                🎉 Confetti
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                {totalPoints.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">Total Arcade Points</span>
            </div>

            {/* Current Tier Badge */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Eligible Tier</span>
                <span className={`text-base font-black px-3 py-1 rounded-lg bg-gradient-to-r ${currentTier.color} text-white inline-block mt-1 shadow-sm`}>
                  {currentTier.tierName}
                </span>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>

            {/* Progress to next tier */}
            {nextTier ? (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">
                    Progress to <strong className="text-slate-900 dark:text-white">{nextTier.tierName}</strong> ({nextTier.minPoints} pts)
                  </span>
                  <span className="text-blue-600 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Earn <strong>{pointsToNext.toFixed(1)} more points</strong> to unlock {nextTier.tierName} swags!
                </p>
              </div>
            ) : (
              <div className="mt-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                🏆 Outstanding! You have reached the highest <strong>Champion Tier</strong>!
              </div>
            )}

            {/* Swags included in current tier */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-red-500" />
                Physical Swags Included in this Tier
              </h4>
              <ul className="space-y-2">
                {currentTier.swags.map((swag, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{swag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};