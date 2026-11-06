import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  isolate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SakshamXTech Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.isolate) {
        return (
          <div className="py-16 px-4 max-w-xl mx-auto text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Page Encountered an Issue</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                We couldn't render this view right now. You can reload or return to the main hub.
              </p>
            </div>
            {this.state.error && (
              <div className="text-[11px] bg-slate-100 dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left max-h-24 overflow-x-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-800 dark:text-slate-200">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Something went wrong</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                SakshamXTech encountered an unexpected issue while rendering.
              </p>
            </div>
            {this.state.error && (
              <div className="text-xs bg-slate-100 dark:bg-slate-950 text-rose-600 dark:text-rose-400 font-mono p-3 rounded-lg overflow-x-auto text-left max-h-32 border border-slate-200 dark:border-slate-800">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

