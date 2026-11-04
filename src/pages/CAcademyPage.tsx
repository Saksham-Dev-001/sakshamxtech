import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Clock, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Code2, 
  ChevronRight, 
  Award,
  ArrowRight,
  Laptop,
  Check,
  Plus,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { CLessonEditorModal } from './admin/ContentEditorModals';
import { CLesson } from '../types';

interface CAcademyPageProps {
  navigate: (path: string) => void;
}

export const CAcademyPage: React.FC<CAcademyPageProps> = ({ navigate }) => {
  const { cLessons, addCLesson, updateCLesson, trackEvent } = useApp();
  const { isAdmin } = useAuth();

  // Inline Admin Modal State
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    data: CLesson | null;
  }>({
    isOpen: false,
    data: null,
  });

  const handleOpenNewModal = () => {
    setEditorModal({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEditModal = (lesson: CLesson, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditorModal({
      isOpen: true,
      data: lesson,
    });
  };

  const handleSaveModal = (data: Partial<CLesson>) => {
    if (editorModal.data && editorModal.data.id) {
      updateCLesson(editorModal.data.id, data);
    } else {
      const nextDay = cLessons.length > 0 ? Math.max(...cLessons.map(l => Number(l.dayNumber) || 0)) + 1 : 1;
      const dayNum = data.dayNumber || nextDay;
      addCLesson({
        dayNumber: dayNum,
        title: data.title || `Day ${dayNum} Lesson`,
        slug: data.slug || `day-${dayNum}-${(data.title || 'lesson').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        summary: data.summary || '',
        durationMinutes: data.durationMinutes || 30,
        content: data.content || `# Day ${dayNum}\n\nLecture notes here.`,
        codeSnippet: data.codeSnippet || '#include <stdio.h>\n\nint main() {\n    return 0;\n}',
        expectedOutput: data.expectedOutput || '',
        youtubeVideoId: data.youtubeVideoId || '',
        practiceQuestions: data.practiceQuestions || [],
        quiz: data.quiz || [],
        isPublished: true,
      });
    }
    setEditorModal({ isOpen: false, data: null });
  };

  return (
    <div className="py-8 sm:py-12 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100">
      <SEOHead
        title="C Programming Academy | Master Systems Programming | SakshamXTech"
        description="Structured 10-day C programming course with hands-on exercises, memory layout deep-dives, video lectures, and interactive coding playground."
      />

      {/* Breadcrumb matching Mockup */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">C Academy</span>
      </div>

      {/* Hero Header Banner matching Mockup Middle-Right */}
      <div className="relative mb-10 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white to-sky-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25 flex items-center justify-center font-black text-xl">
              C
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              C Programming Academy
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Learn C Programming from Basics to Advanced with structured lectures, practice questions and online compiler.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                trackEvent('pageView', `/c-academy/${cLessons[0]?.slug}`);
                navigate(`/c-academy/${cLessons[0]?.slug}`);
              }}
              className="px-6 py-3 rounded-full font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                trackEvent('pageView', '/c-playground');
                navigate('/c-playground');
              }}
              className="px-6 py-3 rounded-full font-bold text-xs bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Open C Playground</span>
            </button>
          </div>
        </div>

        {/* Laptop Code Graphic matching Mockup */}
        <div className="relative w-64 sm:w-80 rounded-2xl bg-slate-950 p-4 border border-slate-800 shadow-2xl font-mono text-xs text-cyan-300 shrink-0">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-400 font-sans ml-2">main.c</span>
          </div>
          <pre className="text-[11px] leading-relaxed text-blue-300">
{`#include <stdio.h>

int main() {
    printf("Hello C!\\n");
    return 0;
}`}
          </pre>
        </div>

      </div>

      {/* 5 Stats Strip matching Mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-xl sm:text-2xl font-black text-blue-600">30+</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Lectures</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-xl sm:text-2xl font-black text-indigo-600">200+</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Practice Questions</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-xl sm:text-2xl font-black text-purple-600">50+</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Programs</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-xl sm:text-2xl font-black text-emerald-600">Quizzes</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">& Tests</p>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm">
          <span className="text-xl sm:text-2xl font-black text-amber-600">Free</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Resources</p>
        </div>
      </div>

      {/* Curriculum Roadmap List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Structured Roadmap: Day 1 to Day {cLessons.length}</span>
          </h2>

          {isAdmin && (
            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lecture</span>
            </button>
          )}
        </div>

        {cLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => {
              trackEvent('pageView', `/c-academy/${lesson.slug}`);
              navigate(`/c-academy/${lesson.slug}`);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-black text-sm flex items-center justify-center shrink-0">
                D{lesson.dayNumber}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Day {lesson.dayNumber}: {lesson.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => handleOpenEditModal(lesson, e)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 z-10"
                  title="Edit lecture"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}

              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{lesson.durationMinutes} mins</span>
              </span>
              <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FULL INLINE ADMIN C LESSON STUDIO MODAL */}
      {editorModal.isOpen && (
        <CLessonEditorModal
          isOpen={editorModal.isOpen}
          onClose={() => setEditorModal({ isOpen: false, data: null })}
          initialData={editorModal.data}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};
