import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  Code2, 
  CheckCircle2, 
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';
import { executeCCode, ExecutionResult } from '../services/compilerService';

interface CPlaygroundPageProps {
  navigate: (path: string) => void;
}

const CODE_TEMPLATES = [
  {
    name: 'Hello SakshamXTech (Default)',
    code: `#include <stdio.h>

int main() {
    printf("Hello SakshamXTech!\\n");
    printf("Welcome to the interactive C compiler.\\n");
    return 0;
}`,
  },
  {
    name: 'Pointers & Memory Addresses',
    code: `#include <stdio.h>

int main() {
    int value = 42;
    int *ptr = &value;

    printf("Value: %d\\n", *ptr);
    printf("Memory Address: %p\\n", (void*)ptr);
    printf("Size of Pointer: %lu bytes\\n", sizeof(ptr));
    return 0;
}`,
  },
  {
    name: 'Recursive Factorial',
    code: `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int num = 5;
    printf("Factorial of %d = %d\\n", num, factorial(num));
    return 0;
}`,
  },
  {
    name: 'Dynamic Memory Allocation (malloc)',
    code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)malloc(n * sizeof(int));
    
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }
    
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
        printf("arr[%d] = %d\\n", i, arr[i]);
    }
    
    free(arr);
    printf("Memory safely released.\\n");
    return 0;
}`,
  },
];

export const CPlaygroundPage: React.FC<CPlaygroundPageProps> = () => {
  const { trackEvent } = useApp();

  const [code, setCode] = useState<string>(() => {
    const saved = localStorage.getItem('sakshamxtech_playground_code');
    return saved || CODE_TEMPLATES[0].code;
  });

  const [stdin, setStdin] = useState<string>('');
  const [output, setOutput] = useState<string>('Click "Run Code" to compile and execute.');
  const [errors, setErrors] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sakshamxtech_playground_code', code);
  }, [code]);

  const handleRun = async () => {
    setIsRunning(true);
    setStatus('idle');
    setErrors('');
    setOutput('Compiling code with GCC...');

    try {
      trackEvent('compiler');
      const result: ExecutionResult = await executeCCode(code, stdin);
      
      setOutput(result.stdout || 'Program exited with status 0 (no output to stdout).');
      setErrors(result.stderr || '');
      setStatus(result.status === 'success' ? 'success' : 'error');
      setExecutionTime(result.executionTimeMs);
    } catch (err: any) {
      setStatus('error');
      setErrors(err.message || 'Execution error');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[0].code);
    setOutput('Code reset to default Hello World.');
    setErrors('');
    setStatus('idle');
    setExecutionTime(null);
  };

  const handleClearOutput = () => {
    setOutput('');
    setErrors('');
    setStatus('idle');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Line count for code editor gutter
  const lineNumbers = code.split('\n').map((_, index) => index + 1);

  return (
    <div className="py-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <SEOHead
        title="Online C Compiler & Playground | SakshamXTech"
        description="Free online sandboxed C compiler. Write, compile, and run C code instantly in your browser with standard libc support and output terminal."
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 dark:bg-purple-950 dark:border-purple-500/40 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
              GCC
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              C Programming Playground
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sandboxed execution environment • Isolated student compiler • GCC 9.2+ Standard
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Templates Select */}
          <select
            onChange={(e) => {
              const tmpl = CODE_TEMPLATES.find((t) => t.name === e.target.value);
              if (tmpl) setCode(tmpl.code);
            }}
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium shadow-sm"
          >
            <option value="">Load Template...</option>
            {CODE_TEMPLATES.map((tmpl) => (
              <option key={tmpl.name} value={tmpl.name}>
                {tmpl.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs shadow-sm"
            title="Reset to Template"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs shadow-sm"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Code Editor */}
        <div className="lg:col-span-7 glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col bg-slate-950">
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              main.c
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {lineNumbers.length} lines • C11 Standard
            </span>
          </div>

          <div className="flex bg-slate-950 min-h-[420px] font-mono text-xs">
            {/* Line Numbers Gutter */}
            <div className="select-none py-4 px-3 text-right bg-slate-950 text-slate-600 border-r border-slate-800/80 leading-6 text-[11px] font-mono shrink-0">
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>

            {/* Code Input Area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-transparent text-cyan-200 p-4 leading-6 font-mono text-xs resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30"
              style={{ minHeight: '440px' }}
            />
          </div>
        </div>

        {/* Right: Custom Stdin + Output Terminal */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Custom Stdin Box */}
          <div className="glass-card rounded-2xl border border-slate-800 p-4 bg-slate-950/80">
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>Standard Input (stdin)</span>
              <span className="text-[10px] text-slate-500 font-normal">Optional</span>
            </label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide user inputs for scanf, separated by spaces or newlines..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Terminal Output */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950 flex flex-col">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-200">Execution Terminal</span>
              </div>

              <div className="flex items-center gap-3">
                {executionTime !== null && (
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {executionTime}ms
                  </span>
                )}
                <button
                  onClick={handleClearOutput}
                  className="text-slate-500 hover:text-slate-300 text-[11px]"
                  title="Clear Terminal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 min-h-[280px] max-h-[360px] overflow-y-auto font-mono text-xs space-y-2">
              {status === 'success' && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Success (Exit Code 0)</span>
                </div>
              )}

              {status === 'error' && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                  <span>Compilation / Runtime Error</span>
                </div>
              )}

              {/* Stdout */}
              <pre className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                <code>{output}</code>
              </pre>

              {/* Stderr if any */}
              {errors && (
                <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed mt-2 border-t border-rose-900/40 pt-2">
                  <code>{errors}</code>
                </pre>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
