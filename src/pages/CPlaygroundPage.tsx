import React, { useState, useEffect, useRef } from 'react';
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
  HelpCircle,
  Cpu,
  Keyboard,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';
import { executeCCode, ExecutionResult } from '../services/compilerService';

interface CPlaygroundPageProps {
  navigate: (path: string) => void;
}

interface CodeTemplate {
  name: string;
  category: string;
  code: string;
  defaultStdin?: string;
}

const CODE_TEMPLATES: CodeTemplate[] = [
  {
    name: 'Hello SakshamXTech (Default)',
    category: 'Basic',
    code: `#include <stdio.h>

int main() {
    printf("Hello SakshamXTech!\\n");
    printf("Welcome to the interactive high-speed C compiler.\\n");
    return 0;
}`,
    defaultStdin: '',
  },
  {
    name: 'User Input (scanf & Arithmetic)',
    category: 'Input / Output',
    code: `#include <stdio.h>

int main() {
    int num1, num2;
    printf("Enter two integers: \\n");
    if (scanf("%d %d", &num1, &num2) == 2) {
        printf("First number: %d\\n", num1);
        printf("Second number: %d\\n", num2);
        printf("Sum: %d + %d = %d\\n", num1, num2, num1 + num2);
        printf("Product: %d * %d = %d\\n", num1, num2, num1 * num2);
    } else {
        printf("Error: Please provide two space-separated numbers in Standard Input.\\n");
    }
    return 0;
}`,
    defaultStdin: '25 75',
  },
  {
    name: 'Name & Age Input (scanf %s %d)',
    category: 'Input / Output',
    code: `#include <stdio.h>

int main() {
    char name[50];
    int age;
    printf("Enter your name and current age: \\n");
    if (scanf("%49s %d", name, &age) == 2) {
        printf("Hello %s! Welcome to SakshamXTech.\\n", name);
        printf("In 5 years, you will be %d years old.\\n", age + 5);
    } else {
        printf("Notice: Enter name and age in standard input (e.g. Saksham 21).\\n");
    }
    return 0;
}`,
    defaultStdin: 'Saksham 21',
  },
  {
    name: 'Array Input & Average (scanf Loop)',
    category: 'Arrays',
    code: `#include <stdio.h>

int main() {
    int n;
    printf("Enter number of elements: \\n");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Invalid element count.\\n");
        return 1;
    }

    int arr[n];
    int sum = 0;
    printf("Reading %d integers...\\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }

    printf("Numbers entered: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\nTotal Sum = %d\\n", sum);
    printf("Average = %.2f\\n", (float)sum / n);
    return 0;
}`,
    defaultStdin: '5\n10 20 30 40 50',
  },
  {
    name: 'Even or Odd Checker (Conditionals)',
    category: 'Conditionals',
    code: `#include <stdio.h>

int main() {
    int num;
    printf("Enter an integer to check even/odd: \\n");
    if (scanf("%d", &num) == 1) {
        if (num % 2 == 0) {
            printf("%d is an EVEN number.\\n", num);
        } else {
            printf("%d is an ODD number.\\n", num);
        }
    }
    return 0;
}`,
    defaultStdin: '42',
  },
  {
    name: 'Pointers & Memory Addresses',
    category: 'Pointers',
    code: `#include <stdio.h>

int main() {
    int value = 42;
    int *ptr = &value;

    printf("Value: %d\\n", *ptr);
    printf("Memory Address of value: %p\\n", (void*)ptr);
    printf("Size of Pointer on this machine: %lu bytes\\n", sizeof(ptr));
    return 0;
}`,
    defaultStdin: '',
  },
  {
    name: 'Recursive Factorial',
    category: 'Functions',
    code: `#include <stdio.h>

long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int num;
    printf("Enter a number to calculate factorial: \\n");
    if (scanf("%d", &num) != 1 || num < 0) {
        num = 5; // default fallback
    }
    printf("Factorial of %d = %lld\\n", num, factorial(num));
    return 0;
}`,
    defaultStdin: '5',
  },
  {
    name: 'Dynamic Memory Allocation (malloc & free)',
    category: 'Memory',
    code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*)malloc(n * sizeof(int));
    
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }
    
    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
        printf("arr[%d] = %d (Address: %p)\\n", i, arr[i], (void*)&arr[i]);
    }
    
    free(arr);
    printf("Memory safely released with free().\\n");
    return 0;
}`,
    defaultStdin: '',
  },
  {
    name: 'Star Pyramid Pattern Generator',
    category: 'Loops',
    code: `#include <stdio.h>

int main() {
    int rows = 5;
    printf("Enter number of rows: \\n");
    if (scanf("%d", &rows) != 1 || rows <= 0 || rows > 20) {
        rows = 5;
    }

    for (int i = 1; i <= rows; i++) {
        for (int space = 1; space <= rows - i; space++) {
            printf(" ");
        }
        for (int j = 1; j <= 2 * i - 1; j++) {
            printf("*");
        }
        printf("\\n");
    }
    return 0;
}`,
    defaultStdin: '5',
  },
];

const QUICK_KEYS = ['Tab', '{', '}', '(', ')', ';', '"', "'", '&', '*', '=', '<', '>', '%', '\\', '/', ',', '_', '+', '-'];

export const CPlaygroundPage: React.FC<CPlaygroundPageProps> = () => {
  const { trackEvent } = useApp();

  const [code, setCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('sakshamxtech_playground_code');
      return saved || CODE_TEMPLATES[0].code;
    } catch {
      return CODE_TEMPLATES[0].code;
    }
  });

  const [stdin, setStdin] = useState<string>('');
  const [output, setOutput] = useState<string>('Click "Run Code" to compile and execute.');
  const [errors, setErrors] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [outputCopied, setOutputCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'stdin' | 'terminal'>('editor');
  const [fontSize, setFontSize] = useState<'xs' | 'sm' | 'base'>('xs');

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  // Sync code to user preference locally
  useEffect(() => {
    try {
      localStorage.setItem('sakshamxtech_playground_code', code);
    } catch {}
  }, [code]);

  // Synchronize gutter line scrolling with code textarea
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Quick Snippet / Key Insertion with cursor preservation
  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const toInsert = snippet === 'Tab' ? '    ' : snippet;

    const newCode = value.substring(0, start) + toInsert + value.substring(end);
    setCode(newCode);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + toInsert.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  // Keyboard shortcut handler (Tab indents 4 spaces, Ctrl/Cmd + Enter runs code)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertSnippet('Tab');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  // Execute C code with GCC and STDIN support
  const handleRun = async () => {
    setIsRunning(true);
    setStatus('idle');
    setErrors('');
    setOutput('⚙️ Compiling code with GCC and preparing execution sandbox...');
    
    // Automatically switch to terminal tab on mobile view
    setMobileTab('terminal');

    try {
      trackEvent('compiler');
      const result: ExecutionResult = await executeCCode(code, stdin);

      setOutput(result.stdout || (result.status === 'success' ? 'Program exited with status 0 (no output to stdout).' : ''));
      setErrors(result.stderr || '');
      setStatus(result.status === 'success' ? 'success' : 'error');
      setExecutionTime(result.executionTimeMs);
    } catch (err: any) {
      setStatus('error');
      setErrors(err?.message || 'Execution error');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[0].code);
    setStdin('');
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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOutput = () => {
    const textToCopy = [output, errors].filter(Boolean).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setOutputCopied(true);
    setTimeout(() => setOutputCopied(false), 2000);
  };

  // Detect whether code requires user input via scanf / fgets / getchar
  const requiresInput = code.includes('scanf') || code.includes('fgets') || code.includes('getchar');

  const lineNumbers = code.split('\n').map((_, index) => index + 1);

  // Font size classes
  const fontClass = fontSize === 'base' ? 'text-sm leading-6' : fontSize === 'sm' ? 'text-xs leading-5' : 'text-[11px] leading-5';

  return (
    <div className="py-4 sm:py-8 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 pb-24 lg:pb-8">
      <SEOHead
        title="Online C Compiler & Playground with scanf | SakshamXTech"
        description="Free online sandboxed C compiler with full scanf, standard input (stdin), GCC 13+ standard, and instant execution for mobile and PC."
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 dark:bg-purple-950 dark:border-purple-500/40 dark:text-purple-300 font-extrabold text-xs flex items-center justify-center shadow-xs">
              GCC
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              C Programming Playground
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
            <span>Sandboxed execution</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Full scanf & stdin support</span>
            <span>•</span>
            <span>GCC 13+ Standard</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Templates Select */}
          <select
            onChange={(e) => {
              const tmpl = CODE_TEMPLATES.find((t) => t.name === e.target.value);
              if (tmpl) {
                setCode(tmpl.code);
                if (tmpl.defaultStdin !== undefined) {
                  setStdin(tmpl.defaultStdin);
                }
              }
            }}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 font-medium shadow-xs cursor-pointer"
          >
            <option value="">Load Template...</option>
            {CODE_TEMPLATES.map((tmpl) => (
              <option key={tmpl.name} value={tmpl.name}>
                {tmpl.name}
              </option>
            ))}
          </select>

          {/* Font Size Toggle */}
          <button
            onClick={() => setFontSize((prev) => (prev === 'xs' ? 'sm' : prev === 'sm' ? 'base' : 'xs'))}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold shadow-xs cursor-pointer"
            title="Toggle Font Size"
          >
            A{fontSize === 'xs' ? '1' : fontSize === 'sm' ? '2' : '3'}
          </button>

          {/* Reset Code */}
          <button
            onClick={handleReset}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs shadow-xs cursor-pointer"
            title="Reset Code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs shadow-xs cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Desktop Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="hidden sm:inline-flex px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-white transition-all shadow-md shadow-emerald-500/20 items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Compiling...' : 'Run Code (Ctrl+Enter)'}</span>
          </button>
        </div>
      </div>

      {/* Mobile 3-Way Segmented Navigation Tab */}
      <div className="lg:hidden flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-3 shadow-md">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'editor'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Code</span>
        </button>

        <button
          onClick={() => setMobileTab('stdin')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
            mobileTab === 'stdin'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Input (stdin)</span>
          {requiresInput && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setMobileTab('terminal')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            mobileTab === 'terminal'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Output</span>
          {status === 'success' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          {status === 'error' && <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />}
        </button>
      </div>

      {/* Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left: Code Editor Container */}
        <div className={`lg:col-span-7 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex-col bg-slate-950 ${
          mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
        }`}>
          {/* Editor Header Bar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400/50" />
              main.c
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                {lineNumbers.length} lines • C11 Standard
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                Tab = 4 spaces
              </span>
            </div>
          </div>

          {/* Mobile Quick Key Symbol Toolbar */}
          <div className="px-2 py-1.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-500 font-mono px-1 font-bold shrink-0">KEYS:</span>
            {QUICK_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => insertSnippet(k)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-slate-200 active:text-white rounded-lg text-xs font-mono font-bold shrink-0 transition-colors cursor-pointer border border-slate-700/60"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Code Input Area with Synchronized Gutter */}
          <div className="flex bg-slate-950 min-h-[460px] sm:min-h-[520px] font-mono">
            {/* Line Numbers Gutter */}
            <div
              ref={gutterRef}
              className="select-none py-4 px-3 text-right bg-slate-950 text-slate-600 border-r border-slate-800/80 leading-5 text-[11px] font-mono shrink-0 overflow-hidden"
              style={{ minWidth: '40px' }}
            >
              {lineNumbers.map((num) => (
                <div key={num} className="leading-5">{num}</div>
              ))}
            </div>

            {/* Code Input Area */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              className={`flex-1 w-full bg-transparent text-cyan-200 p-4 font-mono ${fontClass} resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30 overflow-y-auto`}
              style={{ minHeight: '460px' }}
              placeholder="// Write your C code here..."
            />
          </div>
        </div>

        {/* Right: Standard Input (stdin) + Output Terminal */}
        <div className={`lg:col-span-5 space-y-4 ${
          mobileTab !== 'editor' ? 'block' : 'hidden lg:block'
        }`}>
          
          {/* Custom Standard Input (stdin) Box */}
          <div className={`rounded-2xl border border-slate-800 p-4 bg-slate-950 shadow-xl transition-all ${
            mobileTab === 'stdin' ? 'block ring-2 ring-blue-500/50' : 'hidden lg:block'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-blue-400" />
                <span>Standard Input (stdin for scanf)</span>
              </label>
              
              <div className="flex items-center gap-2">
                {stdin.trim() && (
                  <button
                    onClick={() => setStdin('')}
                    className="text-[10px] text-slate-400 hover:text-rose-400 font-mono cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                  {stdin.split(/\s+/).filter(Boolean).length} inputs
                </span>
              </div>
            </div>

            {/* Gentle hint when code uses scanf */}
            {requiresInput && (
              <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Code uses <code>scanf()</code>. Values will be read in order.</span>
                </span>
                {!stdin.trim() && (
                  <button
                    onClick={() => setStdin('10 20')}
                    className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded font-bold cursor-pointer"
                  >
                    + Sample
                  </button>
                )}
              </div>
            )}

            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input values here for scanf / fgets (separated by spaces or newlines, e.g. 15 35)..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed resize-y selection:bg-blue-500/30"
            />
            
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
              <span>Supports integers, floats, strings, and multi-line inputs.</span>
              <button
                type="button"
                onClick={() => setStdin('100 200 Saksham')}
                className="hover:text-blue-400 cursor-pointer font-medium"
              >
                Insert Test Input
              </button>
            </div>
          </div>

          {/* Terminal Output */}
          <div className={`rounded-2xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950 flex-col ${
            mobileTab === 'terminal' || mobileTab === 'stdin' ? 'flex' : 'hidden lg:flex'
          }`}>
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-slate-200">Execution Terminal</span>
                {status === 'success' && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    Exit 0
                  </span>
                )}
                {status === 'error' && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-400 text-[10px] font-bold">
                    Error
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {executionTime !== null && (
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {executionTime}ms
                  </span>
                )}

                <button
                  onClick={handleCopyOutput}
                  className="p-1 text-slate-400 hover:text-slate-200 rounded text-xs cursor-pointer"
                  title="Copy Terminal Output"
                >
                  {outputCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleClearOutput}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded text-xs cursor-pointer"
                  title="Clear Terminal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 min-h-[300px] sm:min-h-[340px] max-h-[500px] overflow-y-auto font-mono text-xs space-y-2 selection:bg-emerald-500/30">
              {status === 'success' && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Program Compiled & Executed Successfully</span>
                </div>
              )}

              {status === 'error' && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 text-rose-300 text-[11px] font-bold mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Compilation / Runtime Error</span>
                </div>
              )}

              {/* Stdout stream */}
              {output && (
                <pre className="text-slate-100 whitespace-pre-wrap leading-relaxed font-mono">
                  <code>{output}</code>
                </pre>
              )}

              {/* Stderr stream */}
              {errors && (
                <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed mt-2 border-t border-rose-900/40 pt-2 font-mono">
                  <code>{errors}</code>
                </pre>
              )}

              {!output && !errors && (
                <div className="text-slate-600 text-xs italic py-6 text-center">
                  Output terminal is empty. Click "Run Code" above to execute.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Floating Bottom Sticky Action Bar on Mobile Screens (Phones & Tablets) */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-[11px]">GCC 13+</span>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex-1 py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-500 active:scale-95 text-white transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Compiling Code...' : 'Run Code'}</span>
        </button>

        <button
          onClick={() => setMobileTab((prev) => (prev === 'editor' ? 'terminal' : 'editor'))}
          className="p-2.5 bg-slate-800 text-slate-200 active:bg-slate-700 rounded-xl border border-slate-700 text-xs font-bold cursor-pointer"
          title="Toggle Editor / Output"
        >
          {mobileTab === 'editor' ? <Terminal className="w-4 h-4 text-emerald-400" /> : <Code2 className="w-4 h-4 text-blue-400" />}
        </button>
      </div>

    </div>
  );
};
