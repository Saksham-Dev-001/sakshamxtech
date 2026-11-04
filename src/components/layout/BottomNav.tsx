import React, { useState } from 'react';
import { 
  Home, 
  Sparkles, 
  Code2, 
  Terminal, 
  Menu, 
  X, 
  Search, 
  Gift, 
  BookOpen, 
  Briefcase, 
  Wrench, 
  FolderDown, 
  Calculator, 
  Youtube, 
  Send, 
  Sun, 
  Moon, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  currentPath: string;
  navigate: (path: string) => void;
  openSearch: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPath, navigate, openSearch }) => {
  const { siteSettings, theme, toggleTheme, bookmarks } = useApp();
  const { isAdmin, logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const mainTabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Arcade', path: '/google-arcade', icon: Sparkles, badge: 'Labs' },
    { label: 'POTD', path: '/unstop', icon: Code2, badge: 'Daily' },
    { label: 'C IDE', path: '/c-academy', icon: Terminal },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
    setSheetOpen(false);
  };

  const moreLinks = [
    { label: 'Arcade Swags', path: '/google-arcade?tab=swags', icon: Gift, color: 'text-rose-400 bg-rose-950/60 border-rose-500/30' },
    { label: 'Tech Blogs', path: '/blogs', icon: BookOpen, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30' },
    { label: 'Opportunities', path: '/opportunities', icon: Briefcase, color: 'text-amber-400 bg-amber-950/60 border-amber-500/30' },
    { label: 'Points Calc', path: '/arcade-calculator', icon: Calculator, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30' },
    { label: 'GCC SandBox', path: '/c-academy/playground', icon: Terminal, color: 'text-purple-400 bg-purple-950/60 border-purple-500/30' },
    { label: 'Dev Tools', path: '/tools', icon: Wrench, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30' },
    { label: 'Resources', path: '/resources', icon: FolderDown, color: 'text-blue-400 bg-blue-950/60 border-blue-500/30' },
    { label: 'About Creator', path: '/about', icon: ShieldCheck, color: 'text-slate-300 bg-slate-900 border-slate-700' },
  ];

  return (
    <>
      {/* Floating Native-Style Bottom App Dock */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto"
      >
        <div className="bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.85)] p-1.5 flex items-center justify-between">
          {mainTabs.map((tab) => {
            const isActive = tab.path === '/' 
              ? currentPath === '/' 
              : currentPath.startsWith(tab.path);

            return (
              <button
                key={tab.path}
                onClick={() => handleTabClick(tab.path)}
                className={`flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 mobile-tap ${
                  isActive 
                    ? 'text-blue-600 dark:text-cyan-300 font-extrabold bg-blue-50 dark:bg-cyan-950/50 border border-blue-200 dark:border-cyan-500/40 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 active:text-blue-600'
                }`}
              >
                {/* Active Indicator Top Glow Pill */}
                {isActive && (
                  <span className="absolute -top-1 w-6 h-0.5 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-[0_0_8px_#2563eb]" />
                )}
                
                <div className="relative">
                  <tab.icon className={`w-4 h-4 mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-600 dark:text-cyan-400' : ''}`} />
                  {tab.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight leading-none">{tab.label}</span>
              </button>
            );
          })}

          {/* Quick Search Button in Dock */}
          <button
            onClick={openSearch}
            className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors mobile-tap"
            title="Search"
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight leading-none">Search</span>
          </button>

          {/* More Menu Sheet Trigger */}
          <button
            onClick={() => setSheetOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors mobile-tap ${
              sheetOpen 
                ? 'text-blue-600 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-950/60 border border-blue-200 dark:border-cyan-500/30' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="All Categories"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Up Bottom Sheet Modal */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md transition-opacity">
          {/* Backdrop Tap to Close */}
          <div 
            className="flex-1 w-full"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet Container */}
          <div className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-250">
            {/* Sheet Drag Handle */}
            <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700/80 rounded-full mx-auto" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3" onClick={() => handleTabClick('/')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-black italic shadow-md shadow-blue-500/20">
                  SX
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">Saksham<span className="text-blue-600">X</span>Tech</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded-full">
                      2026
                    </span>
                  </div>
                  <p className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono font-bold">CODE • CLOUD • GROW</p>
                </div>
              </div>

              <button
                onClick={() => setSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Top Bar: YouTube Live + Telegram */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={siteSettings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 flex items-center justify-between text-slate-900 dark:text-white mobile-tap shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-600 fill-red-600" />
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">YouTube</p>
                    <p className="text-[10px] text-red-600/80 dark:text-red-300/80">35K+ Subscribers</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-red-600" />
              </a>

              <a
                href={siteSettings.socialLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/40 flex items-center justify-between text-slate-900 dark:text-white mobile-tap shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">Telegram</p>
                    <p className="text-[10px] text-blue-600/80 dark:text-blue-300/80">Instant Alerts</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
              </a>
            </div>

            {/* Categories Quick Grid */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Explore Categories & Utilities
              </p>
              <div className="grid grid-cols-2 gap-2">
                {moreLinks.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleTabClick(item.path)}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-left hover:border-blue-500/40 transition-colors mobile-tap"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer (Theme + Admin) */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between pb-safe">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 mobile-tap"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTabClick('/admin')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-xs font-bold text-blue-400"
                  >
                    <span>Workspace</span>
                  </button>
                  <button
                    onClick={logout}
                    className="text-xs text-rose-400 font-semibold px-2 py-2"
                  >
                    Exit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
