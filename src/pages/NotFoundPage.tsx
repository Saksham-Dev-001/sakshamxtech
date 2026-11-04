import React from 'react';
import { Terminal, Home, ArrowLeft, Search } from 'lucide-react';
import { SEOHead } from '../components/shared/SEOHead';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <div className="py-24 max-w-xl mx-auto px-4 text-center">
      <SEOHead title="404 - Page Not Found | SakshamXTech" description="Page not found on SakshamXTech." />

      <div className="w-20 h-20 rounded-3xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-6 font-mono text-2xl font-black shadow-2xl">
        404
      </div>

      <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
        The destination you are looking for has either been moved, updated, or does not exist. Use the links below to return to the home platform.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <button
          onClick={() => navigate('/google-arcade')}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
        >
          Arcade Solutions
        </button>
      </div>
    </div>
  );
};
