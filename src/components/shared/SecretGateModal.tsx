import React, { useState, useEffect, useRef } from 'react';
import { Lock, ArrowRight, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SecretGateModalProps {
  navigate: (path: string) => void;
}

export const SecretGateModal: React.FC<SecretGateModalProps> = ({ navigate }) => {
  const { loginWithPasskey, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Ctrl + Shift + S or Alt + Shift + X)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + S (or Cmd + Shift + S on macOS)
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (isCmdOrCtrl && e.shiftKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.altKey && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomTrigger = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('sx:open-gate', handleCustomTrigger);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('sx:open-gate', handleCustomTrigger);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setPasskey('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passkey.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await loginWithPasskey(passkey);
    setIsSubmitting(false);

    if (res.success) {
      setIsOpen(false);
      setPasskey('');
      navigate('/admin');
    } else {
      setErrorMsg(res.message || 'Access declined.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPasskey('');
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div
        className={`w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-5 text-slate-100 ${
          shake ? 'animate-shake' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-900 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Monogram */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            SX
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">System Access</h3>
            <p className="text-[11px] text-slate-400">Enter authorized passkey to proceed</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="relative">
              <input
                ref={inputRef}
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 tracking-wider font-mono outline-none transition-colors"
                autoComplete="current-password"
              />
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {errorMsg && (
              <p className="text-[11px] text-rose-400 font-medium pl-1 animate-in fade-in">
                {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !passkey.trim()}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Verifying...' : 'Unlock Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-[10px] text-slate-500">
          <span>Private authorization gate • Session protected</span>
        </div>
      </div>
    </div>
  );
};

