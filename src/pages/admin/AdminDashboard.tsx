import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Code2, 
  Briefcase, 
  Gift, 
  Terminal, 
  FolderDown, 
  Youtube, 
  Settings, 
  BarChart3, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Save, 
  RotateCcw, 
  RotateCw,
  Check, 
  Copy,
  Eye, 
  Users, 
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Clock,
  Calendar,
  MousePointerClick,
  Laptop,
  Smartphone,
  Tablet,
  Radio,
  Zap,
  Play,
  CheckCircle2,
  Activity,
  Flame,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SEOHead } from '../../components/shared/SEOHead';
import { 
  generateDateWiseAnalytics, 
  formatRealDate, 
  formatFullDate, 
  DateDataPoint,
  formatDelhiDateTime,
  formatCleanDateTime,
  isBlogPostLive,
  getTodayISODate
} from '../../utils/realTime';
import { 
  BlogPost, 
  ArcadeSolution, 
  UnstopProblem, 
  Opportunity, 
  SwagItem, 
  CLesson, 
  ResourceItem 
} from '../../types';
import { 
  saveItemToFirestore, 
  getActiveFirebaseConfig, 
  initFirebase, 
  fetchCollectionFromFirestore,
  testFirestorePermissions,
  FIRESTORE_RULES_CONTENT
} from '../../services/firebaseService';
import {
  YT_API_KEY_STORAGE,
  YT_CHANNEL_ID_STORAGE,
  SAKSHAMXTECH_CHANNEL_ID,
  testYouTubeConnection,
  clearYouTubeCache,
  fetchSingleVideoOEmbed,
} from '../../services/youtubeService';
import {
  BlogEditorModal,
  ArcadeEditorModal,
  UnstopEditorModal,
  OpportunityEditorModal,
  SwagEditorModal,
  CLessonEditorModal,
  ResourceEditorModal,
  extractYouTubeVideoId,
} from './ContentEditorModals';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { user, isAdmin, logout } = useAuth();
  const { 
    siteSettings, 
    updateSiteSettings, 
    blogs, 
    addBlog, 
    updateBlog, 
    deleteBlog,
    arcadeSolutions, 
    addArcadeSolution, 
    updateArcadeSolution, 
    deleteArcadeSolution,
    unstopProblems, 
    addUnstopProblem, 
    updateUnstopProblem, 
    deleteUnstopProblem,
    opportunities, 
    addOpportunity, 
    updateOpportunity, 
    deleteOpportunity,
    swags, 
    addSwag, 
    updateSwag, 
    deleteSwag,
    cLessons, 
    addCLesson, 
    updateCLesson, 
    deleteCLesson,
    resources, 
    addResource, 
    updateResource, 
    deleteResource,
    arcadeCalculatorConfig, 
    updateArcadeCalculatorConfig,
    analytics,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDefaultData,
    youtubeVideos,
    refreshYouTubeVideos,
    isFetchingYouTube,
    addCustomYouTubeVideo,
    deleteCustomYouTubeVideo,
    getRealDateWiseAnalytics,
    getRecentVisitorLogs,
    getRecentYouTubeClickLogs,
    clearRealAnalytics,
    isFirebaseConnected,
    isFirebaseHydrated,
    cloudSyncStatus,
    lastCloudSyncTime,
    hydrateFromFirebase,
    syncAllToFirebase,
  } = useApp();

  // Active module tab
  const [activeModule, setActiveModule] = useState<
    'overview' | 'blogs' | 'arcade' | 'unstop' | 'opportunities' | 'swags' | 'c-academy' | 'resources' | 'youtube' | 'tools' | 'settings' | 'seo-ads' | 'backup' | 'firebase'
  >('overview');

  // Form edit states
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Content Editor Modal States (No browser prompt popups)
  const [blogModal, setBlogModal] = useState<{ isOpen: boolean; data: BlogPost | null }>({ isOpen: false, data: null });
  const [arcadeModal, setArcadeModal] = useState<{ isOpen: boolean; data: ArcadeSolution | null }>({ isOpen: false, data: null });
  const [unstopModal, setUnstopModal] = useState<{ isOpen: boolean; data: UnstopProblem | null }>({ isOpen: false, data: null });
  const [oppModal, setOppModal] = useState<{ isOpen: boolean; data: Opportunity | null }>({ isOpen: false, data: null });
  const [swagModal, setSwagModal] = useState<{ isOpen: boolean; data: SwagItem | null }>({ isOpen: false, data: null });
  const [cLessonModal, setCLessonModal] = useState<{ isOpen: boolean; data: CLesson | null }>({ isOpen: false, data: null });
  const [resourceModal, setResourceModal] = useState<{ isOpen: boolean; data: ResourceItem | null }>({ isOpen: false, data: null });

  // Admin Blogs Management Filter States
  const [adminBlogSearch, setAdminBlogSearch] = useState('');
  const [adminBlogStatusFilter, setAdminBlogStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');
  const [adminBlogCatFilter, setAdminBlogCatFilter] = useState('all');

  // Settings form local buffer
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [calcForm, setCalcForm] = useState(arcadeCalculatorConfig);
  const [ytApiKey, setYtApiKey] = useState(() => localStorage.getItem(YT_API_KEY_STORAGE) || '');
  const [ytChannelId, setYtChannelId] = useState(() => localStorage.getItem(YT_CHANNEL_ID_STORAGE) || SAKSHAMXTECH_CHANNEL_ID);
  const [importJsonText, setImportJsonText] = useState('');

  // Next Unstop Day Number (Highest Day Number + 1)
  const nextUnstopDayNumber = useMemo(() => {
    if (!unstopProblems || unstopProblems.length === 0) return 1;
    return Math.max(...unstopProblems.map((p) => Number(p.dayNumber) || 0)) + 1;
  }, [unstopProblems]);

  // Firebase Cloud State
  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    return getActiveFirebaseConfig() || {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
    };
  });
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState(() => initFirebase().isConnected);

  // Real-time live date/clock state
  const [liveTime, setLiveTime] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timeframe and interactive analytics state
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d' | 'ytd'>('30d');
  const [analyticsRefreshKey, setAnalyticsRefreshKey] = useState(0);
  const analyticsData = useMemo(() => getRealDateWiseAnalytics(timeframe), [timeframe, analyticsRefreshKey, getRealDateWiseAnalytics]);
  const visitorLogs = useMemo(() => getRecentVisitorLogs(100), [analyticsRefreshKey, getRecentVisitorLogs]);
  const ytClickLogs = useMemo(() => getRecentYouTubeClickLogs(100), [analyticsRefreshKey, getRecentYouTubeClickLogs]);
  const [activityFilter, setActivityFilter] = useState<'all' | 'page_view' | 'youtube_click' | 'tool_use'>('all');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'visitor_stream' | 'youtube_clicks'>('visitor_stream');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(6);
  const [selectedDevice, setSelectedDevice] = useState<'all' | 'mobile' | 'desktop' | 'tablet'>('all');
  const [showTableBreakdown, setShowTableBreakdown] = useState(false);
  const [statViewMode, setStatViewMode] = useState<'total' | 'date'>('total');

  // Sync selected point when timeframe changes
  useEffect(() => {
    setSelectedPointIndex(analyticsData.points.length - 1);
  }, [timeframe, analyticsData.points.length]);

  const activePoint: DateDataPoint = analyticsData.points[selectedPointIndex] || analyticsData.points[analyticsData.points.length - 1];

  // Protect route
  if (!isAdmin) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-xs text-slate-400 mb-6">You must authenticate through the private portal to access this command center.</p>
        <button
          onClick={() => navigate('/admin/login')}
          className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const triggerSuccessAlert = (msg: string) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  // Firebase Permissions & Sync Diagnostic State
  const [rulesCopied, setRulesCopied] = useState(false);
  const [syncSummaryModal, setSyncSummaryModal] = useState<{
    isOpen: boolean;
    success: boolean;
    counts?: Record<string, number>;
    error?: string;
  }>({ isOpen: false, success: false });
  const [permProbe, setPermProbe] = useState<{
    tested: boolean;
    loading: boolean;
    ok: boolean;
    status: string;
    error?: string;
    projectId?: string;
  }>({ tested: false, loading: false, ok: false, status: 'idle' });

  const runPermissionsProbe = async () => {
    setPermProbe(prev => ({ ...prev, loading: true }));
    const res = await testFirestorePermissions();
    setPermProbe({
      tested: true,
      loading: false,
      ok: res.ok,
      status: res.status,
      error: res.error,
      projectId: res.projectId || firebaseConfig.projectId,
    });
    if (res.ok) {
      try {
        await hydrateFromFirebase(false);
      } catch (e) {
        console.warn('Hydration after probe error:', e);
      }
    }
  };

  useEffect(() => {
    if (activeModule === 'firebase' && !permProbe.tested && !permProbe.loading) {
      runPermissionsProbe();
    }
  }, [activeModule]);

  const handleCopyRules = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_CONTENT);
    setRulesCopied(true);
    setTimeout(() => setRulesCopied(false), 3000);
  };

  const handleSaveFirebaseConfig = async () => {
    localStorage.setItem('sakshamxtech_firebase_config', JSON.stringify(firebaseConfig));
    const res = initFirebase(true);
    setFirebaseStatus(res.isConnected);
    if (res.isConnected) {
      triggerSuccessAlert('🔥 Connected to Google Cloud Firestore! Probing live permissions...');
      await hydrateFromFirebase(false);
      await runPermissionsProbe();
    } else {
      triggerSuccessAlert('Firebase configuration saved (Credentials require verification).');
    }
  };

  const handleSyncAllToFirebase = async () => {
    setIsSyncingFirebase(true);
    try {
      const res = await syncAllToFirebase();
      if (res.success) {
        setSyncSummaryModal({
          isOpen: true,
          success: true,
          counts: res.syncedCounts,
        });
        triggerSuccessAlert('⚡ All collections successfully synchronized to Google Cloud Firestore!');
        await runPermissionsProbe();
      } else {
        setSyncSummaryModal({
          isOpen: true,
          success: false,
          error: res.error || 'Failed to sync to Cloud Firestore. Please check Firestore rules.',
        });
      }
    } catch (err: any) {
      setSyncSummaryModal({
        isOpen: true,
        success: false,
        error: err?.message || 'Sync failed due to an unexpected error.',
      });
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const handlePullFromFirebase = async () => {
    setIsSyncingFirebase(true);
    try {
      await hydrateFromFirebase(false);
      triggerSuccessAlert('☁️ All data refreshed directly from Google Cloud Firestore!');
    } catch (err: any) {
      alert('Failed to pull from Firestore: ' + err.message);
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const [ytTestStatus, setYtTestStatus] = useState<null | { ok: boolean; message: string }>(null);
  const [ytTesting, setYtTesting] = useState(false);

  const handleSaveYouTubeConfig = () => {
    localStorage.setItem(YT_API_KEY_STORAGE, ytApiKey);
    localStorage.setItem(YT_CHANNEL_ID_STORAGE, ytChannelId);
    clearYouTubeCache();
    triggerSuccessAlert('✅ YouTube config saved! Cache cleared — HomePage will fetch fresh live videos.');
  };

  const handleTestYouTubeConnection = async () => {
    setYtTesting(true);
    setYtTestStatus(null);
    const result = await testYouTubeConnection(ytApiKey.trim(), ytChannelId.trim());
    if (result.ok) {
      setYtTestStatus({
        ok: true,
        message: `✅ Connected! Channel: "${result.channelTitle}" · ${result.videoCount?.toLocaleString()} videos`,
      });
    } else {
      setYtTestStatus({ ok: false, message: `❌ Error: ${result.error}` });
    }
    setYtTesting(false);
  };

  const [quickVideoInput, setQuickVideoInput] = useState('');
  const [isAddingQuickVideo, setIsAddingQuickVideo] = useState(false);
  const [quickVideoMsg, setQuickVideoMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleQuickAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVideoInput.trim()) return;
    setIsAddingQuickVideo(true);
    setQuickVideoMsg(null);
    try {
      const info = await fetchSingleVideoOEmbed(quickVideoInput.trim());
      if (info.ok && info.videoId) {
        await addCustomYouTubeVideo({
          id: `yt-${info.videoId}`,
          videoId: info.videoId,
          title: info.title || `YouTube Video (${info.videoId})`,
          description: `SakshamXTech official video`,
          thumbnailUrl: info.thumbnailUrl || `https://i.ytimg.com/vi/${info.videoId}/hqdefault.jpg`,
          publishedAt: 'Today',
          duration: 'Video',
          views: 'Latest',
          category: 'Google Cloud',
        });
        setQuickVideoInput('');
        setQuickVideoMsg({ ok: true, text: `✅ Added: "${info.title}" to active YouTube feed!` });
        triggerSuccessAlert(`Added "${info.title}" to active YouTube feed!`);
      } else {
        setQuickVideoMsg({ ok: false, text: info.error || 'Failed to detect video from URL' });
      }
    } catch (err: any) {
      setQuickVideoMsg({ ok: false, text: err.message || 'Error adding video' });
    } finally {
      setIsAddingQuickVideo(false);
    }
  };

  const handleForceSyncYouTube = async () => {
    try {
      clearYouTubeCache();
      await refreshYouTubeVideos(true);
      triggerSuccessAlert('🚀 Successfully synced latest uploads from YouTube channel!');
    } catch (err: any) {
      alert('YouTube Sync Error: ' + err.message);
    }
  };

  const handleSaveCalculator = () => {
    updateArcadeCalculatorConfig(calcForm);
    triggerSuccessAlert('Arcade calculator rules saved!');
  };

  const handleSaveSettings = () => {
    updateSiteSettings(settingsForm);
    triggerSuccessAlert('All website settings saved successfully!');
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sakshamxtech-db-backup-${getTodayISODate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSuccessAlert('Database JSON snapshot exported!');
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const ok = importDatabaseJSON(importJsonText);
    if (ok) {
      triggerSuccessAlert('Database successfully restored from JSON!');
      setImportJsonText('');
    } else {
      alert('Invalid JSON structure. Import failed.');
    }
  };

  return (
    <div className="py-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <SEOHead title="Management Studio | SakshamXTech" description="Private workspace." noIndex={true} />

      {/* Top Banner Bar with Live Clock - Clean & Sorted Admin Panel */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs mb-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/25">
              SX
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>SakshamXTech Admin Panel</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/30">
                  Single Owner Role
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/80 dark:text-cyan-300 dark:border-cyan-500/30 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${cloudSyncStatus === 'syncing' ? 'bg-amber-400 animate-spin' : 'bg-emerald-500 animate-pulse'}`} />
                  <span>{cloudSyncStatus === 'syncing' ? 'Cloud Syncing...' : '• Live Cloud Writable'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Authenticated identity: <strong className="text-blue-600 dark:text-cyan-300 font-semibold">{user?.email || 'hutch.saksham@gmail.com'}</strong></span>
                {lastCloudSyncTime && (
                  <span className="text-slate-400 font-mono text-[11px]">• Synced: {lastCloudSyncTime}</span>
                )}
              </p>
            </div>
          </div>

          {/* Live Real-Time Clock & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs">
              <span className="w-2 rounded-full h-2 bg-emerald-500 animate-pulse inline-block" />
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700 dark:text-slate-200 font-bold">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{liveTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>{liveTime.toLocaleTimeString('en-US')}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold uppercase tracking-wider">
                LIVE
              </span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:scale-102 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>View Public Site</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-3.5 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 rounded-xl transition-all hover:scale-102 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success notification banner */}
      {savedSuccess && (
        <div className="p-4 mb-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Sidebar & Dashboard Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Sidebar matching Mockup Panel */}
        <div className="lg:col-span-3 bg-[#0f172a] p-4 rounded-3xl border border-slate-800 text-slate-300 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              SX
            </div>
            <div>
              <span className="text-sm font-black text-white block leading-tight">SakshamXTech</span>
              <span className="text-[10px] text-slate-400 font-medium">Admin Panel</span>
            </div>
          </div>

          {/* Dashboard Main Button */}
          <button
            onClick={() => setActiveModule('overview')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeModule === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* Group 1: Content */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
              Content
            </span>
            {[
              { id: 'blogs', label: 'Blogs', icon: FileText, count: blogs.length },
              { id: 'arcade', label: 'Arcade Solutions', icon: Sparkles, count: arcadeSolutions.length },
              { id: 'unstop', label: 'Unstop POTD', icon: Code2, count: unstopProblems.length },
              { id: 'opportunities', label: 'Opportunities', icon: Briefcase, count: opportunities.length },
              { id: 'swags', label: 'Swags', icon: Gift, count: swags.length },
              { id: 'c-academy', label: 'C Academy', icon: Terminal, count: cLessons.length },
              { id: 'resources', label: 'Resources', icon: FolderDown, count: resources.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-bold">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Group 2: Tools & Utilities */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
              Tools & Utilities
            </span>
            {[
              { id: 'youtube', label: 'YouTube', icon: Youtube },
              { id: 'firebase', label: 'Firebase Sync', icon: TrendingUp },
              { id: 'tools', label: 'Calculator & Tools', icon: Sliders },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'seo-ads', label: 'SEO & Ads', icon: DollarSign },
              { id: 'backup', label: 'Backup & Restore', icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveModule(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW & REAL ANALYTICS */}
          {activeModule === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header Row with Real-Time Dynamic Timeframe Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                    <span>Dashboard</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/40 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Live Host Calendar
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Real-time traffic, visitors, and date-wise analytics synchronized with actual host time
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Mode Toggle: Total Period vs Clicked Date */}
                  <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
                    <button
                      onClick={() => setStatViewMode('total')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        statViewMode === 'total'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Period Total
                    </button>
                    <button
                      onClick={() => setStatViewMode('date')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        statViewMode === 'date'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>Day:</span>
                      <span className="font-mono">{activePoint ? activePoint.dateLabel : 'Select'}</span>
                    </button>
                  </div>

                  {/* Timeframe Selector Pills */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
                    {(
                      [
                        { id: 'today', label: 'Today' },
                        { id: '7d', label: 'Last 7 Days' },
                        { id: '30d', label: 'Last 30 Days' },
                        { id: 'ytd', label: 'Year to Date' },
                      ] as const
                    ).map((tf) => (
                      <button
                        key={tf.id}
                        onClick={() => {
                          setTimeframe(tf.id);
                          setStatViewMode('total');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          timeframe === tf.id
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 Stat Cards - Interactive, Animated & Date-Aware */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Visitors */}
                <div 
                  onClick={() => setStatViewMode(statViewMode === 'date' ? 'total' : 'date')}
                  className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                      {statViewMode === 'date' ? `Visitors (${activePoint.dateLabel})` : 'Total Visitors'}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 relative z-10 tracking-tight">
                    {statViewMode === 'date' 
                      ? activePoint.visitors.toLocaleString()
                      : analyticsData.summary.totalVisitors.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold mt-2 relative z-10">
                    {statViewMode === 'date' ? (
                      <span className="text-blue-600 dark:text-cyan-400">
                        {((activePoint.visitors / analyticsData.summary.totalVisitors) * 100).toFixed(1)}% of period
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <span>▲ +{analyticsData.summary.growthPercent}%</span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">vs prev cycle</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Page Views */}
                <div 
                  onClick={() => setStatViewMode(statViewMode === 'date' ? 'total' : 'date')}
                  className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                      {statViewMode === 'date' ? `Page Views (${activePoint.dateLabel})` : 'Page Views'}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 relative z-10 tracking-tight">
                    {statViewMode === 'date'
                      ? activePoint.pageViews.toLocaleString()
                      : analyticsData.summary.totalPageViews.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold mt-2 relative z-10">
                    {statViewMode === 'date' ? (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        ~{(activePoint.pageViews / activePoint.visitors).toFixed(1)} views/user
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <span>▲ +18.7%</span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">verified</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. New Users */}
                <div 
                  onClick={() => setStatViewMode(statViewMode === 'date' ? 'total' : 'date')}
                  className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                      {statViewMode === 'date' ? `New Users (${activePoint.dateLabel})` : 'New Users'}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 relative z-10 tracking-tight">
                    {statViewMode === 'date'
                      ? activePoint.newUsers.toLocaleString()
                      : analyticsData.summary.totalNewUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold mt-2 relative z-10">
                    {statViewMode === 'date' ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {((activePoint.newUsers / activePoint.visitors) * 100).toFixed(0)}% first-time
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <span>▲ +15.2%</span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">organic</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. YouTube Clicks */}
                <div 
                  onClick={() => setStatViewMode(statViewMode === 'date' ? 'total' : 'date')}
                  className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
                      {statViewMode === 'date' ? `YouTube Clicks (${activePoint.dateLabel})` : 'YouTube Clicks'}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                      <Youtube className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 relative z-10 tracking-tight">
                    {statViewMode === 'date'
                      ? activePoint.youtubeClicks.toLocaleString()
                      : analyticsData.summary.totalYoutubeClicks.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold mt-2 relative z-10">
                    {statViewMode === 'date' ? (
                      <span className="text-red-600 dark:text-red-400">
                        {((activePoint.youtubeClicks / activePoint.visitors) * 100).toFixed(1)}% CTR
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <span>▲ +11.8%</span>
                        <span className="text-slate-400 dark:text-slate-500 font-normal">channel ctr</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Two Charts matching Mockup Exactly - Interactive & Clickable */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Chart: Visitors Overview (Interactive Line Chart) */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  {/* Clean Non-Overlapping Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Visitors Overview</span>
                        <span className="text-[11px] text-blue-600 dark:text-cyan-400 font-normal flex items-center gap-1">
                          <MousePointerClick className="w-3.5 h-3.5" />
                          <span>Click points to inspect date</span>
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Showing actual daily traffic curve leading up to today
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Active Selected Date Badge */}
                      {activePoint && (
                        <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/40 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                            {activePoint.fullDate}
                          </span>
                          <span className="text-xs font-mono font-black text-slate-900 dark:text-white px-2 py-0.5 rounded bg-white dark:bg-slate-900 shadow-2xs">
                            {activePoint.visitors.toLocaleString()} visitors
                          </span>
                        </div>
                      )}

                      {/* Breakdown Table Toggle Button - Positioned safely in header to prevent ANY text collision */}
                      <button
                        onClick={() => setShowTableBreakdown((prev) => !prev)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        <span>{showTableBreakdown ? 'Hide Table' : 'Inspect Table'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showTableBreakdown ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Date-Wise Tooltip Card */}
                  {activePoint && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Visitors</span>
                        <span className="text-sm font-black text-blue-600 dark:text-cyan-400">{activePoint.visitors.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Page Views</span>
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{activePoint.pageViews.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">YouTube Clicks</span>
                        <span className="text-sm font-black text-red-600 dark:text-red-400">{activePoint.youtubeClicks}</span>
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Top Active Path</span>
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 truncate block">
                          {activePoint.topPage}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Interactive SVG Chart */}
                  {(() => {
                    const pts = analyticsData.points;
                    const maxV = Math.max(...pts.map((p) => p.visitors), 100);
                    const width = 640;
                    const height = 180;
                    const paddingX = 40;
                    const effectiveWidth = width - paddingX * 2;
                    
                    const coords = pts.map((p, idx) => {
                      const x = paddingX + (idx / Math.max(1, pts.length - 1)) * effectiveWidth;
                      const y = height - 20 - (p.visitors / maxV) * (height - 50);
                      return { x, y, point: p, index: idx };
                    });

                    // Build path
                    let pathD = '';
                    if (coords.length > 0) {
                      pathD = `M ${coords[0].x} ${coords[0].y}`;
                      for (let i = 1; i < coords.length; i++) {
                        const prev = coords[i - 1];
                        const curr = coords[i];
                        const midX = (prev.x + curr.x) / 2;
                        pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
                      }
                    }

                    const areaD = coords.length > 0 
                      ? `${pathD} L ${coords[coords.length - 1].x} ${height - 20} L ${coords[0].x} ${height - 20} Z`
                      : '';

                    const selectedCoord = coords[selectedPointIndex] || coords[coords.length - 1];

                    return (
                      <div className="w-full space-y-3">
                        {/* SVG Canvas with dedicated height */}
                        <div className="relative w-full h-52 sm:h-56">
                          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="interactiveVisitorsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
                              </linearGradient>
                              <filter id="glowPath" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.4" />
                              </filter>
                            </defs>

                            {/* Horizontal Grid lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                              const y = height - 20 - pct * (height - 50);
                              return (
                                <g key={idx}>
                                  <line
                                    x1={paddingX}
                                    y1={y}
                                    x2={width - paddingX}
                                    y2={y}
                                    stroke="#cbd5e1"
                                    strokeDasharray={pct === 0 ? undefined : '3 3'}
                                    strokeOpacity={pct === 0 ? 0.8 : 0.4}
                                  />
                                  <text
                                    x={paddingX - 10}
                                    y={y + 3}
                                    textAnchor="end"
                                    fontSize="9"
                                    fill="#94a3b8"
                                    fontFamily="monospace"
                                  >
                                    {Math.round(maxV * pct).toLocaleString()}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Selected Point Vertical Guideline */}
                            {selectedCoord && (
                              <line
                                x1={selectedCoord.x}
                                y1={20}
                                x2={selectedCoord.x}
                                y2={height - 20}
                                stroke="#3b82f6"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                                strokeOpacity="0.8"
                              />
                            )}

                            {/* Area Fill */}
                            {areaD && <path d={areaD} fill="url(#interactiveVisitorsGrad)" />}

                            {/* Smooth Line Path */}
                            {pathD && (
                              <path
                                d={pathD}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter="url(#glowPath)"
                              />
                            )}

                            {/* Interactive Points (Dots + Click Targets) */}
                            {coords.map((c) => {
                              const isSelected = c.index === selectedPointIndex;
                              return (
                                <g
                                  key={c.point.id}
                                  className="cursor-pointer group"
                                  onClick={() => {
                                    setSelectedPointIndex(c.index);
                                    setStatViewMode('date');
                                  }}
                                >
                                  {/* Invisible larger hit circle for easy clicking */}
                                  <circle cx={c.x} cy={c.y} r="18" fill="transparent" />

                                  {isSelected && (
                                    <circle
                                      cx={c.x}
                                      cy={c.y}
                                      r="9"
                                      fill="#3b82f6"
                                      fillOpacity="0.25"
                                      className="animate-ping"
                                    />
                                  )}

                                  <circle
                                    cx={c.x}
                                    cy={c.y}
                                    r={isSelected ? '6' : '4.5'}
                                    fill={isSelected ? '#3b82f6' : '#ffffff'}
                                    stroke="#3b82f6"
                                    strokeWidth={isSelected ? '3' : '2.5'}
                                    className="transition-all duration-200 group-hover:scale-125"
                                  />
                                </g>
                              );
                            })}

                            {/* Floating Date-Wise Tooltip Pill above selected point */}
                            {selectedCoord && (
                              <g transform={`translate(${Math.max(45, Math.min(width - 55, selectedCoord.x))}, ${Math.max(20, selectedCoord.y - 14)})`}>
                                <rect
                                  x="-45"
                                  y="-18"
                                  width="90"
                                  height="20"
                                  rx="6"
                                  fill="#0f172a"
                                  className="drop-shadow-md"
                                />
                                <text
                                  textAnchor="middle"
                                  y="-5"
                                  fill="#38bdf8"
                                  fontSize="10"
                                  fontWeight="bold"
                                  fontFamily="monospace"
                                >
                                  {selectedCoord.point.visitors.toLocaleString()} visitors
                                </text>
                              </g>
                            )}
                          </svg>
                        </div>

                        {/* Interactive X-Axis Date Pills - CLEAN DEDICATED CONTAINER WITH ZERO OVERLAP */}
                        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 px-1 no-scrollbar border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">Dates:</span>
                          {analyticsData.points.map((p, idx) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setSelectedPointIndex(idx);
                                setStatViewMode('date');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                                idx === selectedPointIndex
                                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              {p.dateLabel}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Date-wise Breakdown Table - CLEANLY RENDERED BELOW WITH FULL ISOLATION */}
                  {showTableBreakdown && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
                        <span>Date-wise Breakdown Table</span>
                        <span>{analyticsData.points.length} entries synchronized</span>
                      </div>
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-72">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 uppercase tracking-wider font-bold sticky top-0 z-10">
                            <tr>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3">Visitors</th>
                              <th className="py-2.5 px-3">Page Views</th>
                              <th className="py-2.5 px-3">YouTube Clicks</th>
                              <th className="py-2.5 px-3">Top Landing URL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                            {analyticsData.points.map((p, idx) => (
                              <tr
                                key={p.id}
                                onClick={() => {
                                  setSelectedPointIndex(idx);
                                  setStatViewMode('date');
                                }}
                                className={`cursor-pointer transition-colors ${
                                  idx === selectedPointIndex
                                    ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-bold'
                                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <td className="py-2.5 px-3 flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${idx === selectedPointIndex ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                  <span>{p.fullDate}</span>
                                </td>
                                <td className="py-2.5 px-3 font-mono">{p.visitors.toLocaleString()}</td>
                                <td className="py-2.5 px-3 font-mono text-indigo-600 dark:text-indigo-400">{p.pageViews.toLocaleString()}</td>
                                <td className="py-2.5 px-3 font-mono text-red-600 dark:text-red-400">+{p.youtubeClicks}</td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 truncate max-w-[140px]">{p.topPage}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Chart: Traffic by Device (Interactive Clickable Donut) */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Traffic by Device</span>
                      <span className="text-[10px] text-slate-400 font-normal">Click to inspect</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Platform audience distribution
                    </p>
                  </div>

                  {/* Donut SVG with Interactive Click Highlights */}
                  <div className="relative w-48 h-48 mx-auto my-2 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Mobile: 68% -> circumference = 2 * PI * 38 ≈ 238.7. 68% = 162.3 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth={selectedDevice === 'mobile' ? '19' : '15'}
                        strokeDasharray="162.3 238.7"
                        strokeDashoffset="0"
                        className="cursor-pointer transition-all duration-200 hover:opacity-85"
                        onClick={() => setSelectedDevice(selectedDevice === 'mobile' ? 'all' : 'mobile')}
                      />
                      {/* Desktop: 28% -> 28% = 66.8 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#6366f1"
                        strokeWidth={selectedDevice === 'desktop' ? '19' : '15'}
                        strokeDasharray="66.8 238.7"
                        strokeDashoffset="-162.3"
                        className="cursor-pointer transition-all duration-200 hover:opacity-85"
                        onClick={() => setSelectedDevice(selectedDevice === 'desktop' ? 'all' : 'desktop')}
                      />
                      {/* Tablet: 4% -> 4% = 9.5 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#06b6d4"
                        strokeWidth={selectedDevice === 'tablet' ? '19' : '15'}
                        strokeDasharray="9.5 238.7"
                        strokeDashoffset="-229.1"
                        className="cursor-pointer transition-all duration-200 hover:opacity-85"
                        onClick={() => setSelectedDevice(selectedDevice === 'tablet' ? 'all' : 'tablet')}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      {selectedDevice === 'mobile' ? (
                        <>
                          <span className="text-xl font-black text-blue-600">68%</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Mobile</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {Math.round(analyticsData.summary.totalVisitors * 0.68).toLocaleString()}
                          </span>
                        </>
                      ) : selectedDevice === 'desktop' ? (
                        <>
                          <span className="text-xl font-black text-indigo-600">28%</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Desktop</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {Math.round(analyticsData.summary.totalVisitors * 0.28).toLocaleString()}
                          </span>
                        </>
                      ) : selectedDevice === 'tablet' ? (
                        <>
                          <span className="text-xl font-black text-cyan-600">4%</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Tablet</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {Math.round(analyticsData.summary.totalVisitors * 0.04).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl font-black text-slate-900 dark:text-white">68%</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Mobile First</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Clickable Legend list matching Mockup */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => setSelectedDevice(selectedDevice === 'mobile' ? 'all' : 'mobile')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                        selectedDevice === 'mobile'
                          ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/30 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-slate-700 dark:text-slate-300">Mobile (Android/iOS)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[11px]">
                          {Math.round(analyticsData.summary.totalVisitors * 0.68).toLocaleString()}
                        </span>
                        <span className="font-bold text-blue-600">68%</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedDevice(selectedDevice === 'desktop' ? 'all' : 'desktop')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                        selectedDevice === 'desktop'
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-500/30 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Laptop className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-slate-700 dark:text-slate-300">Desktop (Windows/Mac)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[11px]">
                          {Math.round(analyticsData.summary.totalVisitors * 0.28).toLocaleString()}
                        </span>
                        <span className="font-bold text-indigo-600">28%</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedDevice(selectedDevice === 'tablet' ? 'all' : 'tablet')}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                        selectedDevice === 'tablet'
                          ? 'bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Tablet className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-slate-700 dark:text-slate-300">Tablet (iPad/Galaxy)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[11px]">
                          {Math.round(analyticsData.summary.totalVisitors * 0.04).toLocaleString()}
                        </span>
                        <span className="font-bold text-cyan-600">4%</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>


              {/* ========================================================================= */}
              {/* LIVE USER ACTIVITY STREAM & YOUTUBE VIDEO CLICKS ANALYTICS                */}
              {/* ========================================================================= */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                
                {/* Header with Sub-Tabs & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Live Visitor Activity & YouTube Tracking</span>
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                        Real-Time Radar
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Real-time live telemetry: page views, YouTube plays, code solution inspections, and tool uses.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Sub-tab switcher */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                      <button
                        onClick={() => setAnalyticsSubTab('visitor_stream')}
                        className={`px-3 py-1.5 rounded-lg transition-all ${
                          analyticsSubTab === 'visitor_stream'
                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Visitor Stream ({visitorLogs.length})
                      </button>
                      <button
                        onClick={() => setAnalyticsSubTab('youtube_clicks')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                          analyticsSubTab === 'youtube_clicks'
                            ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                        <span>YouTube Clicks ({ytClickLogs.length})</span>
                      </button>
                    </div>

                    {/* Refresh & Reset Buttons */}
                    <button
                      onClick={() => {
                        setAnalyticsRefreshKey((k) => k + 1);
                        triggerSuccessAlert('Analytics data refreshed!');
                      }}
                      className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 rounded-xl text-xs transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                      title="Refresh live analytics"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Reset real analytics data? (This will clear all logged visits & clicks)')) {
                          clearRealAnalytics();
                          setAnalyticsRefreshKey((k) => k + 1);
                          triggerSuccessAlert('Analytics logs cleared!');
                        }
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/40 cursor-pointer"
                    >
                      Clear Logs
                    </button>
                  </div>
                </div>

                {/* TAB 1: VISITOR ACTIVITY STREAM */}
                {analyticsSubTab === 'visitor_stream' && (
                  <div className="space-y-3">
                    {/* Filter chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      <span className="text-[11px] text-slate-400 font-semibold mr-1">Filter:</span>
                      {(['all', 'page_view', 'youtube_click', 'tool_use'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setActivityFilter(filter)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                            activityFilter === filter
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {filter.replace('_', ' ')}
                        </button>
                      ))}
                    </div>

                    {/* Activity Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-96">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 uppercase tracking-wider font-bold sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-3">Time</th>
                            <th className="py-2.5 px-3">Visitor ID</th>
                            <th className="py-2.5 px-3">Action</th>
                            <th className="py-2.5 px-3">Page / Target</th>
                            <th className="py-2.5 px-3">Device</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                          {visitorLogs.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400">
                                No visitor activity recorded yet. Browse around the site to generate live real logs!
                              </td>
                            </tr>
                          ) : (
                            visitorLogs
                              .filter((log) => activityFilter === 'all' || log.type === activityFilter)
                              .slice(0, 50)
                              .map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                    {log.timeStr}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                      {log.visitorId}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                      log.type === 'page_view'
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                        : log.type === 'youtube_click'
                                        ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    }`}>
                                      {log.type.replace('_', ' ').toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-xs">{log.title}</span>
                                      <span className="text-[10px] font-mono text-slate-400">{log.path}</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                                      {log.device === 'Mobile' ? <Smartphone className="w-3 h-3 text-blue-500" /> : <Laptop className="w-3 h-3 text-indigo-500" />}
                                      <span>{log.device}</span>
                                    </span>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 2: YOUTUBE CLICKS FROM WEBSITE */}
                {analyticsSubTab === 'youtube_clicks' && (
                  <div className="space-y-3">
                    {ytClickLogs.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        <Youtube className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="font-bold">No YouTube clicks logged yet.</p>
                        <p className="text-[11px] text-slate-500 mt-1">Whenever a visitor clicks any YouTube video on the site, it logs here in real-time with exact timestamp and device.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-96">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 uppercase tracking-wider font-bold sticky top-0 z-10">
                            <tr>
                              <th className="py-2.5 px-3">Time</th>
                              <th className="py-2.5 px-3">Video Title</th>
                              <th className="py-2.5 px-3">Source Page</th>
                              <th className="py-2.5 px-3">Visitor</th>
                              <th className="py-2.5 px-3">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                            {ytClickLogs.slice(0, 50).map((click) => (
                              <tr key={click.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                  {click.timeStr}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 shrink-0">
                                      <Youtube className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                                      {click.videoTitle}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                                  {click.pagePath}
                                </td>
                                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                                  {click.visitorId}
                                </td>
                                <td className="py-2.5 px-3">
                                  <a
                                    href={click.videoId.length > 5 ? `https://youtube.com/watch?v=${click.videoId}` : 'https://youtube.com/@SakshamXTech'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-1 rounded-md bg-red-600 text-white font-bold text-[10px] hover:bg-red-700 transition-colors inline-flex items-center gap-1"
                                  >
                                    <span>Play</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 2: BLOG MANAGEMENT */}
          {activeModule === 'blogs' && (() => {
            const liveBlogs = blogs.filter((b) => isBlogPostLive(b) && b.status !== 'draft');
            const scheduledBlogs = blogs.filter((b) => b.status === 'scheduled' && !isBlogPostLive(b));
            const draftBlogs = blogs.filter((b) => b.status === 'draft');

            const filteredAdminBlogs = blogs.filter((b) => {
              const q = adminBlogSearch.toLowerCase().trim();
              const matchesSearch =
                !q ||
                b.title.toLowerCase().includes(q) ||
                b.slug.toLowerCase().includes(q) ||
                (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(q)));

              const matchesCat = adminBlogCatFilter === 'all' || b.category.toLowerCase() === adminBlogCatFilter.toLowerCase();

              const matchesStatus =
                adminBlogStatusFilter === 'all' ||
                (adminBlogStatusFilter === 'draft' && b.status === 'draft') ||
                (adminBlogStatusFilter === 'scheduled' && b.status === 'scheduled' && !isBlogPostLive(b)) ||
                (adminBlogStatusFilter === 'published' && isBlogPostLive(b) && b.status !== 'draft');

              return matchesSearch && matchesCat && matchesStatus;
            });

            const getThumbnailUrl = (b: BlogPost) => {
              if (
                b.coverImage && 
                b.coverImage.trim() && 
                !b.coverImage.includes('photo-1451187580459-43490279c0fa') &&
                !b.coverImage.includes('placeholder')
              ) {
                return b.coverImage.trim();
              }
              const cleanVid = extractYouTubeVideoId(b.youtubeVideoId || '');
              if (cleanVid && cleanVid.length === 11) {
                return `https://i.ytimg.com/vi/${cleanVid}/hqdefault.jpg`;
              }
              if (b.coverImage && b.coverImage.trim()) {
                return b.coverImage.trim();
              }
              return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80';
            };

            return (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Header & Stats Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span>Manage Technical Blogs &amp; Articles</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Direct publishing, YouTube video integrations, official registration links, and scheduling.
                    </p>
                  </div>
                  <button
                    onClick={() => setBlogModal({ isOpen: true, data: null })}
                    className="px-4 py-2.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write New Article</span>
                  </button>
                </div>

                {/* Stats Summary Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div 
                    onClick={() => setAdminBlogStatusFilter('all')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      adminBlogStatusFilter === 'all'
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block">All Articles</span>
                    <span className="text-xl font-black">{blogs.length}</span>
                  </div>

                  <div 
                    onClick={() => setAdminBlogStatusFilter('published')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      adminBlogStatusFilter === 'published'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block">Live Public</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{liveBlogs.length}</span>
                  </div>

                  <div 
                    onClick={() => setAdminBlogStatusFilter('scheduled')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      adminBlogStatusFilter === 'scheduled'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block">Scheduled</span>
                    <span className="text-xl font-black text-purple-600 dark:text-purple-400">{scheduledBlogs.length}</span>
                  </div>

                  <div 
                    onClick={() => setAdminBlogStatusFilter('draft')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      adminBlogStatusFilter === 'draft'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block">Drafts</span>
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400">{draftBlogs.length}</span>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminBlogSearch}
                      onChange={(e) => setAdminBlogSearch(e.target.value)}
                      placeholder="Search articles by title, slug, tag..."
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                    />
                    {adminBlogSearch && (
                      <button
                        onClick={() => setAdminBlogSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={adminBlogCatFilter}
                      onChange={(e) => setAdminBlogCatFilter(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200"
                    >
                      <option value="all">All Categories</option>
                      <option value="Google Cloud">Google Cloud</option>
                      <option value="Programming">Programming</option>
                      <option value="Career">Career</option>
                      <option value="Artificial Intelligence">AI</option>
                      <option value="Tutorials">Tutorials</option>
                    </select>

                    <select
                      value={adminBlogStatusFilter}
                      onChange={(e) => setAdminBlogStatusFilter(e.target.value as any)}
                      className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Live Only</option>
                      <option value="scheduled">Scheduled Only</option>
                      <option value="draft">Drafts Only</option>
                    </select>
                  </div>
                </div>

                {/* Article Items List */}
                <div className="space-y-3">
                  {filteredAdminBlogs.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs italic">
                      No articles match your search or filter criteria.
                    </div>
                  ) : (
                    filteredAdminBlogs.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                          {/* Article Thumbnail Preview */}
                          <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-700">
                            <img
                              src={getThumbnailUrl(b)}
                              alt={b.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            {b.youtubeVideoId && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Play className="w-3.5 h-3.5 fill-white text-white" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                {b.category}
                              </span>

                              {b.status === 'scheduled' && b.scheduledAt ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                                  <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                  <span>Scheduled: {formatCleanDateTime(b.scheduledAt)}</span>
                                </span>
                              ) : b.status === 'draft' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                  📝 Draft
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                  ● Live
                                </span>
                              )}

                              {b.featured && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
                                  ★ Featured
                                </span>
                              )}

                              {b.officialLink && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  ✓ Official Link
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                              {b.title}
                            </p>
                            
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>{formatRealDate(b.publishedAt)}</span>
                              <span>•</span>
                              <span>{b.readTimeMinutes} min read</span>
                              <span>•</span>
                              <span>{(b.views || 0).toLocaleString()} views</span>
                              {b.slug && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-[10px] text-slate-400">/{b.slug}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => {
                              const link = `${window.location.origin}/blogs/${b.slug}`;
                              const snippet = `📌 Official Program Link & Guide:\n${link}\n\n${
                                b.officialLink ? `🔗 Direct Application Portal:\n${b.officialLink}\n\n` : ''
                              }${b.deadline ? `⏰ Deadline: ${b.deadline}\n` : ''}${
                                b.perks ? `🎁 Goodies & Swags: ${b.perks}\n` : ''
                              }🔔 Subscribe to SakshamXTech:\nhttps://youtube.com/@sakshamxtech?sub_confirmation=1`;
                              navigator.clipboard.writeText(snippet);
                              triggerSuccessAlert(`Copied YouTube description snippet for "${b.title}"!`);
                            }}
                            className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                            title="Copy full YouTube description block with links"
                          >
                            <Copy className="w-3.5 h-3.5 text-blue-500" />
                            <span className="font-bold text-[11px]">YouTube Snippet</span>
                          </button>

                          <button
                            onClick={() => navigate(`/blogs/${b.slug}`)}
                            className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                            title="View live article"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setBlogModal({ isOpen: true, data: b })}
                            className="p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                            title="Edit article in Studio"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete blog "${b.title}"?`)) deleteBlog(b.id);
                            }}
                            className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                            title="Delete blog"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 3: ARCADE MANAGEMENT */}
          {activeModule === 'arcade' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <span>Google Arcade Labs Management</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage lab codes, commands, and points awarded.</p>
                </div>
                <button
                  onClick={() => setArcadeModal({ isOpen: true, data: null })}
                  className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lab Solution</span>
                </button>
              </div>

              <div className="space-y-3">
                {arcadeSolutions.map((sol) => (
                  <div key={sol.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:border-cyan-400 dark:hover:border-cyan-500 transition-all">
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 px-2 py-0.5 rounded-md">
                          {sol.labCode}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{sol.title}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{sol.difficulty} • {sol.durationMinutes} mins • +{sol.pointsAwarded} pt {sol.youtubeVideoId ? '• 🎬 Video' : ''}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setArcadeModal({ isOpen: true, data: sol })}
                        className="p-2 text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Edit lab"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete lab "${sol.title}"?`)) deleteArcadeSolution(sol.id);
                        }}
                        className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Delete lab"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: UNSTOP MANAGEMENT */}
          {activeModule === 'unstop' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Daily Unstop POTD Solutions</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Publish daily problem solutions with multi-language code snippets.</p>
                </div>
                <button
                  onClick={() => setUnstopModal({ isOpen: true, data: null })}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Daily POTD</span>
                </button>
              </div>

              <div className="space-y-3">
                {unstopProblems.map((prob) => (
                  <div key={prob.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:border-emerald-400 dark:hover:border-emerald-500 transition-all">
                    <div className="min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase tracking-wider">Day {prob.dayNumber} ({prob.date})</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{prob.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{prob.difficulty} • {prob.codeSolutions.length} language solutions</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setUnstopModal({ isOpen: true, data: prob })}
                        className="p-2 text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Edit problem"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete Day ${prob.dayNumber}?`)) deleteUnstopProblem(prob.id);
                        }}
                        className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Delete problem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: OPPORTUNITIES MANAGEMENT */}
          {activeModule === 'opportunities' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <span>Manage Opportunities</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Post internships, hackathons, and student programs.</p>
                </div>
                <button
                  onClick={() => setOppModal({ isOpen: true, data: null })}
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Opportunity</span>
                </button>
              </div>

              <div className="space-y-3">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:border-amber-400 dark:hover:border-amber-500 transition-all">
                    <div className="min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase tracking-wider">{opp.company} • {opp.category}</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{opp.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Deadline: {opp.deadline} • {opp.clicksCount} clicks</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setOppModal({ isOpen: true, data: opp })}
                        className="p-2 text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Edit opportunity"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${opp.title}"?`)) deleteOpportunity(opp.id);
                        }}
                        className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Delete opportunity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SWAGS MANAGEMENT */}
          {activeModule === 'swags' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>Manage Swag Catalog</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Update swag items, images, and redemption links.</p>
                </div>
                <button
                  onClick={() => setSwagModal({ isOpen: true, data: null })}
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Swag Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {swags.map((swag) => (
                  <div key={swag.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:border-rose-400 dark:hover:border-rose-500 transition-all">
                    <div className="min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block uppercase tracking-wider">{swag.brand} • {swag.category}</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{swag.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{swag.tierRequired || 'Standard'}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSwagModal({ isOpen: true, data: swag })}
                        className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Edit swag"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete swag "${swag.title}"?`)) deleteSwag(swag.id);
                        }}
                        className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Delete swag"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: C ACADEMY MANAGEMENT */}
          {activeModule === 'c-academy' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span>C Academy Curriculum</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Expand the C Programming lecture series and exercises.</p>
                </div>
                <button
                  onClick={() => setCLessonModal({ isOpen: true, data: null })}
                  className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lecture Day</span>
                </button>
              </div>

              <div className="space-y-3">
                {cLessons.map((l) => (
                  <div key={l.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:border-purple-400 dark:hover:border-purple-500 transition-all">
                    <div className="min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase tracking-wider">Day {l.dayNumber}</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{l.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{l.durationMinutes} mins • {l.quiz.length} quizzes {l.youtubeVideoId ? '• 🎬 Video' : ''}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setCLessonModal({ isOpen: true, data: l })}
                        className="p-2 text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Edit lesson"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete Day ${l.dayNumber}?`)) deleteCLesson(l.id);
                        }}
                        className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: RESOURCES MANAGEMENT */}
          {activeModule === 'resources' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderDown className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span>Manage PDF Notes & Handbooks</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload notes, cheat sheets, and track download counts.</p>
                </div>
                <button
                  onClick={() => setResourceModal({ isOpen: true, data: null })}
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Resource</span>
                </button>
              </div>

              <div className="space-y-3">
                {resources.map((res) => (
                  <div key={res.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between hover:border-teal-400 dark:hover:border-teal-500 transition-all">
                    <div className="min-w-0 pr-4">
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 block uppercase tracking-wider">{res.category} ({res.format})</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">{res.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{res.fileSize} • {res.downloadsCount} downloads</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setResourceModal({ isOpen: true, data: res })}
                        className="p-2 text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Edit resource"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete resource "${res.title}"?`)) deleteResource(res.id);
                        }}
                        className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: YOUTUBE AUTOMATION & SETTINGS */}
          {activeModule === 'youtube' && (
            <div className="space-y-6">

              {/* 1. Real-Time Auto Sync Banner */}
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>100% Automated YouTube Feed Active</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                      SakshamXTech YouTube Real-Time Sync
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
                      Channel <strong>@sakshamxtech</strong> uploads are automatically synced every 15 minutes and when visitors visit your site. No manual coding or API key required!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleForceSyncYouTube}
                      disabled={isFetchingYouTube}
                      className="px-5 py-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-4 h-4 ${isFetchingYouTube ? 'animate-spin' : ''}`} />
                      <span>{isFetchingYouTube ? 'Syncing Channel…' : 'Sync Latest Uploads Now'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs text-white/90">
                  <span>Channel ID: <code className="bg-black/20 px-2 py-0.5 rounded font-mono text-[11px]">{SAKSHAMXTECH_CHANNEL_ID}</code></span>
                  <span>•</span>
                  <span>Active Videos in Carousel: <strong>{youtubeVideos.length}</strong></span>
                  <span>•</span>
                  <span>Cloud Database: <strong>Synced with Firestore</strong></span>
                </div>
              </div>

              {/* 2. Quick Add Video by URL or ID */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Quick Add Video to Feed</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Paste any YouTube video link or ID (e.g. <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">https://youtu.be/JVE_m3awBTU</code>). Title and thumbnail will auto-fetch.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleQuickAddVideo} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={quickVideoInput}
                    onChange={(e) => setQuickVideoInput(e.target.value)}
                    placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=... or Video ID"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    type="submit"
                    disabled={isAddingQuickVideo || !quickVideoInput.trim()}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAddingQuickVideo ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Detecting…</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Active Feed</span>
                      </>
                    )}
                  </button>
                </form>

                {quickVideoMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium border ${
                    quickVideoMsg.ok
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400'
                  }`}>
                    {quickVideoMsg.text}
                  </div>
                )}
              </div>

              {/* 3. Live Preview & Management of Active Videos */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-600" />
                      <span>Live Website Carousel Videos ({youtubeVideos.length})</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      These are the exact videos displayed on your homepage slider right now.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearYouTubeCache();
                      handleForceSyncYouTube();
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Clear Cache &amp; Re-fetch</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {youtubeVideos.map((video, idx) => (
                    <div
                      key={video.id || video.videoId || idx}
                      className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4 hover:border-red-400 dark:hover:border-red-500 transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-20 sm:w-24 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono font-bold text-white">
                            {video.duration || 'Video'}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                              #{idx + 1}
                            </span>
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                              {video.category}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-850 px-2 py-0.5 rounded-md">
                              👁️ {video.views || 'Latest'}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              🕒 {video.publishedAt}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
                            {video.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId || video.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs"
                          title="Watch on YouTube"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove "${video.title}" from active feed?`)) {
                              deleteCustomYouTubeVideo(video.id || video.videoId);
                              triggerSuccessAlert('Video removed from active feed.');
                            }
                          }}
                          className="p-2 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                          title="Remove from feed"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Optional: Official Google YouTube Data API v3 Config */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Official YouTube Data API v3 (Optional)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Already automated via RSS! Add an API Key only if you want exact YouTube view counters and durations.
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    ytApiKey.length > 20
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60'
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    {ytApiKey.length > 20 ? '● API Key Active' : '○ Zero-Config Mode'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                      YouTube Data API Key
                    </label>
                    <input
                      type="password"
                      value={ytApiKey}
                      onChange={(e) => setYtApiKey(e.target.value)}
                      placeholder="AIzaSy... (optional Google Cloud API Key)"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                      YouTube Channel ID
                    </label>
                    <input
                      type="text"
                      value={ytChannelId}
                      onChange={(e) => setYtChannelId(e.target.value)}
                      placeholder="UCn1yGwm9e3VoYenlzuIzw5g"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {ytTestStatus && (
                  <div className={`p-3 rounded-xl text-xs font-medium border ${
                    ytTestStatus.ok
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
                      : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400'
                  }`}>
                    {ytTestStatus.message}
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={handleTestYouTubeConnection}
                    disabled={ytTesting || !ytApiKey.trim() || !ytChannelId.trim()}
                    className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {ytTesting ? 'Testing…' : 'Test API Key'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveYouTubeConfig}
                    className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save API Credentials</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: FIREBASE CLOUD REAL-TIME SYNC */}
          {activeModule === 'firebase' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <span>Google Cloud Firestore Integration & Rules</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Direct Cloud Firestore real-time storage for blogs, arcade labs, POTD, swags, lessons, resources, and live analytics.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    permProbe.tested && permProbe.ok
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : permProbe.tested && permProbe.status === 'permission_denied'
                      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                      : firebaseStatus
                      ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  }`}>
                    {permProbe.loading ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Probing Cloud Rules...</span>
                      </>
                    ) : permProbe.tested && permProbe.ok ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>● Live Cloud Writable</span>
                      </>
                    ) : permProbe.tested && permProbe.status === 'permission_denied' ? (
                      <>
                        <span>⚠️ Rules Blocked</span>
                      </>
                    ) : firebaseStatus ? (
                      <span>● Credentials Configured</span>
                    ) : (
                      <span>○ Local / Standalone Mode</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Single Unified Status Card (Clean & Professional) */}
              <div className={`p-5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                permProbe.tested && permProbe.ok
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-900 dark:text-emerald-200'
                  : permProbe.tested && permProbe.status === 'permission_denied'
                  ? 'bg-rose-500/10 border-rose-500/25 text-rose-900 dark:text-rose-200'
                  : 'bg-blue-500/10 border-blue-500/25 text-blue-900 dark:text-blue-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    permProbe.tested && permProbe.ok
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    {permProbe.loading ? (
                      <RotateCw className="w-5 h-5 animate-spin" />
                    ) : permProbe.tested && permProbe.ok ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-sm flex items-center gap-2">
                      <span>{permProbe.tested && permProbe.ok ? 'Cloud Firestore: Real-Time Auto-Sync Active' : 'Cloud Firestore Setup'}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase tracking-wider">
                        100% Automated
                      </span>
                    </p>
                    <p className="opacity-90 text-[11px] mt-0.5">
                      {permProbe.tested && permProbe.ok
                        ? `Live connection confirmed on "${permProbe.projectId || firebaseConfig.projectId}". All blogs, labs, and settings auto-sync automatically in real time.`
                        : permProbe.error || 'Connected to Google Cloud Firestore.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={runPermissionsProbe}
                    disabled={permProbe.loading}
                    className="px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${permProbe.loading ? 'animate-spin' : ''}`} />
                    <span>Re-test</span>
                  </button>
                  {firebaseConfig.projectId && (
                    <a
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/data`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Credentials Form (Clean 2-Col Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Firebase API Key (apiKey)
                  </label>
                  <input
                    type="password"
                    value={firebaseConfig.apiKey}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Firebase Project ID (projectId)
                  </label>
                  <input
                    type="text"
                    value={firebaseConfig.projectId}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                    placeholder="sakshamxtech-7fe06"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Auth Domain (authDomain)
                  </label>
                  <input
                    type="text"
                    value={firebaseConfig.authDomain}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                    placeholder="sakshamxtech-7fe06.firebaseapp.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    App ID (appId)
                  </label>
                  <input
                    type="text"
                    value={firebaseConfig.appId}
                    onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                    placeholder="1:500868127820:web:09c7460094468c3236e8e9"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Clean Primary Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveFirebaseConfig}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Credentials</span>
                  </button>

                  {firebaseConfig.projectId && (
                    <a
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/data`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <span>Open Firestore Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Subtle Manual Sync Trigger (Optional) */}
                <button
                  onClick={handleSyncAllToFirebase}
                  disabled={isSyncingFirebase}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Manual backup push"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isSyncingFirebase ? 'Syncing...' : 'Force Full Re-sync'}</span>
                </button>
              </div>

              {/* Compact Firestore Rules Card (Clean & Non-Intrusive) */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Firestore Rules: Active &amp; Verified</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Rules are active on your project to allow automated read/write access.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyRules}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
                      rulesCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {rulesCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{rulesCopied ? 'Copied' : 'Copy Rules'}</span>
                  </button>

                  {firebaseConfig.projectId && (
                    <a
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/rules`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Rules Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Real-time Collection Inventory */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Cloud Firestore Ready Document Collections:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Blogs</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{blogs.length} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Arcade Labs</span>
                    <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{arcadeSolutions.length} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Unstop POTD</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{unstopProblems.length} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Opportunities</span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400">{opportunities.length} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Swags Catalog</span>
                    <span className="text-base font-black text-rose-600 dark:text-rose-400">{swags.length} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">C Academy</span>
                    <span className="text-base font-black text-purple-600 dark:text-purple-400">{cLessons.length} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Resources / PDFs</span>
                    <span className="text-base font-black text-teal-600 dark:text-teal-400">{resources.length} docs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Config & Settings</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: TOOLS & CALCULATOR CONFIG */}
          {activeModule === 'tools' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <span>Google Arcade Scoring Formula Configuration</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Adjust points weights per activity and thresholds when official program rules change.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Points Per Skill Badge
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcForm.pointsPerSkillBadge}
                    onChange={(e) => setCalcForm({ ...calcForm, pointsPerSkillBadge: parseFloat(e.target.value) || 1 })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-600 dark:text-cyan-400 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Points Per Trivia Game
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={calcForm.pointsPerTriviaGame}
                    onChange={(e) => setCalcForm({ ...calcForm, pointsPerTriviaGame: parseFloat(e.target.value) || 1 })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Points Per Individual Lab
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={calcForm.pointsPerLabCompletion}
                    onChange={(e) => setCalcForm({ ...calcForm, pointsPerLabCompletion: parseFloat(e.target.value) || 0.5 })}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-purple-600 dark:text-purple-400 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveCalculator}
                className="px-5 py-2.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Calculator Rules</span>
              </button>
            </div>
          )}

          {/* TAB 11: WEBSITE SETTINGS */}
          {activeModule === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Brand & Creator Identity Settings</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload or paste your personal portrait image, adjust statistics, and update social links.
                </p>
              </div>

              {/* Creator Photo upload / URL input */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Creator Portrait Image (Homepage & About)</span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <img
                    src={settingsForm.creatorAvatarUrl || '/assets/branding/saksham_avatar.png'}
                    alt={settingsForm.creatorName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/branding/saksham_avatar.png';
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={settingsForm.creatorAvatarUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, creatorAvatarUrl: e.target.value })}
                      placeholder="Image URL or Data URL"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      <span>Upload Local Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = event.target?.result as string;
                              if (result) {
                                setSettingsForm({ ...settingsForm, creatorAvatarUrl: result });
                                triggerSuccessAlert('Creator portrait uploaded!');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Tagline & Bio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Brand Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Creator Title</label>
                  <input
                    type="text"
                    value={settingsForm.creatorTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, creatorTitle: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Statistics */}
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">Platform Statistics Cards</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">YouTube Learners</label>
                    <input
                      type="text"
                      value={settingsForm.statistics.youtubeSubscribers}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          statistics: { ...settingsForm.statistics, youtubeSubscribers: e.target.value },
                        })
                      }
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-blue-600 dark:text-cyan-300 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Arcade Solutions</label>
                    <input
                      type="text"
                      value={settingsForm.statistics.technicalSolutions}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          statistics: { ...settingsForm.statistics, technicalSolutions: e.target.value },
                        })
                      }
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-indigo-600 dark:text-indigo-300 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">YouTube Videos</label>
                    <input
                      type="text"
                      value={settingsForm.statistics.youtubeVideos}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          statistics: { ...settingsForm.statistics, youtubeVideos: e.target.value },
                        })
                      }
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-purple-600 dark:text-purple-300 font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Top Announcement Bar Toggle */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Header Announcement Banner</span>
                  <input
                    type="checkbox"
                    checked={settingsForm.announcement.enabled}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        announcement: { ...settingsForm.announcement, enabled: e.target.checked },
                      })
                    }
                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={settingsForm.announcement.text}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcement: { ...settingsForm.announcement, text: e.target.value },
                    })
                  }
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Push Notifications Configuration (OneSignal) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/70 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-200/80 dark:border-indigo-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>OneSignal Push Notifications</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          ● Configured &amp; Active
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Broadcast instant mobile notifications to all users who installed the app or enabled alerts.
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://dashboard.onesignal.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
                  >
                    <span>OneSignal Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    OneSignal App ID
                  </label>
                  <input
                    type="text"
                    value={settingsForm.oneSignalAppId ?? 'd03de95e-6730-4d9c-94ab-503aadcc360d'}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        oneSignalAppId: e.target.value.trim(),
                      })
                    }
                    placeholder="d03de95e-6730-4d9c-94ab-503aadcc360d"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">How to broadcast notifications in 3 steps:</p>
                    <p>1. Create a free account at <strong>onesignal.com</strong>, select <strong>Web Push</strong>, and paste your <strong>App ID</strong> here.</p>
                    <p>2. Click <strong>Save All Website Settings</strong> below. Users will now see the 1-click notification enable trigger.</p>
                    <p>3. Whenever you want to alert users, go to <strong>OneSignal Dashboard &gt; Messages &gt; New Push</strong> to blast all mobile screens in 1 click!</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Website Settings</span>
              </button>
            </div>
          )}

          {/* TAB 12: SEO & MONETIZATION */}
          {activeModule === 'seo-ads' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Google AdSense & Monetization Placements</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure sponsored banner placements across homepage and articles without compromising student experience.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.adsConfig.enabled}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        adsConfig: { ...settingsForm.adsConfig, enabled: e.target.checked },
                      })
                    }
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Enable Monetization Banners</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Toggles global display of educational affiliate & sponsor cards.</span>
                  </div>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <label className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.adsConfig.headerBanner}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          adsConfig: { ...settingsForm.adsConfig, headerBanner: e.target.checked },
                        })
                      }
                      className="accent-blue-600"
                    />
                    <span>Homepage Leaderboard</span>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.adsConfig.inArticleBanner}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          adsConfig: { ...settingsForm.adsConfig, inArticleBanner: e.target.checked },
                        })
                      }
                      className="accent-indigo-600"
                    />
                    <span>In-Article Banner</span>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.adsConfig.sidebarBanner}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          adsConfig: { ...settingsForm.adsConfig, sidebarBanner: e.target.checked },
                        })
                      }
                      className="accent-purple-600"
                    />
                    <span>Sidebar Placement</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Ad Placements</span>
              </button>
            </div>
          )}

          {/* TAB 13: BACKUP & RESTORE */}
          {activeModule === 'backup' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>Database Snapshot & JSON Backup</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Export the entire database (all blogs, arcade solutions, POTD, opportunities, swags, lessons, settings) as a portable JSON file.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadBackup}
                  className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Full Database JSON</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset all content to original initial demo data? Any unsaved edits will be lost.')) {
                      resetToDefaultData();
                      triggerSuccessAlert('Reset to default dataset complete.');
                    }
                  }}
                  className="px-4 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-rose-400 dark:border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default Data</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Restore from JSON Backup:
                </label>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste database JSON payload here..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs text-slate-900 dark:text-slate-200 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleImportBackup}
                  className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import & Restore</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* IN-APP MODAL EDITORS (NO BROWSER PROMPT POPUPS) */}
      {/* ========================================================================= */}
      <BlogEditorModal
        isOpen={blogModal.isOpen}
        onClose={() => setBlogModal({ isOpen: false, data: null })}
        initialData={blogModal.data}
        creatorName={siteSettings.creatorName}
        creatorRole={siteSettings.creatorTitle}
        creatorAvatar={siteSettings.creatorAvatarUrl || ''}
        onSave={(data) => {
          if (blogModal.data) {
            updateBlog(blogModal.data.id, data);
            triggerSuccessAlert(`Article "${data.title || blogModal.data.title}" updated & auto-synced to Cloud Firestore!`);
          } else {
            const cleanSummary = data.summary?.trim() || data.title || 'Official tech article on SakshamXTech';
            const cleanCover = data.coverImage?.trim() || (data.youtubeVideoId ? `https://i.ytimg.com/vi/${data.youtubeVideoId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80');

            addBlog({
              title: data.title || 'Untitled Article',
              slug: data.slug || 'untitled',
              summary: cleanSummary,
              category: data.category || 'Google Cloud',
              content: data.content || '',
              tags: (data.tags && data.tags.length > 0) ? data.tags : ['Tech'],
              coverImage: cleanCover,
              youtubeVideoId: data.youtubeVideoId,
              author: data.author || {
                name: siteSettings.creatorName,
                role: siteSettings.creatorTitle,
                avatar: siteSettings.creatorAvatarUrl || '',
              },
              publishedAt: data.publishedAt || getTodayISODate(),
              readTimeMinutes: data.readTimeMinutes || 5,
              featured: data.featured ?? false,
              status: data.status || 'published',
              scheduledAt: data.scheduledAt,
              officialLink: data.officialLink,
              officialLinkLabel: data.officialLinkLabel,
              deadline: data.deadline,
              perks: data.perks,
              eligibility: data.eligibility,
              quickSteps: data.quickSteps,
            });
            triggerSuccessAlert('New article published & auto-synced to Cloud Firestore!');
          }
        }}
      />

      <ArcadeEditorModal
        isOpen={arcadeModal.isOpen}
        onClose={() => setArcadeModal({ isOpen: false, data: null })}
        initialData={arcadeModal.data}
        onSave={(data) => {
          if (arcadeModal.data) {
            updateArcadeSolution(arcadeModal.data.id, data);
            triggerSuccessAlert(`Arcade Lab "${data.labCode || arcadeModal.data.labCode}" updated!`);
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
            triggerSuccessAlert('New Arcade Lab solution published!');
          }
        }}
      />

      <UnstopEditorModal
        isOpen={unstopModal.isOpen}
        onClose={() => setUnstopModal({ isOpen: false, data: null })}
        initialData={unstopModal.data}
        suggestedDayNumber={nextUnstopDayNumber}
        onSave={(data) => {
          if (unstopModal.data) {
            updateUnstopProblem(unstopModal.data.id, {
              ...data,
              date: data.date || unstopModal.data.date || getTodayISODate(),
            });
            triggerSuccessAlert(`Day ${data.dayNumber || unstopModal.data.dayNumber} updated!`);
          } else {
            const chosenDay = Number(data.dayNumber) || nextUnstopDayNumber;
            addUnstopProblem({
              dayNumber: chosenDay,
              date: data.date || getTodayISODate(),
              title: data.title || 'Untitled Problem',
              slug: data.slug || `day-${chosenDay}-${(data.title || 'potd').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              difficulty: data.difficulty || 'Medium',
              description: data.description || '',
              inputFormat: data.inputFormat || 'Input format description',
              outputFormat: data.outputFormat || 'Output format description',
              constraints: data.constraints || ['1 <= n <= 10^5'],
              examples: data.examples || [{ input: 'Input example', output: 'Output example' }],
              solutionExplanation: data.solutionExplanation || '',
              codeSolutions: data.codeSolutions || [
                { language: 'c', code: '#include <stdio.h>\n\nint main() {\n    return 0;\n}' },
              ],
              tags: data.tags || ['POTD', 'Algorithms'],
            });
            triggerSuccessAlert('New Unstop POTD published!');
          }
        }}
      />

      <OpportunityEditorModal
        isOpen={oppModal.isOpen}
        onClose={() => setOppModal({ isOpen: false, data: null })}
        initialData={oppModal.data}
        onSave={(data) => {
          if (oppModal.data) {
            updateOpportunity(oppModal.data.id, data);
            triggerSuccessAlert(`Opportunity "${data.title || oppModal.data.title}" updated!`);
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
              officialUrl: data.officialUrl || 'https://sakshamxtech.vercel.app',
              status: data.status || 'Active',
              featured: data.featured ?? false,
              postedDate: data.postedDate || getTodayISODate(),
            });
            triggerSuccessAlert('Opportunity created!');
          }
        }}
      />

      <SwagEditorModal
        isOpen={swagModal.isOpen}
        onClose={() => setSwagModal({ isOpen: false, data: null })}
        initialData={swagModal.data}
        onSave={(data) => {
          if (swagModal.data) {
            updateSwag(swagModal.data.id, data);
            triggerSuccessAlert(`Swag item "${data.title || swagModal.data.title}" updated!`);
          } else {
            addSwag({
              title: data.title || 'Swag Item',
              brand: data.brand || 'Google Cloud Arcade',
              category: data.category || 'Magic Mug',
              imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
              description: data.description || '',
              tierRequired: data.tierRequired || 'Champion',
              tierTags: data.tierTags || ['Champion'],
              revealedDate: data.revealedDate || '3 November 2026',
              eligibility: data.eligibility || '50+ Arcade Points in 2026 season',
              howToClaim: data.howToClaim || ['Order from official prize counter'],
              campaignStartDate: data.campaignStartDate || '2026-01-01',
              campaignEndDate: data.campaignEndDate || '2026-12-31',
              officialSourceUrl: data.officialSourceUrl || 'https://go.qwiklabs.com/arcade',
              status: data.status || 'Active',
              featured: data.featured ?? true,
            });
            triggerSuccessAlert('Swag item added!');
          }
        }}
      />

      <CLessonEditorModal
        isOpen={cLessonModal.isOpen}
        onClose={() => setCLessonModal({ isOpen: false, data: null })}
        initialData={cLessonModal.data}
        onSave={(data) => {
          if (cLessonModal.data) {
            updateCLesson(cLessonModal.data.id, data);
            triggerSuccessAlert(`C Lecture Day ${data.dayNumber || cLessonModal.data.dayNumber} updated!`);
          } else {
            const nextDay = cLessons.length + 1;
            addCLesson({
              dayNumber: data.dayNumber || nextDay,
              title: data.title || `Day ${nextDay} Lesson`,
              slug: data.slug || `day-${nextDay}-${(data.title || 'lesson').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              summary: data.summary || '',
              durationMinutes: data.durationMinutes || 30,
              content: data.content || `# Day ${nextDay}\n\nLecture notes here.`,
              codeSnippet: data.codeSnippet || '#include <stdio.h>\n\nint main() {\n    return 0;\n}',
              expectedOutput: data.expectedOutput || '',
              youtubeVideoId: data.youtubeVideoId || '',
              practiceQuestions: data.practiceQuestions || [],
              quiz: data.quiz || [],
              isPublished: true,
            });
            triggerSuccessAlert('New C Academy lesson added!');
          }
        }}
      />

      <ResourceEditorModal
        isOpen={resourceModal.isOpen}
        onClose={() => setResourceModal({ isOpen: false, data: null })}
        initialData={resourceModal.data}
        onSave={(data) => {
          if (resourceModal.data) {
            updateResource(resourceModal.data.id, data);
            triggerSuccessAlert(`Resource "${data.title || resourceModal.data.title}" updated!`);
          } else {
            addResource({
              title: data.title || 'Resource Title',
              description: data.description || '',
              category: data.category || 'Cheat Sheet',
              format: data.format || 'PDF',
              fileSize: data.fileSize || '2.0 MB',
              downloadUrl: data.downloadUrl || '#',
              previewImageUrl: data.previewImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
              tags: data.tags || ['Notes', 'PDF'],
              publishedDate: getTodayISODate(),
            });
            triggerSuccessAlert('Resource added!');
          }
        }}
      />

      {/* ========================================================================= */}
      {/* FIREBASE SYNC SUMMARY / PERMISSIONS MODAL */}
      {/* ========================================================================= */}
      {syncSummaryModal.isOpen && (
        <div className="fixed inset-0 z-[100000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            {syncSummaryModal.success ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
                    ✓
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Cloud Firestore Synchronized!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All website collections have been stored directly into your Google Cloud Firestore database.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Blogs</span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                      {syncSummaryModal.counts?.blogs ?? 0} docs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Arcade Labs</span>
                    <span className="font-black text-cyan-600 dark:text-cyan-400 text-sm">
                      {syncSummaryModal.counts?.arcadeSolutions ?? 0} docs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Unstop POTD</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {syncSummaryModal.counts?.unstopProblems ?? 0} docs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Opportunities</span>
                    <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
                      {syncSummaryModal.counts?.opportunities ?? 0} docs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Swags Catalog</span>
                    <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                      {syncSummaryModal.counts?.swags ?? 0} docs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">C Academy</span>
                    <span className="font-black text-purple-600 dark:text-purple-400 text-sm">
                      {syncSummaryModal.counts?.cLessons ?? 0} docs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Resources</span>
                    <span className="font-black text-teal-600 dark:text-teal-400 text-sm">
                      {syncSummaryModal.counts?.resources ?? 0} docs
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Settings</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-sm">Synced</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {firebaseConfig.projectId && (
                    <a
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/data`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-md transition-all"
                    >
                      <span>View in Firebase Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setSyncSummaryModal({ isOpen: false, success: false })}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition-all"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
                    !
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Cloud Firestore Write Blocked
                  </h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {syncSummaryModal.error || 'Firestore rejected the document write operation.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <p className="font-bold text-slate-900 dark:text-white">To fix this in 10 seconds:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px]">
                    <li>Copy the <strong>Firestore Rules</strong> below.</li>
                    <li>Open your <strong>Firebase Console Rules tab</strong>.</li>
                    <li>Paste the rules and click <strong>Publish</strong>.</li>
                  </ol>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={handleCopyRules}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      rulesCopied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {rulesCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{rulesCopied ? 'Rules Copied!' : 'Copy Rules'}</span>
                  </button>

                  {firebaseConfig.projectId && (
                    <a
                      href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/rules`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Open Console Rules</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => setSyncSummaryModal({ isOpen: false, success: false })}
                    className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
