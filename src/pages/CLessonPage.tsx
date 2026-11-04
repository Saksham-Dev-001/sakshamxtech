import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Terminal, 
  Clock, 
  Play, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  ChevronRight,
  Code2,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { MarkdownArticleReader } from '../components/shared/MarkdownArticleReader';
import { CLessonEditorModal } from './admin/ContentEditorModals';

interface CLessonPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const CLessonPage: React.FC<CLessonPageProps> = ({ slug, navigate }) => {
  const { cLessons, updateCLesson, trackEvent } = useApp();
  const { isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showSolutionIdx, setShowSolutionIdx] = useState<number | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const lesson = cLessons.find((l) => l.slug === slug) || cLessons[0];
  const currentIndex = cLessons.findIndex((l) => l.slug === lesson.slug);
  const prevLesson = currentIndex > 0 ? cLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < cLessons.length - 1 ? cLessons[currentIndex + 1] : null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lesson.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInPlayground = () => {
    localStorage.setItem('sakshamxtech_playground_code', lesson.codeSnippet);
    trackEvent('pageView', '/c-playground');
    navigate('/c-playground');
  };

  const handleQuizAnswer = (qIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`Day ${lesson.dayNumber}: ${lesson.title} | C Academy SakshamXTech`}
        description={lesson.summary}
      />

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/c-academy')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Curriculum</span>
        </button>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Edit Lecture"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Lecture</span>
            </button>
          )}

          <span className="text-xs text-blue-600 dark:text-purple-400 font-mono font-bold">
            Lesson {lesson.dayNumber} of {cLessons.length}
          </span>
        </div>
      </div>

      {/* Lesson Title Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-purple-500/20 bg-white dark:bg-slate-950/90 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-black bg-blue-50 text-blue-700 border border-blue-200 dark:bg-purple-950 dark:border-purple-500/40 dark:text-purple-300">
            Day {lesson.dayNumber}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lesson.durationMinutes} mins lecture
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {lesson.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {lesson.summary}
        </p>

        {/* Video Banner Callout */}
        <div className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:border dark:border-red-500/40 dark:text-red-400 flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Full Video Lecture Available</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Watch the accompanying SakshamXTech masterclass on YouTube.</p>
            </div>
          </div>
          <a
            href={`https://youtube.com/watch?v=${lesson.youtubeVideoId}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('youtube', `C Masterclass: ${lesson.title}`, {
              videoId: lesson.youtubeVideoId,
              videoTitle: lesson.title,
              pagePath: `/c-academy/${lesson.slug}`
            })}
            className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shrink-0 shadow-sm"
          >
            Watch Video
          </a>
        </div>
      </div>

      {/* Lesson Text Content */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 bg-white dark:bg-slate-900 shadow-sm">
        <MarkdownArticleReader content={lesson.content} />
      </div>

      {/* Code Snippet & Interactive Compiler Runner */}
      <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-10 shadow-sm bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>main.c (Hands-on Example)</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInPlayground}
              className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Run in Playground</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1 border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <pre className="p-4 bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
          <code>{lesson.codeSnippet}</code>
        </pre>

        {lesson.expectedOutput && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="text-slate-500 block mb-0.5 font-sans font-bold">Expected Stdout:</span>
            <span className="text-emerald-400">{lesson.expectedOutput}</span>
          </div>
        )}
      </div>

      {/* Practice Questions Section */}
      {lesson.practiceQuestions && lesson.practiceQuestions.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>Practice Exercises</span>
          </h3>

          {lesson.practiceQuestions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Exercise {idx + 1}: {q.question}
              </p>
              {q.hint && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400/90 italic">
                  💡 Hint: {q.hint}
                </p>
              )}
              <button
                onClick={() => setShowSolutionIdx(showSolutionIdx === idx ? null : idx)}
                className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
              >
                {showSolutionIdx === idx ? 'Hide Solution' : 'Reveal Solution Code'}
              </button>

              {showSolutionIdx === idx && (
                <pre className="p-3 bg-slate-950 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto mt-2">
                  <code>{q.solutionCode}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interactive Quiz */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 mb-10 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Test Your Understanding (Day {lesson.dayNumber} Quiz)</span>
          </h3>

          {lesson.quiz.map((item, qIdx) => {
            const hasAnswered = selectedAnswers[qIdx] !== undefined;
            const chosen = selectedAnswers[qIdx];
            const isCorrect = chosen === item.correctIndex;

            return (
              <div key={qIdx} className="space-y-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="text-xs font-bold text-slate-200">
                  {qIdx + 1}. {item.question}
                </p>

                <div className="space-y-2">
                  {item.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (hasAnswered) {
                      if (optIdx === item.correctIndex) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                      } else if (chosen === optIdx) {
                        btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleQuizAnswer(qIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && optIdx === item.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {hasAnswered && chosen === optIdx && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <p className="text-[11px] text-slate-400 pt-1">
                    <strong className={isCorrect ? 'text-emerald-400' : 'text-amber-400'}>
                      {isCorrect ? 'Correct!' : 'Explanation:'}
                    </strong>{' '}
                    {item.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        {prevLesson ? (
          <button
            onClick={() => {
              navigate(`/c-academy/${prevLesson.slug}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Day {prevLesson.dayNumber}: {prevLesson.title}</span>
          </button>
        ) : <div />}

        {nextLesson ? (
          <button
            onClick={() => {
              navigate(`/c-academy/${nextLesson.slug}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-500/20"
          >
            <span>Next: Day {nextLesson.dayNumber}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : <div />}
      </div>

      {/* INLINE ADMIN C LESSON STUDIO MODAL */}
      {isEditOpen && (
        <CLessonEditorModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={lesson}
          onSave={(data) => {
            updateCLesson(lesson.id, data);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
};
