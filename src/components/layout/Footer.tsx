import React, { useState } from 'react';
import { 
  Terminal, 
  Youtube, 
  Send, 
  Linkedin, 
  Instagram, 
  Github, 
  ShieldCheck, 
  Heart, 
  ExternalLink, 
  Sparkles,
  Lock,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { siteSettings } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot field
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Anti-bot check: if honeypot is filled, silent reject
    if (honeypot) return;
    if (emailInput.trim() && emailInput.includes('@')) {
      setIsSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-300 pt-16 pb-32 sm:pb-16 lg:pb-12 relative overflow-hidden">
      {/* Background glowing glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer group inline-flex"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyan-500/40 shadow-lg shadow-cyan-500/20 bg-slate-900 shrink-0 group-hover:scale-105 transition-all">
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
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Saksham<span className="text-cyan-400">X</span>Tech
                </span>
                <p className="text-xs text-slate-400">{siteSettings.tagline}</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              A comprehensive technology, learning, and student opportunity platform. 
              Bridging hands-on cloud skills, everyday competitive problem solving, 
              systems programming, and global career opportunities.
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <a
                href={siteSettings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 flex items-center justify-center hover:bg-red-900/50 hover:text-white transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-400 flex items-center justify-center hover:bg-blue-900/50 hover:text-white transition-colors"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 flex items-center justify-center hover:bg-indigo-900/50 hover:text-white transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-pink-950/40 border border-pink-500/30 text-pink-400 flex items-center justify-center hover:bg-pink-900/50 hover:text-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>

            {/* Newsletter Subscription with anti-bot honeypot */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Get Swag & Opportunity Alerts
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! You will receive alerts on upcoming opportunities.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  {/* Invisible honeypot for spam bots */}
                  <input
                    type="text"
                    name="phone_verification"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-slate-900 border border-slate-700 text-xs px-3 py-2 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white rounded-lg hover:brightness-110 transition-all shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Ecosystem */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/google-arcade')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Google Cloud Arcade Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/google-arcade?tab=calculator')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Arcade Points Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/google-arcade?tab=tracker')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Arcade Progress Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/google-arcade?tab=swags')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Arcade Swags 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/unstop')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Unstop Problem of the Day
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/blogs')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Technical Blogs & Guides
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Opportunities & Learn */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Learning & Perks
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/c-academy')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>C Academy Course</span>
                  <span className="text-[9px] bg-indigo-500/30 text-indigo-300 px-1 py-0.2 rounded font-bold">10 Days</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/c-playground')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Online C Playground
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Tech Internships & Jobs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/opportunities')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  College Hackathons
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/swags')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Free Swag Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/resources')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  PDF Notes & Roadmaps
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Admin */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  About SakshamXTech
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Contact & Sponsorships
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/tools')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Developer Utilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 pb-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span>Official student learning platform by Saksham Sharma.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} SakshamXTech. Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for developers worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
