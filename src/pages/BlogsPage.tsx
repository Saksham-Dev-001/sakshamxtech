import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  Eye, 
  ArrowRight, 
  ChevronRight,
  Play, 
  Youtube, 
  FileText,
  Plus,
  Edit3,
  Sparkles,
  ExternalLink,
  X,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { formatRealDate, isBlogPostLive } from '../utils/realTime';
import { BlogEditorModal, extractYouTubeVideoId } from './admin/ContentEditorModals';
import { BlogPost } from '../types';

interface BlogsPageProps {
  navigate: (path: string) => void;
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Google Cloud': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'Programming': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'Artificial Intelligence': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80',
  'Career': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  'Tutorials': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
};

export const BlogsPage: React.FC<BlogsPageProps> = ({ navigate }) => {
  const { blogs, addBlog, updateBlog, trackEvent, siteSettings } = useApp();
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Studio Modal State for Direct In-Page Creation & Editing
  const [editorModal, setEditorModal] = useState<{
    isOpen: boolean;
    data: BlogPost | null;
  }>({
    isOpen: false,
    data: null,
  });

  const categories = ['All', 'Google Cloud', 'Programming', 'Career', 'Tutorials'];

  // Safe thumbnail resolver guaranteeing user photos and YouTube thumbnails take top priority
  const getBlogThumbnail = (blog: BlogPost) => {
    // 1. If blog has a custom photo / coverImage (and not the generic default earth placeholder):
    if (
      blog.coverImage && 
      blog.coverImage.trim() && 
      !blog.coverImage.includes('photo-1451187580459-43490279c0fa') &&
      !blog.coverImage.includes('placeholder')
    ) {
      return blog.coverImage.trim();
    }
    // 2. If a YouTube video is linked, use its real HQ thumbnail:
    const cleanVid = extractYouTubeVideoId(blog.youtubeVideoId || '');
    if (cleanVid && cleanVid.length === 11) {
      return `https://i.ytimg.com/vi/${cleanVid}/hqdefault.jpg`;
    }
    // 3. Fallback to coverImage if available:
    if (blog.coverImage && blog.coverImage.trim()) {
      return blog.coverImage.trim();
    }
    return CATEGORY_FALLBACK_IMAGES[blog.category] || CATEGORY_FALLBACK_IMAGES['Google Cloud'];
  };

  const visibleBlogs = useMemo(() => {
    return blogs.filter((b) => {
      // Visitors only see live published posts. Admins can preview drafts & scheduled posts.
      if (!isAdmin && !isBlogPostLive(b)) {
        return false;
      }
      return true;
    });
  }, [blogs, isAdmin]);

  const filteredBlogs = useMemo(() => {
    return visibleBlogs.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCat = 
        selectedCategory === 'All' || 
        b.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase())));

      return matchesSearch && matchesCat;
    });
  }, [visibleBlogs, searchQuery, selectedCategory]);

  // Featured Hero Article Spotlight (shown when viewing All and no search query)
  const featuredArticle = useMemo(() => {
    if (searchQuery.trim() || selectedCategory !== 'All' || filteredBlogs.length === 0) {
      return null;
    }
    return filteredBlogs.find((b) => b.featured) || filteredBlogs[0];
  }, [filteredBlogs, searchQuery, selectedCategory]);

  // Remaining articles for the grid
  const gridArticles = useMemo(() => {
    if (!featuredArticle) return filteredBlogs;
    return filteredBlogs.filter((b) => b.id !== featuredArticle.id);
  }, [filteredBlogs, featuredArticle]);

  // Category counts
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return visibleBlogs.length;
    return visibleBlogs.filter((b) => 
      b.category.toLowerCase().includes(cat.toLowerCase()) ||
      (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(cat.toLowerCase())))
    ).length;
  };

  const handleOpenNewModal = () => {
    setEditorModal({
      isOpen: true,
      data: null,
    });
  };

  const handleOpenEditModal = (blog: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditorModal({
      isOpen: true,
      data: blog,
    });
  };

  const handleSaveModal = (data: Omit<BlogPost, 'id'> | BlogPost) => {
    if (editorModal.data && 'id' in editorModal.data) {
      updateBlog(editorModal.data.id, data);
    } else {
      addBlog(data as Omit<BlogPost, 'id'>);
    }
    setEditorModal({ isOpen: false, data: null });
  };

  return (
    <div className="py-6 sm:py-10 max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-slate-900 dark:text-slate-100">
      <SEOHead
        title="Technical Blogs & Official Guides | SakshamXTech"
        description="In-depth tutorials, Google Cloud Arcade blueprints, C programming deep dives, and verified registration links from Saksham Sharma."
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-bold">Tech Blogs</span>
      </div>

      {/* Main Page Header */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Tech Blogs &amp; Guides
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Direct access to official registration forms, Google Cloud Arcade strategies, and step-by-step code walkthroughs by Saksham Sharma.
          </p>
        </div>

        {/* Right Action Row: Search + Admin Write Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, topics, tags..."
              maxLength={120}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenNewModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Write Article</span>
              <span className="sm:hidden">New</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills with Dynamic Counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => {
          const count = getCategoryCount(cat);
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* FEATURED HERO SPOTLIGHT ARTICLE (When Viewing All) */}
      {featuredArticle && (
        <div className="mb-10">
          <div 
            onClick={() => {
              trackEvent('pageView', `/blogs/${featuredArticle.slug}`);
              navigate(`/blogs/${featuredArticle.slug}`);
            }}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
          >
            {/* Visual Media Column (5 cols) */}
            <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-950">
              <img
                src={getBlogThumbnail(featuredArticle)}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK_IMAGES[featuredArticle.category] || CATEGORY_FALLBACK_IMAGES['Google Cloud'];
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
              
              {/* Featured Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Featured Guide
                </span>
              </div>

              {/* Video Play Indicator */}
              {featuredArticle.youtubeVideoId && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-600 transition-all">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              )}
            </div>

            {/* Editorial Content Column (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {featuredArticle.category}
                  </span>
                  
                  {featuredArticle.officialLink && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      ✓ Official Program Link Included
                    </span>
                  )}

                  {isAdmin && (
                    <button
                      onClick={(e) => handleOpenEditModal(featuredArticle, e)}
                      className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Article</span>
                    </button>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {featuredArticle.summary}
                </p>
              </div>

              {/* Author & Actions Row */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredArticle.author?.avatar || siteSettings.creatorAvatarUrl}
                    alt={featuredArticle.author?.name || siteSettings.creatorName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {featuredArticle.author?.name || siteSettings.creatorName}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatRealDate(featuredArticle.publishedAt)}</span>
                      <span>•</span>
                      <span>{featuredArticle.readTimeMinutes} min read</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Sub-heading */}
      {featuredArticle && gridArticles.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Latest Articles &amp; Tutorials</span>
            <span className="text-xs font-mono font-normal text-slate-400">({gridArticles.length})</span>
          </h3>
        </div>
      )}

      {/* EMPTY SEARCH / FILTER STATE */}
      {filteredBlogs.length === 0 && (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No articles found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            We couldn't find any articles matching your search or selected category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* BLOGS 3-COLUMN ARTICLE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gridArticles.map((blog) => (
          <div
            key={blog.id}
            onClick={() => {
              trackEvent('pageView', `/blogs/${blog.slug}`);
              navigate(`/blogs/${blog.slug}`);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Admin Preview Status Indicator */}
              {isAdmin && !isBlogPostLive(blog) && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-purple-200" />
                    <span>Scheduled Release</span>
                  </span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                    Admin Preview
                  </span>
                </div>
              )}
              {isAdmin && blog.status === 'draft' && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-amber-200" />
                    <span>Draft</span>
                  </span>
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                    Admin Only
                  </span>
                </div>
              )}

              {/* Crisp Card Thumbnail (Guaranteed No Gray Placeholder) */}
              <div className="aspect-[16/9] overflow-hidden bg-slate-950 relative">
                <img
                  src={getBlogThumbnail(blog)}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = CATEGORY_FALLBACK_IMAGES[blog.category] || CATEGORY_FALLBACK_IMAGES['Google Cloud'];
                  }}
                />

                {/* Floating Category Pill */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 shadow-sm">
                  {blog.category}
                </span>

                {/* Video Play Badge if Video Attached */}
                {blog.youtubeVideoId && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Admin Quick Edit Shortcut Button */}
                {isAdmin && (
                  <button
                    onClick={(e) => handleOpenEditModal(blog, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/80 hover:bg-blue-600 text-white backdrop-blur-md border border-white/20 shadow-md transition-colors cursor-pointer"
                    title="Edit article"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-2.5">
                {blog.officialLink && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      ✓ Official Link Included
                    </span>
                    {blog.deadline && (
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        • {blog.deadline}
                      </span>
                    )}
                  </div>
                )}

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {blog.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {blog.summary}
                </p>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formatRealDate(blog.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {(blog.views || 0).toLocaleString()} views
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {blog.readTimeMinutes} min read
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FULL INLINE ADMIN BLOG STUDIO MODAL */}
      {editorModal.isOpen && (
        <BlogEditorModal
          isOpen={editorModal.isOpen}
          onClose={() => setEditorModal({ isOpen: false, data: null })}
          initialData={editorModal.data}
          onSave={handleSaveModal}
          creatorName={siteSettings.creatorName}
          creatorRole={siteSettings.creatorTitle}
          creatorAvatar={siteSettings.creatorAvatarUrl}
        />
      )}
    </div>
  );
};
