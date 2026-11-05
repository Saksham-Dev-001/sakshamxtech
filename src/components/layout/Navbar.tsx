import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  Code2, 
  Briefcase, 
  Gift, 
  Terminal, 
  Wrench, 
  FolderDown, 
  ShieldCheck, 
  Bell,
  ChevronRight,
  User,
  Home,
  Download,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { PWAInstallModal } from '../shared/PWAInstallModal';
import { requestPushPermission, getPushPermissionState } from '../../services/oneSignalService';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, openSearch }) => {
  const { siteSettings, theme, toggleTheme } = useApp();
  const { isAdmin } = useAuth();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [pushState, setPushState] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const notificationRef = useRef<HTMLDivElement | null>(null);

  const handleInstallClick = async () => {
    const outcome = await promptInstall();
    if (outcome === 'manual') {
      setInstallModalOpen(true);
    }
  };

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    setPushState(granted ? 'granted' : getPushPermissionState());
  };

  useEffect(() => {
    if (showNotificationToast) {
      setPushState(getPushPermissionState());
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotificationToast(false);
      }
    };

    if (showNotificationToast) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotificationToast]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Google Arcade', path: '/google-arcade', icon: Sparkles },
    { label: 'Unstop', path: '/unstop', icon: Code2 },
    { label: 'Blogs', path: '/blogs', icon: BookOpen },
    { label: 'Opportunities', path: '/opportunities', icon: Briefcase },
    { label: 'C Academy', path: '/c-academy', icon: Terminal },
    { label: 'Tools', path: '/tools', icon: Wrench },
    { label: 'Resources', path: '/resources', icon: FolderDown },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Secret logo tap gesture handler (5 quick taps within 2 seconds unlocks workspace gate)
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    logoClickCountRef.current += 1;
    if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current);

    if (logoClickCountRef.current >= 5) {
      logoClickCountRef.current = 0;
      window.dispatchEvent(new CustomEvent('sx:open-gate'));
      return;
    }

    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 2000);

    handleNavClick('/');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-sm py-2.5'
            : 'bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/80 py-3.5'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between">
          
          {/* Brand Logo with stealth multi-tap gate trigger */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
            title="SakshamXTech Home"
          >
            {/* Official Brand Logo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-500/30 shadow-md shadow-blue-500/20 bg-slate-900 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-200 shrink-0">
              <img
                src={siteSettings.creatorAvatarUrl || '/assets/branding/saksham_avatar.png'}
                alt="SakshamXTech Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== window.location.origin + '/assets/branding/saksham_avatar.png') {
                    target.src = '/assets/branding/saksham_avatar.png';
                  }
                }}
              />
            </div>

            <div className="flex items-center">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white truncate">
                Saksham<span className="text-blue-600">X</span>Tech
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Matching Mockup with Blue Active Pill) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5">
            {navLinks.map((item) => {
              const isActive =
                item.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3.5 py-1.5 text-xs font-bold transition-all duration-150 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Global Search Button */}
            <button
              onClick={openSearch}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell with Red Badge */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
              </button>

              {/* Notification Popover */}
              {showNotificationToast && (
                <div 
                  ref={notificationRef}
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Notifications &amp; Alerts</span>
                    </span>
                    <button
                      onClick={() => setShowNotificationToast(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Push Notifications Toggle Card */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                    {pushState === 'granted' ? (
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                            Push Notifications Active
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            You'll receive instant alerts on mobile when new Arcade solutions or swags drop!
                          </p>
                        </div>
                      </div>
                    ) : pushState === 'denied' ? (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-bold text-amber-600 dark:text-amber-400">Notifications Blocked</p>
                        <p className="text-[10px]">
                          Unblock notifications in your browser settings to receive mobile alerts.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
                          <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                            Get Instant Mobile Alerts
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Receive live notifications for new Google Cloud Arcade lab answers &amp; Unstop POTD solutions!
                        </p>
                        <button
                          onClick={handleEnablePush}
                          className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Bell className="w-3 h-3" />
                          <span>Turn On Notifications</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recent Alert Item */}
                  <div 
                    onClick={() => {
                      setShowNotificationToast(false);
                      handleNavClick('/google-arcade');
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px]">Arcade 2026 Season</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">New</span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
                      Google Cloud Arcade 2026 is active! Calculate points, claim swags, and unlock facilitator badges.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Active Owner Session Indicator (Hidden completely for public visitors) */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('/admin')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs p-1.5 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                title="Open Management Studio"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Workspace</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1 shadow-xl animate-in slide-in-from-top-2">
            {isAdmin && (
              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white flex items-center justify-between shadow-sm mb-2 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Admin Workspace Studio</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            )}
            {navLinks.map((item) => {
              const isActive =
                item.path === '/'
                  ? currentPath === '/'
                  : currentPath.startsWith(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
            {/* Mobile Dropdown Install App Banner */}
            {!isInstalled && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleInstallClick();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-sm mt-3 mb-1 cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Download className="w-4 h-4" />
                  <span>Install SakshamXTech App</span>
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase">Free</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* PWA Install Guide Modal */}
      <PWAInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        onInstall={promptInstall}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />
    </>
  );
};
