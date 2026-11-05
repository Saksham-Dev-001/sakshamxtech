import React from 'react';
import { Download, X, Smartphone, Monitor, CheckCircle, Sparkles } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable,
  isInstalled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Logo */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 p-2.5 border border-blue-500/30 shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
            <img
              src="/icon-192.png"
              alt="SakshamXTech App Logo"
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/favicon.png';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Saksham<span className="text-blue-600">X</span>Tech App
              </h3>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fast, offline-ready &amp; 100% free
            </p>
          </div>
        </div>

        {/* Benefits Pill Cards */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-500/30 text-xs text-blue-900 dark:text-blue-200 font-medium">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Instant 1-tap launch from your phone or desktop</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-500/30 text-xs text-emerald-900 dark:text-emerald-200 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Zero reload lag &amp; offline access to cached codes</span>
          </div>
        </div>

        {/* Install Actions */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            ✓ App is already installed on your device!
          </div>
        ) : isInstallable ? (
          <button
            onClick={onInstall}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Install App Now</span>
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              How to install in Chrome / Safari:
            </p>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <Monitor className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>PC / Chrome:</strong> Click the <strong>Install icon (⊕)</strong> on the right side of the address bar.</span>
              </div>
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Mobile Chrome:</strong> Tap <strong>(⋮) menu</strong> &gt; <strong>Install app</strong> or <strong>Add to Home screen</strong>.</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition-colors"
            >
              Got It
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
