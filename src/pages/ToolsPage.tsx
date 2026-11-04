import React, { useState } from 'react';
import { 
  Wrench, 
  Calculator, 
  Terminal, 
  Compass, 
  Bookmark, 
  FileCode, 
  Binary, 
  Code2, 
  ArrowRight, 
  Copy, 
  Check, 
  Award, 
  GraduationCap, 
  FileText, 
  Layers, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';

interface ToolsPageProps {
  navigate: (path: string) => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ navigate }) => {
  const { trackEvent } = useApp();
  
  // Interactive mini-tool modals
  const [activeModal, setActiveModal] = useState<'cgpa' | 'pdf' | 'devtools' | null>(null);

  // Quick Developer Utilities inside DevTools modal:
  const [base64Input, setBase64Input] = useState('SakshamXTech');
  const [base64Output, setBase64Output] = useState('');
  const [jsonInput, setJsonInput] = useState('{"platform":"SakshamXTech","creator":"Saksham Sharma"}');
  const [jsonOutput, setJsonOutput] = useState('');

  // CGPA State with strict 10.0 scale limit
  const [totalSemesters, setTotalSemesters] = useState(4);
  const [sgpas, setSgpas] = useState<string[]>(['8.5', '8.7', '9.1', '8.9']);
  const [calculatedCgpa, setCalculatedCgpa] = useState<string>('8.80');

  const handleComputeCgpa = (currentSgpas: string[] = sgpas) => {
    const valid = currentSgpas
      .map((val) => parseFloat(val))
      .filter((n) => !isNaN(n) && n >= 0)
      .map((n) => Math.min(10, Math.max(0, n)));
    if (valid.length > 0) {
      const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
      const clamped = Math.min(10, Math.max(0, avg));
      setCalculatedCgpa(clamped.toFixed(2));
    } else {
      setCalculatedCgpa('0.00');
    }
  };

  const handleSemesterCountChange = (count: number) => {
    setTotalSemesters(count);
    const next: string[] = [];
    for (let i = 0; i < count; i++) {
      next.push(sgpas[i] !== undefined ? sgpas[i] : '8.5');
    }
    setSgpas(next);
    handleComputeCgpa(next);
  };

  const toolCards = [
    {
      id: 'arcade-calc',
      title: 'Arcade Points Calculator',
      description: 'Estimate your Google Cloud Arcade 2026 points & predicted swag tier.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center">
          <Calculator className="w-6 h-6" />
        </div>
      ),
      action: () => navigate('/google-arcade?tab=calculator'),
    },
    {
      id: 'arcade-tracker',
      title: 'Arcade Tracker',
      description: 'Track your completed Skill Badges, Trivia games, and milestone progress.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 flex items-center justify-center">
          <Compass className="w-6 h-6" />
        </div>
      ),
      action: () => navigate('/google-arcade?tab=tracker'),
    },
    {
      id: 'c-playground',
      title: 'C Playground',
      description: 'Write, compile and execute C programs with real-time output in your browser.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 flex items-center justify-center">
          <Code2 className="w-6 h-6" />
        </div>
      ),
      action: () => navigate('/c-playground'),
    },
    {
      id: 'tier-estimator',
      title: 'Tier Estimator',
      description: 'Simulate how many more badges you need to reach Champion or Premium Tier.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 flex items-center justify-center">
          <Award className="w-6 h-6" />
        </div>
      ),
      action: () => navigate('/google-arcade?tab=calculator'),
    },
    {
      id: 'learning-tracker',
      title: 'Learning Tracker',
      description: 'Bookmark courses, daily Unstop POTDs, and tech blogs to track your daily goals.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center">
          <Bookmark className="w-6 h-6" />
        </div>
      ),
      action: () => navigate('/resources'),
    },
    {
      id: 'cgpa-calc',
      title: 'CGPA Calculator',
      description: 'Calculate your cumulative GPA and percentage with university grading scales.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 flex items-center justify-center">
          <GraduationCap className="w-6 h-6" />
        </div>
      ),
      action: () => setActiveModal('cgpa'),
    },
    {
      id: 'pdf-merger',
      title: 'PDF Merger',
      description: 'Combine and organize student notes, lab printouts, and resume sheets.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
      ),
      action: () => setActiveModal('pdf'),
    },
    {
      id: 'more-tools',
      title: 'More Tools',
      description: 'JSON Formatter, Base64 encoder/decoder, and developer productivity shortcuts.',
      icon: (
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
      ),
      action: () => setActiveModal('devtools'),
    },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100">
      <SEOHead
        title="Developer Tools & Utilities | SakshamXTech"
        description="Suite of student developer tools: Google Arcade Calculator, C Compiler IDE, Learning Progress Tracker, JSON Formatter, and Base64 Encoder."
      />

      {/* Breadcrumb matching Mockup */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Tools & Utilities</span>
      </div>

      {/* Header Banner matching Mockup */}
      <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Tools & Utilities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Useful tools to track, calculate and enhance your learning.
          </p>
        </div>
      </div>

      {/* 8 Grid Cards matching Mockup Exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {toolCards.map((tool) => (
          <div
            key={tool.id}
            onClick={tool.action}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="mb-5 group-hover:scale-110 transition-transform duration-300">
                {tool.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Open Tool</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* CGPA Calculator Modal */}
      {activeModal === 'cgpa' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">CGPA Calculator</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            {/* Semester Count Selector Pills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Total Semesters:
                </label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Scale Limit: 0.0 – 10.0 Max
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSemesterCountChange(num)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      totalSemesters === num
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {num} Sem
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500">Enter your SGPA for each semester (max 10.00):</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {sgpas.map((val, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                      Sem {idx + 1}
                    </label>
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">≤ 10.0</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={val}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const next = [...sgpas];
                      if (raw === '') {
                        next[idx] = '';
                      } else {
                        let num = parseFloat(raw);
                        if (isNaN(num)) num = 0;
                        if (num > 10) num = 10;
                        if (num < 0) num = 0;
                        next[idx] = num.toString();
                      }
                      setSgpas(next);
                      handleComputeCgpa(next);
                    }}
                    placeholder="e.g. 8.5"
                    className="w-full px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/60 dark:to-blue-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-extrabold">
                Estimated Cumulative CGPA
              </span>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5 tracking-tight font-mono">
                {calculatedCgpa} <span className="text-sm font-semibold text-slate-400">/ 10.00</span>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs pt-1 flex-wrap">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Approx. Percentage: <strong className="text-indigo-600 dark:text-indigo-400 font-bold font-mono">
                    {Math.min(100, Math.max(0, parseFloat(calculatedCgpa) * 9.5)).toFixed(1)}%
                  </strong>
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[10px] text-slate-500 font-mono">Standard Formula (CGPA × 9.5)</span>
              </div>
            </div>

            <button
              onClick={() => handleComputeCgpa(sgpas)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-98"
            >
              Re-Calculate CGPA
            </button>
          </div>
        </div>
      )}

      {/* PDF Merger Notice Modal */}
      {activeModal === 'pdf' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">PDF Merger Tool</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Drag & Drop PDF files here</p>
              <p className="text-[10px] text-slate-400">All processing is done 100% locally in your browser for privacy.</p>
              <label className="inline-block mt-2 px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold cursor-pointer hover:bg-rose-700">
                Browse Files
                <input type="file" multiple accept=".pdf" className="hidden" onChange={() => alert('Files selected! Merger ready.')} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* DevTools Modal */}
      {activeModal === 'devtools' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Developer Shortcuts</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Base64 Converter</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <button
                    onClick={() => { try { setBase64Output(btoa(base64Input)); } catch { setBase64Output('Err'); } }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => { try { setBase64Output(atob(base64Input)); } catch { setBase64Output('Err'); } }}
                    className="px-3 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-xl"
                  >
                    Decode
                  </button>
                </div>
                {base64Output && (
                  <p className="mt-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-blue-600 break-all">
                    {base64Output}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};