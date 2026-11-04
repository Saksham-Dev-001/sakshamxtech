import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Code2, 
  BookOpen, 
  Briefcase, 
  Gift, 
  Terminal, 
  FolderDown, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/shared/SEOHead';

interface SearchResultsPageProps {
  navigate: (path: string) => void;
  initialQuery?: string;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ navigate, initialQuery = '' }) => {
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

  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const normalized = query.trim().toLowerCase();

  const allItems: {
    id: string;
    title: string;
    description: string;
    category: string;
    badge: string;
    path: string;
    icon: any;
  }[] = [];

  arcadeSolutions.forEach((s) => {
    if (!normalized || s.title.toLowerCase().includes(normalized) || s.labCode.toLowerCase().includes(normalized)) {
      allItems.push({
        id: s.id,
        title: s.title,
        description: `Lab: ${s.labCode} • ${s.difficulty} • ${s.durationMinutes} mins`,
        category: 'arcade',
        badge: 'Arcade Solution',
        path: `/google-arcade/${s.slug}`,
        icon: Sparkles,
      });
    }
  });

  unstopProblems.forEach((p) => {
    if (!normalized || p.title.toLowerCase().includes(normalized) || p.tags.some((t) => t.toLowerCase().includes(normalized))) {
      allItems.push({
        id: p.id,
        title: `Day ${p.dayNumber}: ${p.title}`,
        description: `${p.difficulty} • ${p.tags.join(', ')}`,
        category: 'unstop',
        badge: 'Unstop POTD',
        path: `/unstop/${p.slug}`,
        icon: Code2,
      });
    }
  });

  blogs.forEach((b) => {
    if (!normalized || b.title.toLowerCase().includes(normalized) || b.summary.toLowerCase().includes(normalized)) {
      allItems.push({
        id: b.id,
        title: b.title,
        description: b.summary,
        category: 'blogs',
        badge: 'Tech Blog',
        path: `/blogs/${b.slug}`,
        icon: BookOpen,
      });
    }
  });

  opportunities.forEach((o) => {
    if (!normalized || o.title.toLowerCase().includes(normalized) || o.company.toLowerCase().includes(normalized)) {
      allItems.push({
        id: o.id,
        title: o.title,
        description: `${o.company} • Deadline: ${o.deadline}`,
        category: 'opportunities',
        badge: 'Opportunity',
        path: `/opportunities/${o.slug}`,
        icon: Briefcase,
      });
    }
  });

  cLessons.forEach((l) => {
    if (!normalized || l.title.toLowerCase().includes(normalized) || l.summary.toLowerCase().includes(normalized)) {
      allItems.push({
        id: l.id,
        title: `Day ${l.dayNumber}: ${l.title}`,
        description: l.summary,
        category: 'c-academy',
        badge: 'C Lesson',
        path: `/c-academy/${l.slug}`,
        icon: Terminal,
      });
    }
  });

  const filtered = categoryFilter === 'all' ? allItems : allItems.filter((i) => i.category === categoryFilter);

  return (
    <div className="py-10 max-w-[1440px] xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <SEOHead
        title={`Search results for "${query}" | SakshamXTech`}
        description="Search across Google Cloud Arcade solutions, Unstop POTD, C lessons, opportunities, and swags."
      />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4">
          Search SakshamXTech Ecosystem
        </h1>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, labs, languages, concepts..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {[
          { id: 'all', label: 'All Results' },
          { id: 'arcade', label: 'Arcade Labs' },
          { id: 'unstop', label: 'Unstop POTD' },
          { id: 'blogs', label: 'Blogs' },
          { id: 'opportunities', label: 'Opportunities' },
          { id: 'c-academy', label: 'C Academy' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              categoryFilter === cat.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">No items found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try another search term or clear filters.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 bg-white dark:bg-slate-900 shadow-sm cursor-pointer group transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-cyan-400 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block mb-0.5">{item.badge}</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
