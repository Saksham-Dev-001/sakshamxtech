import React from 'react';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';
import { SEOHead } from '../components/shared/SEOHead';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  navigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, navigate }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'} | SakshamXTech`}
        description="SakshamXTech transparent privacy policy and terms of service regarding student educational tools and data usage."
      />

      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 dark:bg-cyan-950 dark:border-cyan-500/30 dark:text-cyan-400 flex items-center justify-center">
            {isPrivacy ? <ShieldCheck className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: November 2026</p>
          </div>
        </div>

        <div className="prose max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {isPrivacy ? (
            <>
              <p>
                At <strong>SakshamXTech</strong>, your privacy and security are paramount. This policy explains what information we collect and how it is protected.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Information We Do Not Collect</h3>
              <p>
                We do NOT collect sensitive credentials, private passwords, or credit card numbers. All public educational features (Arcade solutions, Unstop POTD, C Academy, Tools) are completely free and do not require user account registration.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Browser Local Storage</h3>
              <p>
                Features like the Arcade Progress Tracker and code in the C Playground are stored directly inside your browser's private local storage. This data never leaves your device unless you choose to share your progress.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Third-Party Links</h3>
              <p>
                Our platform contains verified links to external programs including Google Cloud Skills Boost, Unstop, GitHub, and corporate career portals. We encourage you to review their respective privacy statements when applying.
              </p>
            </>
          ) : (
            <>
              <p>
                Welcome to <strong>SakshamXTech</strong>. By accessing our educational modules, tutorials, and developer tools, you agree to the following terms.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">1. Educational Intent</h3>
              <p>
                All Google Cloud Arcade lab walkthroughs and Unstop code solutions are provided strictly for educational and conceptual learning. We advocate for learning the underlying system architectures, not merely copy-pasting code without understanding.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">2. Swags & Rewards Disclaimer</h3>
              <p>
                Merchandise opportunities, prizes, and swag distributions are managed independently by official vendors (Google LLC, Microsoft, GitHub). SakshamXTech does not manufacture or guarantee physical delivery of vendor rewards.
              </p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">3. Code Playground Usage</h3>
              <p>
                The online C compiler is provided for academic exercises and student algorithmic testing. Automated scraping, malicious payload generation, or denial-of-service attempts against the compiler runtime are strictly prohibited.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
