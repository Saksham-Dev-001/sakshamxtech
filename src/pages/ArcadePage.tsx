import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Clock, 
  Award, 
  Terminal, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle, 
  Flame,
  Filter,
  Calculator,
  Compass,
  Gift,
  ArrowRight,
  ExternalLink,
  Laptop,
  RotateCcw,
  Check,
  Circle,
  Trophy,
  Target,
  Info,
  TrendingUp,
  Share2,
  Copy,
  Plus,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { ArcadeSolution, SwagItem } from '../types';
import { getTodayISODate } from '../utils/realTime';
import { ArcadeEditorModal, SwagEditorModal } from './admin/ContentEditorModals';
import confetti from 'canvas-confetti';

interface ArcadePageProps {
  navigate: (path: string) => void;
  initialTab?: 'solutions' | 'calculator' | 'swags' | 'tracker' | 'faqs';
}

export const ArcadePage: React.FC<ArcadePageProps> = ({ navigate, initialTab }) => {
  const { 
    arcadeSolutions, 
    addArcadeSolution, 
    updateArcadeSolution, 
    arcadeCalculatorConfig, 
    swags, 
    addSwag,
    updateSwag,
    trackEvent 
  } = useApp();
  const { isAdmin } = useAuth();

  // Inline Admin Lab Modal State
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    data: ArcadeSolution | null;
  }>({
    isOpen: false,
    data: null,
  });

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

  const handleOpenNewModal = () => {
    setEditorModal({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEditModal = (sol: ArcadeSolution, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditorModal({
      isOpen: true,
      data: sol,
    });
  };

  const handleSaveModal = (data: Partial<ArcadeSolution>) => {
    if (editorModal.data && editorModal.data.id) {
      updateArcadeSolution(editorModal.data.id, data);
    } else {
      addArcadeSolution({
        labCode: data.labCode || 'GSP000',
        title: data.title || 'New Lab Solution',
        slug: data.slug || (data.title || 'lab').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        difficulty: data.difficulty || 'Beginner',
        durationMinutes: data.durationMinutes || 15,
        category: data.category || 'Arcade Lab',
        description: data.description || '',
        prerequisites: data.prerequisites || ['Basic Google Cloud Console knowledge'],
        pointsAwarded: data.pointsAwarded ?? 1,
        lastUpdated: getTodayISODate(),
        isPublished: true,
        youtubeVideoId: data.youtubeVideoId,
        importantCommands: data.importantCommands || [],
        steps: data.steps || [
          {
            stepNumber: 1,
            title: 'Run Cloud Shell Setup',
            description: 'Execute the required setup commands.',
            command: 'gcloud config set project $(gcloud config get-value project)',
          },
        ],
      });
    }
    setEditorModal({ isOpen: false, data: null });
  };

  // Active Tab state (Synchronized with URL query param ?tab=...)
  const [activeTab, setActiveTab] = useState<'solutions' | 'calculator' | 'swags' | 'tracker' | 'faqs'>(() => {
    if (initialTab) return initialTab;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'calculator' || tabParam === 'swags' || tabParam === 'tracker' || tabParam === 'faqs') {
      return tabParam;
    }
    return 'solutions';
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: 'solutions' | 'calculator' | 'swags' | 'tracker' | 'faqs') => {
    setActiveTab(tab);
    const newUrl = tab === 'solutions' ? '/google-arcade' : `/google-arcade?tab=${tab}`;
    window.history.replaceState({}, '', newUrl);
    trackEvent('pageView', newUrl);
  };

  // --------------------------------------------------------------------------
  // TAB 1: LAB SOLUTIONS FILTER & SEARCH STATE
  // --------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredSolutions = arcadeSolutions.filter((sol) => {
    if (!sol.isPublished) return false;
    const matchesSearch = 
      sol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.labCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sol.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDiff = selectedDifficulty === 'All' || sol.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // --------------------------------------------------------------------------
  // TAB 2: POINTS & TIER CALCULATOR STATE
  // --------------------------------------------------------------------------
  const [skillBadges, setSkillBadges] = useState(15);
  const [triviaGames, setTriviaGames] = useState(5);
  const [labCompletions, setLabCompletions] = useState(8);

  const badgePoints = skillBadges * (arcadeCalculatorConfig?.pointsPerSkillBadge || 1);
  const triviaPoints = triviaGames * (arcadeCalculatorConfig?.pointsPerTriviaGame || 1);
  const labPoints = labCompletions * (arcadeCalculatorConfig?.pointsPerLabCompletion || 0.5);
  const totalPoints = Math.round((badgePoints + triviaPoints + labPoints) * 10) / 10;

  const tiersAsc = [...(arcadeCalculatorConfig?.tiers || [])].sort((a, b) => a.minPoints - b.minPoints);
  const tiersDesc = [...(arcadeCalculatorConfig?.tiers || [])].sort((a, b) => b.minPoints - a.minPoints);

  const currentTier = tiersDesc.find((t) => totalPoints >= t.minPoints) || tiersAsc[0] || {
    tierName: 'Standard Tier',
    minPoints: 10,
    swags: ['Google Cloud Arcade T-Shirt', 'Sticker Pack', 'Certificate of Completion'],
    color: '#0070f3',
  };

  const nextTier = tiersAsc.find((t) => t.minPoints > totalPoints);
  const pointsToNext = nextTier ? Math.round((nextTier.minPoints - totalPoints) * 10) / 10 : 0;
  const progressPercent = nextTier 
    ? Math.min(100, Math.round((totalPoints / nextTier.minPoints) * 100))
    : 100;

  const handleCelebrate = () => {
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8b5cf6'],
    });
  };

  // --------------------------------------------------------------------------
  // TAB 3: ARCADE SWAGS & REWARDS STATE (4 OFFICIAL 2026 PRIZE TIERS)
  // --------------------------------------------------------------------------
  const [swagFilter, setSwagFilter] = useState<string>('All Tiers');
  const swagTierFilters = ['All Tiers', 'Trooper', 'Ranger', 'Champion', 'Legend'];

  const arcadeSwags = swags.filter((s) => s.brand === 'Google Cloud Arcade');
  const filteredSwags = arcadeSwags.filter((s) => {
    if (swagFilter === 'All Tiers' || swagFilter === 'All') return true;
    if (s.tierTags && s.tierTags.includes(swagFilter as any)) return true;
    if (s.tierRequired && s.tierRequired.toLowerCase().includes(swagFilter.toLowerCase())) return true;
    return false;
  });

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

  // --------------------------------------------------------------------------
  // TAB 4: MILESTONE TRACKER STATE
  // --------------------------------------------------------------------------
  const [completedLabIds, setCompletedLabIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sakshamxtech_tracked_labs');
    return saved ? JSON.parse(saved) : ['arc-1'];
  });
  const [targetGoal, setTargetGoal] = useState<number>(45);

  useEffect(() => {
    localStorage.setItem('sakshamxtech_tracked_labs', JSON.stringify(completedLabIds));
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

  const trackerPercent = Math.min(100, Math.round((completedPoints / targetGoal) * 100));

  // --------------------------------------------------------------------------
  // TAB 5: FAQS & RULES
  // --------------------------------------------------------------------------
  const faqs = [
    {
      q: 'How does Google Cloud Arcade work in 2026?',
      a: 'Participants complete designated Skill Badges and Arcade Trivia games on Google Cloud Skills Boost to accumulate Arcade Points. These points are redeemed for physical swags (hoodies, backpacks, smart bottles) during the official end-of-season Prize Counter redemption window.',
    },
    {
      q: 'Do Skill Badges expire?',
      a: 'Skill badges remain permanently attached to your public Google Cloud Skills Boost profile, but points for the Arcade Prize Counter only count within the active seasonal campaign.',
    },
    {
      q: 'Are Qwiklabs credits free?',
      a: 'Yes! Google regularly provides monthly 100% free passes or facilitator cohort access codes that grant free credits for all arcade labs without needing a credit card.',
    },
    {
      q: 'How many points do I need for the Champion Kit?',
      a: 'The Champion Tier typically requires 40 to 45 Arcade Points. You can use our integrated Points Calculator tab above to test your required badge count.',
    },
    {
      q: 'When does the Prize Counter open?',
      a: 'The Arcade Prize Counter opens twice a year (typically June and December). When it opens, eligible participants receive an official Google email with a single-use redemption link.',
    },
    {
      q: 'How are physical swags delivered?',
      a: 'All merchandise is dispatched by Google LLC via authorized regional fulfillment partners directly to your residential address with free worldwide shipping.',
    },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100 font-sans">
      <SEOHead
        title="Google Cloud Arcade 2026 Master Hub | Lab Solutions, Calculator, Swags & Tracker | SakshamXTech"
        description="The ultimate Google Cloud Arcade 2026 portal. Lab solutions with GSP codes, points calculator, official physical swags catalog, and progress tracker."
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Google Cloud Arcade 2026</span>
        {activeTab !== 'solutions' && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-600 dark:text-blue-400 font-bold capitalize">
              {activeTab === 'calculator' ? 'Points Calculator' : activeTab === 'swags' ? 'Arcade Swags' : activeTab === 'tracker' ? 'Milestone Tracker' : 'Rules & FAQs'}
            </span>
          </>
        )}
      </div>

      {/* Unified Master Hero Banner */}
      <div className="relative mb-6 sm:mb-8 p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-linear-to-r from-blue-50/90 via-white to-sky-50/90 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xs sm:shadow-sm overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-8">
        
        <div className="max-w-2xl relative z-10 space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 shadow-md p-1.5 sm:p-2 flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="#4285F4"/>
                <path d="M19 14h-1.5c0-.28-.05-.55-.13-.81l1.41-1.41c.14.71.22 1.45.22 2.22z" fill="#34A853"/>
                <path d="M6 14c0-1.66 1.34-3 3-3h1.5v-1.5c0-1.93 1.57-3.5 3.5-3.5 1.54 0 2.84 1 3.29 2.41l1.41-1.41C17.7 5.75 15.99 5 14 5 10.69 5 8 7.69 8 11H6c-1.66 0-3 1.34-3 3s1.34 3 3 3h4v-2H6z" fill="#FBBC05"/>
                <path d="M19.35 10.04c-.21-1.07-.68-2.05-1.35-2.87l-1.41 1.41c.47.57.8 1.25.95 2z" fill="#EA4335"/>
              </svg>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Google Cloud Arcade 2026 Hub
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            All Google Cloud Arcade solutions, points calculator, official physical swag items, and milestone tracking unified under one single roof.
          </p>
        </div>

        {/* Quick Season Stats Box (Symmetric 3-col on Mobile and Desktop) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 w-full lg:w-auto shrink-0">
          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-center shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Active Labs</span>
            <span className="text-sm sm:text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{arcadeSolutions.length}+</span>
          </div>
          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-center shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Champion Goal</span>
            <span className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">45 Pts</span>
          </div>
          <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-center shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">Swag Delivery</span>
            <span className="text-sm sm:text-lg font-black text-purple-600 dark:text-purple-400 font-mono">100% Free</span>
          </div>
        </div>

      </div>

      {/* Systematic Master Navigation Tabs Bar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md py-2.5 sm:py-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-8 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-px-4 snap-x">
          
          <button
            onClick={() => handleTabChange('solutions')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 snap-start shrink-0 cursor-pointer mobile-tap ${
              activeTab === 'solutions'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Lab Solutions &amp; Codes</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
              activeTab === 'solutions' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {arcadeSolutions.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('calculator')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 snap-start shrink-0 cursor-pointer mobile-tap ${
              activeTab === 'calculator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-500" />
            <span>Points Calculator</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Interactive
            </span>
          </button>

          <button
            onClick={() => handleTabChange('swags')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 snap-start shrink-0 cursor-pointer mobile-tap ${
              activeTab === 'swags'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Gift className="w-4 h-4 text-rose-500" />
            <span>Arcade Swags 2026</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
              activeTab === 'swags' ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              {arcadeSwags.length} Items
            </span>
          </button>

          <button
            onClick={() => handleTabChange('tracker')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 snap-start shrink-0 cursor-pointer mobile-tap ${
              activeTab === 'tracker'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-500" />
            <span>Milestone Tracker</span>
          </button>

          <button
            onClick={() => handleTabChange('faqs')}
            className={`px-4 sm:px-5 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center gap-2 snap-start shrink-0 cursor-pointer mobile-tap ${
              activeTab === 'faqs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Rules &amp; FAQs</span>
          </button>

        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: LAB SOLUTIONS & GSP DIRECTORY */}
      {/* ==================================================================== */}
      {activeTab === 'solutions' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors shrink-0 ${
                    selectedDifficulty === diff
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lab code (e.g. GSP001) or title..."
                  maxLength={120}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {isAdmin && (
                <button
                  onClick={handleOpenNewModal}
                  className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer mobile-tap"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Lab</span>
                  <span className="sm:hidden">New</span>
                </button>
              )}
            </div>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSolutions.map((sol) => (
              <div
                key={sol.id}
                onClick={() => {
                  trackEvent('pageView', `/google-arcade/${sol.slug}`);
                  navigate(`/google-arcade/${sol.slug}`);
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                      type="button"
                      onClick={(e) => handleCopyCode(e, sol.labCode)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                      title="Click to copy GSP Code"
                    >
                      <span>{sol.labCode}</span>
                      {copiedCode === sol.labCode ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>

                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sol.durationMinutes} Mins</span>
                      <span>•</span>
                      <span className="capitalize">{sol.difficulty}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {sol.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {sol.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditModal(sol, e);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                        title="Edit lab solution"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Commands</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/30 font-mono">
                    +{sol.pointsAwarded} Pt
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredSolutions.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Terminal className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No lab solutions found</h4>
              <p className="text-xs text-slate-500 mt-1">Try searching for a different GSP code or reset difficulty filter.</p>
            </div>
          )}

        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: POINTS & SWAG TIER CALCULATOR */}
      {/* ==================================================================== */}
      {activeTab === 'calculator' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Arcade 2026 Milestone Simulator
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSkillBadges(0);
                    setTriviaGames(0);
                    setLabCompletions(0);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Counter 1: Skill Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-500" />
                    Skill Badges Completed (1 Pt each)
                  </span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {skillBadges} Badges = {badgePoints} Pts
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={skillBadges}
                  onChange={(e) => setSkillBadges(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>

              {/* Counter 2: Trivia Games */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Arcade Trivia &amp; Special Games (1 Pt each)
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {triviaGames} Trivia = {triviaPoints} Pts
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={triviaGames}
                  onChange={(e) => setTriviaGames(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                </div>
              </div>

              {/* Counter 3: Lab Completions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-500" />
                    Additional Hands-on Lab Solutions (0.5 Pt each)
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {labCompletions} Labs = {labPoints} Pts
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={labCompletions}
                  onChange={(e) => setLabCompletions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0</span>
                  <span>10</span>
                  <span>20</span>
                  <span>30</span>
                </div>
              </div>

              {/* Celebration Confetti Trigger */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCelebrate}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Test Celebration Confetti 🎉</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('swags')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <span>View All 2026 Swags</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Right Result Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block">
                    Estimated Total Points
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                      {totalPoints}
                    </span>
                    <span className="text-lg font-bold text-blue-200">Arcade Points</span>
                  </div>
                </div>

                {/* Unlocked Tier Banner */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/80">Unlocked Swag Tier:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white text-blue-600 shadow-sm">
                      {currentTier.tierName}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Eligible for: {currentTier.swags?.join(', ') || 'Official Swags & Merchandise'}
                  </p>
                </div>

                {/* Progress towards Next Tier */}
                {nextTier ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Next: {nextTier.tierName}</span>
                      <span>{pointsToNext} more points needed</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-white/20 rounded-xl text-xs font-bold">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>Maximum Champion Tier Milestone Reached! 🏆</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleTabChange('swags')}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-blue-600 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Inspect Swags for {currentTier.tierName}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: ARCADE SWAGS & PRIZE COUNTER CATALOG (MATCHING IMAGE 2) */}
      {/* ==================================================================== */}
      {activeTab === 'swags' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Header & Admin Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filter Pills Bar matching Image 2 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar mx-auto sm:mx-0">
              {swagTierFilters.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSwagFilter(tier)}
                  className={`px-5 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    swagFilter === tier
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
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No swags found for {swagFilter}</h4>
              <p className="text-xs text-slate-500 mt-1">Switch to "All Tiers" or add a new swag drop using the button above.</p>
            </div>
          )}

        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: MILESTONE TRACKER */}
      {/* ==================================================================== */}
      {activeTab === 'tracker' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Tracker Progress Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                <Compass className="w-4 h-4" />
                <span>Personal Arcade Checklist</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Track Completed Google Cloud Labs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Check off labs as you complete them on Skills Boost. Progress saves automatically in your browser.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Completed</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {completedPoints}
                </span>
                <span className="text-[10px] text-slate-400">/ {targetGoal} Pts</span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Goal Progress</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {trackerPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arcadeSolutions.map((lab) => {
              const isChecked = completedLabIds.includes(lab.id);
              return (
                <div
                  key={lab.id}
                  onClick={() => toggleLab(lab.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {lab.labCode}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {lab.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 font-mono shrink-0 ml-2">
                    +{lab.pointsAwarded} Pt
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: RULES & FREQUENTLY ASKED QUESTIONS */}
      {/* ==================================================================== */}
      {activeTab === 'faqs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Google Cloud Arcade 2026 Rules &amp; FAQ
                </h3>
                <p className="text-xs text-slate-500">Official guidelines, credit claim instructions, and redemption schedules.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL INLINE ADMIN ARCADE LAB STUDIO MODAL */}
      {editorModal.isOpen && (
        <ArcadeEditorModal
          isOpen={editorModal.isOpen}
          onClose={() => setEditorModal({ isOpen: false, data: null })}
          initialData={editorModal.data}
          onSave={handleSaveModal}
        />
      )}

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
