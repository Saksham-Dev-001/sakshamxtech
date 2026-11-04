import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2,
  Terminal,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../../components/shared/SEOHead';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { login, isAdmin, authorizedEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in as admin, redirect to /admin
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await login(email, passkey);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrorMsg(result.message || 'Authentication rejected.');
      }
    } catch {
      setErrorMsg('An unexpected verification error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Admin Gateway Portal | SakshamXTech"
        description="Private single administrator login portal for SakshamXTech."
      />

      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Platform</span>
        </button>

        <div className="glass-card p-8 rounded-3xl border border-slate-700/80 bg-slate-950/90 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/20">
              <Lock className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Private gateway strictly restricted to authorized owner of SakshamXTech.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Authorized Owner Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hutch.saksham@gmail.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Master Passkey</span>
              </label>
              <input
                type="password"
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Quick autofill helper for the owner in AI Studio preview */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Owner Quick Fill:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail(authorizedEmail);
                  setPasskey('saksham@2026');
                }}
                className="text-cyan-400 font-semibold hover:underline"
              >
                Insert Owner Credentials
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-xs font-bold bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Command Center'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-900 text-center">
            <p className="text-[11px] text-slate-500">
              Zero public signups. Single-administrator RBAC role verification active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
