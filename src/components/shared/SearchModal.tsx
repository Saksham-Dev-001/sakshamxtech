import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Code2, 
  BookOpen, 
  Briefcase, 
  Gift, 
  Terminal, 
  FolderDown, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, navigate }) => {
  const { 
    arcadeSolutions, 
    unstopProblems, 
    blogs, 
    opportunities, 
    swags, 
    cLessons, 
    resources, 
    trackEvent 
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  // Aggregate searchable items
  interface SearchResultItem {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    path: string;
    icon: any;
    accentColor: string;
  }

  const results: SearchResultItem[] = [];

  // 1. Arcade solutions
  arcadeSolutions.forEach((sol) => {
    if (
      !normalizedQuery ||
      sol.title.toLowerCase().includes(normalizedQuery) ||
      sol.labCode.toLowerCase().includes(normalizedQuery) ||
      sol.description.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        id: sol.id,
        title: sol.title,
        subtitle: `Lab: ${sol.labCode} • ${sol.difficulty} • ${sol.durationMinutes}m`,
        category: 'arcade',
        path: `/google-arcade/${sol.slug}`,
        icon: Sparkles,
        accentColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
      });
    }
  });

  // 2. Unstop POTD
  unstopProblems.forEach((prob) => {
    if (
      !normalizedQuery ||
      prob.title.toLowerCase().includes(normalizedQuery) ||
      prob.description.toLowerCase().includes(normalizedQuery) ||
      prob.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
    ) {
      results.push({
        id: prob.id,
        title: `Day ${prob.dayNumber}: ${prob.title}`,
        subtitle: `${prob.difficulty} • ${prob.tags.slice(0, 3).join(', ')}`,
        category: 'unstop',
        path: `/unstop/${prob.slug}`,
        icon: Code2,
        accentColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
      });
    }
  });

  // 3. Blogs
  blogs.forEach((blog) => {
    if (
      !normalizedQuery ||
      blog.title.toLowerCase().includes(normalizedQuery) ||
      blog.summary.toLowerCase().includes(normalizedQuery) ||
      blog.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
    ) {
      results.push({
        id: blog.id,
        title: blog.title,
        subtitle: `${blog.category} • ${blog.readTimeMinutes} min read`,
        category: 'blogs',
        path: `/blogs/${blog.slug}`,
        icon: BookOpen,
        accentColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30',
      });
    }
  });

  // 4. Opportunities
  opportunities.forEach((opp) => {
    if (
      !normalizedQuery ||
      opp.title.toLowerCase().includes(normalizedQuery) ||
      opp.company.toLowerCase().includes(normalizedQuery) ||
      opp.category.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        id: opp.id,
        title: opp.title,
        subtitle: `${opp.company} • ${opp.category} • Deadline: ${opp.deadline}`,
        category: 'opportunities',
        path: `/opportunities/${opp.slug}`,
        icon: Briefcase,
        accentColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
      });
    }
  });

  // 5. Swags
  swags.forEach((swag) => {
    if (
      !normalizedQuery ||
      swag.title.toLowerCase().includes(normalizedQuery) ||
      swag.brand.toLowerCase().includes(normalizedQuery) ||
      swag.description.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        id: swag.id,
        title: swag.title,
        subtitle: `${swag.brand} • ${swag.category}`,
        category: 'swags',
        path: `/swags`,
        icon: Gift,
        accentColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
      });
    }
  });

  // 6. C Lessons
  cLessons.forEach((lesson) => {
    if (
      !normalizedQuery ||
      lesson.title.toLowerCase().includes(normalizedQuery) ||
      lesson.summary.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        id: lesson.id,
        title: `Day ${lesson.dayNumber}: ${lesson.title}`,
        subtitle: `${lesson.durationMinutes} mins • Hands-on practice`,
        category: 'c-academy',
        path: `/c-academy/${lesson.slug}`,
        icon: Terminal,
        accentColor: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
      });
    }
  });

  // 7. Resources
  resources.forEach((res) => {
    if (
      !normalizedQuery ||
      res.title.toLowerCase().includes(normalizedQuery) ||
      res.description.toLowerCase().includes(normalizedQuery) ||
      res.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
    ) {
      results.push({
        id: res.id,
        title: res.title,
        subtitle: `${res.category} • ${res.fileSize} • ${res.format}`,
        category: 'resources',
        path: `/resources`,
        icon: FolderDown,
        accentColor: 'text-teal-400 bg-teal-950/60 border-teal-500/30',
      });
    }
  });

  const filteredResults =
    selectedCategory === 'all'
      ? results
      : results.filter((r) => r.category === selectedCategory);

  const handleSelect = (item: SearchResultItem) => {
    if (normalizedQuery) {
      trackEvent('search', normalizedQuery);
    }
    navigate(item.path);
    onClose();
  };

  const categories = [
    { id: 'all', label: 'All Results' },
    { id: 'arcade', label: 'Google Arcade' },
    { id: 'unstop', label: 'Unstop POTD' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'swags', label: 'Free Swags' },
    { id: 'c-academy', label: 'C Academy' },
    { id: 'resources', label: 'Resources' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/80 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search arcade labs, unstop POTD, C lessons, swags, internships..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs px-2 py-1"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[50vh] overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-800/40">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for "load balancer", "Day 1", "swag", or "internship".
              </p>
            </div>
          ) : (
            filteredResults.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/70 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.accentColor}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Found {filteredResults.length} matching resources</span>
          <span className="flex items-center gap-1 text-cyan-400 font-semibold cursor-pointer" onClick={() => { navigate('/search?q=' + encodeURIComponent(query)); onClose(); }}>
            View Full Search Page <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
