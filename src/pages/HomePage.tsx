import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Code2, 
  BookOpen, 
  Briefcase, 
  Gift, 
  Terminal, 
  Wrench, 
  FolderDown, 
  CheckCircle2, 
  Users, 
  Video, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck, 
  Flame,
  Calculator,
  Trophy,
  Compass,
  ArrowUpRight,
  Youtube,
  Radio,
  X,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Award,
  Cpu,
  Bookmark,
  Share2,
  Crown,
  Laptop,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';
import { SAKSHAMXTECH_HANDLE } from '../services/youtubeService';
import { formatRealDate, formatFullDate, getRelativeTimeString, isDateToday, getTodayISODate } from '../utils/realTime';
import confetti from 'canvas-confetti';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { 
    siteSettings, 
    arcadeSolutions, 
    unstopProblems, 
    blogs, 
    opportunities, 
    swags, 
    cLessons, 
    leaderboard, 
    arcadeCalculatorConfig,
    trackEvent,
    youtubeVideos,
    refreshYouTubeVideos,
    isFetchingYouTube,
  } = useApp();

  // Active YouTube Cinema Player Modal
  const [activeVideoModal, setActiveVideoModal] = useState<{ id: string; title: string } | null>(null);

  // Real-time host calendar ticker for midnight auto-update without page reload
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => getTodayISODate());

  useEffect(() => {
    const timer = setInterval(() => {
      const fresh = getTodayISODate();
      if (fresh !== currentDateStr) {
        setCurrentDateStr(fresh);
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [currentDateStr]);

  // YouTube Carousel Scroll Ref
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Calculator State matching Mockup Dropdowns
  const [calcBadges, setCalcBadges] = useState<number>(10);
  const [calcTrivia, setCalcTrivia] = useState<number>(5);
  const [calcLabs, setCalcLabs] = useState<number>(45);
  const [hasCalculated, setHasCalculated] = useState(true);

  // Easter Egg Interactive State for Welcome Badge
  const [waveCount, setWaveCount] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const welcomeMessages = [
    "🎉 Woohoo! Welcome to SakshamXTech, Champion! 🚀",
    "✨ Saksham Sharma says: Learn. Build. Explore. Grow! 🔥",
    "🎁 Pro-Tip: Solve Arcade Labs & grab free official swags! 🏆",
    "💻 Daily Unstop POTD solutions updated in C, C++ & Python! ⚡",
    "⭐ High-Five! You're now an official Tech Explorer! 🙌",
    "🚀 Cloud + Code + Free Goodies = SakshamXTech magic! ✨",
  ];

  const handleWelcomeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Trigger animated hand wave
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 2200);

    // 2. Cycle messages & show bubble
    const nextMsg = welcomeMessages[waveCount % welcomeMessages.length];
    setWaveCount((prev) => prev + 1);
    setWelcomeToast(nextMsg);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setWelcomeToast(null);
    }, 4000);

    // 3. Fire colorful celebratory confetti
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x, y: Math.max(0.1, y - 0.04) },
      colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8B5CF6', '#EC4899'],
      ticks: 180,
      gravity: 1.1,
      scalar: 0.9,
    });
  };

  // Carousel Navigation Handler
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const calculatedPoints = 
    calcBadges * arcadeCalculatorConfig.pointsPerSkillBadge +
    calcTrivia * arcadeCalculatorConfig.pointsPerTriviaGame +
    calcLabs * arcadeCalculatorConfig.pointsPerLabCompletion;

  const currentTier = 
    arcadeCalculatorConfig.tiers
      .slice()
      .reverse()
      .find((t) => calculatedPoints >= t.minPoints) || arcadeCalculatorConfig.tiers[0];

  const handleCalculate = () => {
    setHasCalculated(true);
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0070f3', '#ff0033', '#f59e0b', '#10b981', '#8b5cf6'],
    });
  };

  // Live auto-updating YouTube videos from global AppContext
  const ytVideos = youtubeVideos;

  // 8 Categories matching Mockup exactly
  const categories = [
    {
      title: 'Google Cloud Arcade',
      subtitle: 'Labs • Solutions • Skill Badges',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-500/30 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
            <path d="M19 14h-1.5c0-.28-.05-.55-.13-.81l1.41-1.41c.14.71.22 1.45.22 2.22z" fill="#34A853"/>
            <path d="M6 14c0-1.66 1.34-3 3-3h1.5v-1.5c0-1.93 1.57-3.5 3.5-3.5 1.54 0 2.84 1 3.29 2.41l1.41-1.41C17.7 5.75 15.99 5 14 5 10.69 5 8 7.69 8 11H6c-1.66 0-3 1.34-3 3s1.34 3 3 3h4v-2H6z" fill="#FBBC05"/>
            <path d="M19.35 10.04c-.21-1.07-.68-2.05-1.35-2.87l-1.41 1.41c.47.57.8 1.25.95 2z" fill="#EA4335"/>
          </svg>
        </div>
      ),
      path: '/google-arcade',
    },
    {
      title: 'Unstop POTD',
      subtitle: 'Daily Problems • Solutions • Series',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
          <span className="font-black text-xl tracking-tighter">U</span>
        </div>
      ),
      path: '/unstop',
    },
    {
      title: 'Tech Blogs',
      subtitle: 'Guides • Tutorials • Tips & More',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-500/30 flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
          <BookOpen className="w-6 h-6" />
        </div>
      ),
      path: '/blogs',
    },
    {
      title: 'Opportunities',
      subtitle: 'Internships • Hackathons • Events • Jobs',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200/60 dark:border-red-500/30 flex items-center justify-center text-red-600 shadow-sm group-hover:scale-110 transition-transform">
          <Briefcase className="w-6 h-6" />
        </div>
      ),
      path: '/opportunities',
    },
    {
      title: 'Free Swags',
      subtitle: 'Google • Microsoft • Unstop & More',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-500/30 flex items-center justify-center text-rose-600 shadow-sm group-hover:scale-110 transition-transform">
          <Gift className="w-6 h-6" />
        </div>
      ),
      path: '/swags',
    },
    {
      title: 'C Academy',
      subtitle: 'Learn C • Practice • Online Compiler',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-500/30 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform">
          <Terminal className="w-6 h-6" />
        </div>
      ),
      path: '/c-academy',
    },
    {
      title: 'Tools & Utilities',
      subtitle: 'Arcade Calculator • Points Tracker • More',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200/60 dark:border-violet-500/30 flex items-center justify-center text-violet-600 shadow-sm group-hover:scale-110 transition-transform">
          <Wrench className="w-6 h-6" />
        </div>
      ),
      path: '/tools',
    },
    {
      title: 'Resources',
      subtitle: 'Notes • PDFs • Roadmaps',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
          <FolderDown className="w-6 h-6" />
        </div>
      ),
      path: '/resources',
    },
  ];

  return (
    <div className="relative pb-24 overflow-hidden bg-[#f8fafc] dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <SEOHead
        title="SakshamXTech | Learn. Build. Explore. Grow."
        description="Your one-stop platform for Google Cloud Arcade, Unstop POTD, Tech Blogs, Opportunities, Free Swags, and Programming Learning."
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (EXACT REPLICA OF MOCKUP)                                */}
      {/* ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 overflow-hidden">
        {/* Soft background radial blue gradient matching design */}
        <div className="absolute top-0 right-1/4 w-[750px] h-[550px] bg-gradient-to-bl from-blue-100/70 via-sky-50/50 to-transparent dark:from-blue-900/15 dark:via-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
            
            {/* Left Column: Headline, Subtitle & Buttons */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4 sm:space-y-6 text-left">
              
              {/* Header Container: on mobile, headline and compact portrait sit side by side */}
              <div className="flex items-start justify-between gap-3 sm:gap-4 lg:block">
                <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                  {/* Interactive Welcome Badge with Waving Hand & Confetti Easter Egg */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={handleWelcomeClick}
                      className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-xs transition-all duration-300 cursor-pointer select-none mobile-tap group ${
                        isWaving
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-transparent scale-105 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/50'
                          : 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-200/70 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100/90 dark:hover:bg-blue-900/50 hover:border-blue-300'
                      }`}
                      title="Tap for a wave & surprise!"
                    >
                      <span className={`text-sm inline-block transition-transform duration-300 ${
                        isWaving ? 'animate-wave-hand' : 'group-hover:rotate-12'
                      }`}>
                        👋
                      </span>
                      <span className="truncate">
                        {isWaving ? "You're Awesome!" : "Welcome to SakshamXTech"}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isWaving ? 'bg-amber-300 animate-ping' : 'bg-blue-500/60 dark:bg-blue-400/60'
                      }`} />
                    </button>

                    {/* Floating Celebration Speech Bubble */}
                    {welcomeToast && (
                      <div className="absolute left-0 top-full mt-2.5 z-40 max-w-[270px] xs:max-w-xs sm:max-w-sm p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-500/30 text-slate-900 dark:text-white shadow-xl shadow-blue-500/10 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
                        <div className="flex items-start gap-2">
                          <span className="text-base shrink-0">✨</span>
                          <p className="leading-snug">{welcomeToast}</p>
                        </div>
                        {/* Speech bubble arrow pointer */}
                        <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white dark:bg-slate-900 border-t border-l border-blue-500/30 rotate-45" />
                      </div>
                    )}
                  </div>

                  {/* Giant Headline: Learn. Build. Explore. Grow. */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                    Learn. Build.<br />
                    <span className="text-[#0066cc] dark:text-[#38bdf8]">Explore. </span>
                    <span className="text-[#e50914] dark:text-[#f87171]">Grow.</span>
                  </h1>
                </div>

                {/* Mobile-Only Compact Hero Portrait Card (Side-by-side with headline on mobile) */}
                <div className="lg:hidden shrink-0 relative mt-1">
                  <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 rounded-2xl xs:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-3 border-white dark:border-slate-800 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <img
                      src="/assets/branding/saksham_portrait.png"
                      alt="Saksham Sharma"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/branding/saksham_avatar.png';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                  </div>
                  {/* Floating Micro YouTube Badge */}
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-red-600 text-white shadow-md shadow-red-500/30">
                    <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                  </div>
                  {/* Floating Micro Cloud Badge */}
                  <div className="absolute -top-1 -left-1 p-1 rounded-lg bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
                      <path d="M19 14h-1.5c0-.28-.05-.55-.13-.81l1.41-1.41c.14.71.22 1.45.22 2.22z" fill="#34A853"/>
                      <path d="M6 14c0-1.66 1.34-3 3-3h1.5v-1.5c0-1.93 1.57-3.5 3.5-3.5 1.54 0 2.84 1 3.29 2.41l1.41-1.41C17.7 5.75 15.99 5 14 5 10.69 5 8 7.69 8 11H6c-1.66 0-3 1.34-3 3s1.34 3 3 3h4v-2H6z" fill="#FBBC05"/>
                      <path d="M19.35 10.04c-.21-1.07-.68-2.05-1.35-2.87l-1.41 1.41c.47.57.8 1.25.95 2z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                Your one-stop platform for Google Cloud Arcade, Unstop POTD, Tech Blogs, Opportunities, Free Swags, and Programming Learning.
              </p>

              {/* CTA Action Buttons: Explore Platform & Watch on YouTube (Single Row Side-by-Side) */}
              <div className="flex flex-row items-center gap-2 sm:gap-3.5 pt-1 sm:pt-2">
                <button
                  onClick={() => {
                    trackEvent('pageView', '/google-arcade');
                    navigate('/google-arcade');
                  }}
                  className="flex-1 sm:flex-initial justify-center px-3 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md sm:shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer group mobile-tap shrink-0 whitespace-nowrap"
                >
                  <span>Explore Platform</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>

                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('youtube', 'Watch on YouTube (Hero CTA)', { videoId: 'channel', videoTitle: 'Visit SakshamXTech Channel', pagePath: '/' })}
                  className="flex-1 sm:flex-initial justify-center px-3 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm bg-[#e50914] hover:bg-[#c90812] text-white shadow-md sm:shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer mobile-tap shrink-0 whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5 shrink-0" />
                  <span>Watch on YouTube</span>
                </a>
              </div>

            </div>

            {/* Right Column: Creative Visual Area with Saksham, 3D Cloud, Laptop & Floating Badges (Desktop Only, Mobile has top-side portrait) */}
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 relative items-center justify-center">
              
              {/* Organic Curved Gradient Splash behind Portrait */}
              <div className="absolute inset-0 max-w-[320px] sm:max-w-[420px] max-h-[320px] sm:max-h-[420px] mx-auto bg-gradient-to-tr from-cyan-400/30 via-blue-500/20 to-sky-300/30 dark:from-cyan-500/20 dark:via-blue-600/20 dark:to-transparent rounded-[50px] rotate-[-4deg] scale-105 pointer-events-none" />

              <div className="relative w-full max-w-[340px] sm:max-w-[440px] aspect-[4/4.5] flex items-center justify-center">
                
                {/* Floating 3D Google Cloud Logo (Top Left) */}
                <div className="absolute top-2 left-2 sm:left-4 z-20 p-2 sm:p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xl border border-slate-100 dark:border-slate-800 animate-bounce duration-1000">
                  <svg className="w-7 h-7 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
                    <path d="M19 14h-1.5c0-.28-.05-.55-.13-.81l1.41-1.41c.14.71.22 1.45.22 2.22z" fill="#34A853"/>
                    <path d="M6 14c0-1.66 1.34-3 3-3h1.5v-1.5c0-1.93 1.57-3.5 3.5-3.5 1.54 0 2.84 1 3.29 2.41l1.41-1.41C17.7 5.75 15.99 5 14 5 10.69 5 8 7.69 8 11H6c-1.66 0-3 1.34-3 3s1.34 3 3 3h4v-2H6z" fill="#FBBC05"/>
                    <path d="M19.35 10.04c-.21-1.07-.68-2.05-1.35-2.87l-1.41 1.41c.47.57.8 1.25.95 2z" fill="#EA4335"/>
                  </svg>
                </div>

                {/* Floating 3D YouTube Icon (Top Right) */}
                <div className="absolute top-4 right-2 sm:right-6 z-20 p-2 sm:p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xl border border-slate-100 dark:border-slate-800 animate-pulse">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/30">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Floating 3D Code Symbol (Middle Right - hidden on mobile to avoid clutter) */}
                <div className="hidden sm:block absolute top-1/2 right-1 sm:right-0 z-20 p-1.5 sm:p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-mono font-bold text-xs">
                  {'</>'}
                </div>

                {/* Floating Saksham Sharma Handwritten Callout (hidden on mobile to prevent clutter & overlap) */}
                <div className="hidden sm:flex absolute top-12 left-4 sm:left-10 z-20 flex-col items-start pointer-events-none">
                  <span className="font-heading italic font-bold text-slate-700 dark:text-slate-200 text-xs sm:text-sm tracking-wide -rotate-6">
                    Saksham<br />Sharma
                  </span>
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-slate-600 dark:text-slate-300 ml-3 -mt-1" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 5 C 10 20, 25 25, 32 30 M26 31 L33 30 L32 23" />
                  </svg>
                </div>

                {/* Central Portrait of Saksham Sharma */}
                <div className="relative w-[250px] xs:w-[270px] sm:w-[340px] aspect-square rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 z-10 group">
                  <img
                    src="/assets/branding/saksham_portrait.png"
                    alt="Saksham Sharma - Founder SakshamXTech"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/branding/saksham_avatar.png';
                    }}
                  />
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                </div>

                {/* Floating SX Badge (Bottom Right) */}
                <div className="absolute -bottom-2 right-2 sm:right-0 z-20 p-1.5 sm:p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-2 sm:gap-2.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-blue-500/30 shadow-md shadow-blue-500/20 bg-slate-900 shrink-0">
                    <img
                      src="/assets/branding/saksham_avatar.png"
                      alt="SakshamXTech Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/branding/saksham_portrait.png';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white block">SakshamXTech</span>
                    <span className="text-[9px] sm:text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Official Platform</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS STRIP (5 WHITE ROUNDED PILL CARDS)                               */}
      {/* ========================================================================= */}
      <section className="relative py-4 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 xl:gap-5">
          
          {/* Card 1: 13.3K+ YouTube Family */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
              <Youtube className="w-5 h-5 fill-red-600" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">
                {siteSettings.statistics?.youtubeSubscribers || '13.3K+'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">YouTube Family</p>
            </div>
          </div>

          {/* Card 2: 100+ Tech Solutions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0 font-mono font-bold">
              {'</>'}
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">100+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tech Solutions</p>
            </div>
          </div>

          {/* Card 3: 50+ Blogs & Guides */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">50+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Blogs & Guides</p>
            </div>
          </div>

          {/* Card 4: 20+ Programs & Events */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
              <span className="text-lg">🚀</span>
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">20+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Programs & Events</p>
            </div>
          </div>

          {/* Card 5: 8K+ Student Community */}
          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white">8K+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Student Community</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. EXPLORE BY CATEGORY (8 COLORFUL ROUNDED CARDS)                         */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-blue-600 inline-block" />
            <span>Explore by Category</span>
          </h2>
          <button
            onClick={() => navigate('/tools')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 xl:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(cat.path)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="mb-4">
                  {cat.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MIDDLE SECTION: LATEST FROM YOUTUBE + ARCADE POINTS CALCULATOR        */}
      {/* ========================================================================= */}
      <section className="py-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Latest from YouTube Slider */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center text-white">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Latest from YouTube
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>{SAKSHAMXTECH_HANDLE}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => refreshYouTubeVideos(true)}
                  disabled={isFetchingYouTube}
                  title="Sync latest uploads from YouTube"
                  className="p-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                  aria-label="Refresh videos"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isFetchingYouTube ? 'animate-spin text-red-600' : ''}`} />
                </button>
                <button
                  onClick={() => scrollCarousel('left')}
                  className="p-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors shadow-sm"
                  aria-label="Previous videos"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="p-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors shadow-sm"
                  aria-label="Next videos"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href={`${siteSettings.socialLinks.youtube}?sub_confirmation=1`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1 ml-1"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Subscribe</span>
                </a>
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  View All →
                </a>
              </div>
            </div>

            {/* Horizontal Video Carousel matching Mockup Cards */}
            <div 
              ref={carouselRef}
              className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth snap-x snap-mandatory scroll-px-4"
            >
              {ytVideos.map((video, idx) => (
                <div
                  key={video.id || idx}
                  onClick={() => {
                    trackEvent('youtube', video.title, {
                      videoId: video.videoId || video.id,
                      videoTitle: video.title,
                      pagePath: '/'
                    });
                    setActiveVideoModal({ id: video.videoId || video.id, title: video.title });
                  }}
                  className="snap-start shrink-0 min-w-[270px] sm:min-w-[300px] max-w-[320px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between mobile-tap"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white">
                        {video.duration || 'Video'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-[11px] flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{video.views || 'Latest'}</span>
                    <span className="text-slate-400 dark:text-slate-500">{video.publishedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Arcade Points Calculator matching Mockup Exactly */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Arcade Points Calculator
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white shadow-sm">
                New
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimate your Google Cloud Arcade 2026 points & tier.
            </p>

            {/* 3 Dropdowns Row matching Mockup */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Skill Badges
                </label>
                <select
                  value={calcBadges}
                  onChange={(e) => setCalcBadges(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[5, 10, 15, 20, 25, 30, 40].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Trivia Games
                </label>
                <select
                  value={calcTrivia}
                  onChange={(e) => setCalcTrivia(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2, 4, 5, 6, 8, 10, 15].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Labs Completed
                </label>
                <select
                  value={calcLabs}
                  onChange={(e) => setCalcLabs(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[10, 20, 30, 45, 50, 75, 100].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculate Points Button */}
            <button
              onClick={handleCalculate}
              className="w-full py-3 rounded-full font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              Calculate Points
            </button>

            {/* Result Box matching Mockup */}
            {hasCalculated && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Estimated Points</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {(calculatedPoints * 1000).toLocaleString()} pts
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Predicted Tier</span>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-xs shadow-sm">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Champion</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PROMO ACTION BANNERS: GOOGLE ARCADE 2026 + TODAY'S UNSTOP POTD         */}
      {/* ========================================================================= */}
      <section className="py-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Banner 1: Google Cloud Arcade 2026 */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="white"/>
                </svg>
                <h3 className="text-2xl font-black text-white">Google Cloud Arcade 2026</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-blue-100 mb-6">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Lab Solutions</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Skill Badges</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Points Calculator</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Swag Updates</span>
              </div>

              <button
                onClick={() => navigate('/google-arcade')}
                className="px-6 py-2.5 rounded-full font-bold text-xs bg-[#e50914] hover:bg-[#c90812] text-white shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Explore Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Display of Physical Swags from Desktop assets */}
            <div className="absolute -right-4 -bottom-4 w-48 sm:w-56 opacity-90 group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <img
                src="/assets/branding/swags_pack.png"
                alt="Google Cloud Swags"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Banner 2: Today's Unstop POTD */}
          {(() => {
            const todayProblem = unstopProblems.find((p) => isDateToday(p.date));

            if (todayProblem) {
              return (
                <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
                  <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="w-6 h-6 rounded-lg bg-white text-purple-900 font-black text-xs flex items-center justify-center">
                        U
                      </span>
                      <h3 className="text-2xl font-black text-white">Today's Unstop POTD</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-purple-100 backdrop-blur-xs font-mono">
                        {formatRealDate(new Date())}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-2">
                      <span className="font-bold text-sm text-purple-100">
                        Day {todayProblem.dayNumber} - {todayProblem.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-bold shrink-0">
                        {todayProblem.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-purple-200 mb-6 leading-relaxed line-clamp-2">
                      {todayProblem.description}
                    </p>

                    <button
                      onClick={() => navigate(`/unstop/${todayProblem.slug}`)}
                      className="px-6 py-2.5 rounded-full font-bold text-xs bg-[#e50914] hover:bg-[#c90812] text-white shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>View Solution</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Code / Visual Decal */}
                  <div className="absolute right-4 bottom-4 font-mono text-5xl font-black text-white/10 pointer-events-none select-none">
                    {'{ ; }'}
                  </div>
                </div>
              );
            }

            // Pending state when Saksham has not yet uploaded today's solution
            return (
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white shadow-xl border border-purple-500/20 relative overflow-hidden flex flex-col justify-between group">
                <div className="relative z-10 max-w-md">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/30 text-purple-200 font-black text-xs flex items-center justify-center border border-purple-400/40">
                      U
                    </span>
                    <h3 className="text-2xl font-black text-white">Today's Unstop POTD</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      {formatRealDate(new Date())}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 my-2">
                    <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Solution Not Yet Uploaded by Saksham
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    Saksham is currently testing optimal solutions in C, C++, Java &amp; Python. Set a reminder in the POTD Hub to get notified the second it goes live!
                  </p>

                  <button
                    onClick={() => navigate('/unstop')}
                    className="px-6 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Set Reminder / Check POTD</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Clock / Waiting Decal */}
                <div className="absolute right-4 bottom-4 font-mono text-5xl font-black text-white/5 pointer-events-none select-none">
                  {'// POTD'}
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FEATURED OPPORTUNITIES & CODING PROBLEMS                               */}
      {/* ========================================================================= */}
      <section className="py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🚀</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Featured Opportunities
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore latest internships, hackathons, competitions & more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Card 1: Google Cloud Facilitator Program 2026 */}
          <div
            onClick={() => navigate('/opportunities')}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Google Cloud Facilitator Program 2026
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                  New
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Swags • Certification
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Card 2: Microsoft Learn Student Ambassador */}
          <div
            onClick={() => navigate('/opportunities')}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Microsoft Learn Student Ambassador
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                  New
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Community • Mentorship & Badges
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>

        </div>

        {/* Daily Coding Problem Quick Links List matching Mockup */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
          {unstopProblems.slice(0, 3).map((prob) => (
            <div
              key={prob.id}
              onClick={() => navigate(`/unstop/${prob.slug}`)}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 truncate">
                  Day {prob.dayNumber} - Coding Problem: <span className="font-normal text-slate-500 dark:text-slate-400">{prob.title}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  {getRelativeTimeString(prob.date)}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. YOUTUBE CINEMA MODAL (INTERACTIVE PLAYER)                              */}
      {/* ========================================================================= */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0 pr-3">
                <Youtube className="w-5 h-5 text-red-500 fill-red-500 shrink-0" />
                <h4 className="text-sm font-bold text-white truncate">{activeVideoModal.title}</h4>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal.id}?autoplay=1`}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
              <span>SakshamXTech Masterclass</span>
              <a
                href={siteSettings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>View Channel on YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
