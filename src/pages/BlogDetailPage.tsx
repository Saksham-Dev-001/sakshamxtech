import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  Check, 
  Sparkles,
  ExternalLink,
  Youtube,
  Gift,
  CheckCircle2,
  Award,
  Copy,
  Edit3,
  List,
  ChevronRight,
  Eye,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/shared/SEOHead';
import { formatRealDate, getRelativeTimeString, isBlogPostLive, formatDelhiDateTime } from '../utils/realTime';
import { BlogEditorModal, extractYouTubeVideoId } from './admin/ContentEditorModals';
import { MarkdownArticleReader, extractTableOfContents } from '../components/shared/MarkdownArticleReader';

interface BlogDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug, navigate }) => {
  const { blogs, updateBlog, isBookmarked, toggleBookmark, trackEvent, siteSettings } = useApp();
  const { isAdmin } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedDescLink, setCopiedDescLink] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToc, setShowToc] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  const blog = blogs.find((b) => b.slug === slug) || blogs[0];

  // Scroll reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!blog) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Blog post not found.</p>
        <button
          onClick={() => navigate('/blogs')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs"
        >
          Return to Blogs
        </button>
      </div>
    );
  }

  // If article is scheduled or draft and visitor is NOT admin, show scheduled unlock page
  if (!isBlogPostLive(blog) && !isAdmin) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20 shadow-md">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800 uppercase tracking-wider">
            Scheduled Release
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-2">
            {blog.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            This article is currently scheduled and will automatically unlock across the platform at:
          </p>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 block mb-0.5">Target Release Time:</span>
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono">
              {blog.scheduledAt ? formatDelhiDateTime(blog.scheduledAt) : 'Coming Soon'}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/blogs')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
        >
          ← Browse Other Articles
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(blog.id);
  const cleanVideoId = extractYouTubeVideoId(blog.youtubeVideoId || '');
  const toc = useMemo(() => extractTableOfContents(blog.content), [blog.content]);

  const handleShareLink = async () => {
    const shareUrl = window.location.href;

    // 1. Mobile devices: Native share sheet opens with WhatsApp, Telegram, Instagram, Messages, etc.
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: `${blog.title}\n\n${blog.summary || ''}`,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User simply closed the share sheet
      }
    }

    // 2. PC / Desktop: Direct 1-click clipboard copy
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyYouTubeDescriptionLink = () => {
    const textToCopy = `📌 ${blog.title}\n👉 Official Links & Steps: ${window.location.href}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedDescLink(true);
    setTimeout(() => setCopiedDescLink(false), 2500);
  };

  const youtubeSubscribeUrl = `${siteSettings.socialLinks.youtube}?sub_confirmation=1`;
  const relatedBlogs = blogs.filter((b) => b.id !== blog.id).slice(0, 3);

  // Determine official action link
  const hasOfficialLink = Boolean(blog.officialLink && blog.officialLink.startsWith('http'));
  const officialActionLink = hasOfficialLink 
    ? blog.officialLink 
    : (cleanVideoId ? `https://www.youtube.com/watch?v=${cleanVideoId}` : siteSettings.socialLinks.youtube);

  const officialActionLabel = blog.officialLinkLabel || (hasOfficialLink ? 'Visit Official Portal ↗' : 'Watch Video Guide ↗');

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <SEOHead
        title={`${blog.title} | SakshamXTech`}
        description={blog.summary || blog.content.slice(0, 160)}
        canonicalPath={`/blogs/${blog.slug}`}
        image={blog.coverImage}
      />

      {/* TOP READING PROGRESS BAR (FIXED HEADER STRIP) */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* ADMIN PREVIEW BANNER FOR SCHEDULED / DRAFT POSTS */}
      {isAdmin && !isBlogPostLive(blog) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-lg border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-black text-purple-200">
                🛡️ Admin Live Preview Mode
              </p>
              <p className="text-[11px] text-purple-300/90">
                {blog.status === 'draft'
                  ? 'This article is currently saved as an unpublished draft.'
                  : `Scheduled to unlock publicly on ${blog.scheduledAt ? formatDelhiDateTime(blog.scheduledAt) : 'scheduled date'}. Visitors cannot see this yet.`}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[10px] font-black uppercase tracking-wider shrink-0">
            {blog.status === 'draft' ? 'Draft' : 'Scheduled'}
          </span>
        </div>
      )}

      {/* 1. TOP BREADCRUMB & READER CONTROLS BAR */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => navigate('/blogs')}
          className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 font-semibold transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Technical Blogs</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-102 cursor-pointer"
              title="Edit this article in Admin Studio"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Article</span>
            </button>
          )}

          <button
            onClick={() => toggleBookmark(blog.id)}
            className={`p-2 rounded-xl border text-xs transition-colors shadow-2xs cursor-pointer ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-500/50 dark:text-amber-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Bookmark article"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleShareLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs shadow-2xs transition-all cursor-pointer ${
              copiedLink
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold scale-105'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Share article (Mobile share options / PC 1-click copy)"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="font-semibold">{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 2. ARTICLE HERO HEADER */}
      <div className="space-y-4">
        {/* Category & Metadata Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/80 dark:border-blue-500/40 dark:text-cyan-300">
            {blog.category}
          </span>

          {cleanVideoId && (
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/80 dark:border-red-800 dark:text-red-300 flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-600" />
              <span>Video Guide Included</span>
            </span>
          )}

          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{blog.readTimeMinutes} min read</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            {formatRealDate(blog.publishedAt)} ({getRelativeTimeString(blog.publishedAt)})
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          {blog.title}
        </h1>

        {/* Short Summary / Excerpt */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {blog.summary}
        </p>

        {/* Author Card & Admin YouTube Tool */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/80 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={blog.author?.avatar || siteSettings.creatorAvatarUrl || '/assets/branding/saksham_avatar.png'}
                alt={blog.author?.name || siteSettings.creatorName}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-500/40 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/branding/saksham_avatar.png';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] shadow-xs">
                ✓
              </span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{blog.author?.name || siteSettings.creatorName}</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {blog.author?.role || 'Founder of SakshamXTech & Tech Creator'}
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={handleCopyYouTubeDescriptionLink}
              className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/50 text-xs font-bold text-blue-700 dark:text-cyan-300 hover:bg-blue-100 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Admin Tool: Copy formatted link to paste in YouTube Description"
            >
              {copiedDescLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDescLink ? 'Copied For Video Description!' : 'Copy For YouTube Description'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. OFFICIAL PROGRAM FAST-TRACK BAR (ONLY WHEN OFFICIAL LINK OR SPECIAL DETAILS ARE PRESENT) */}
      {(hasOfficialLink || blog.deadline || blog.perks) && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/10 via-indigo-950/10 to-purple-950/10 dark:from-slate-900 dark:to-blue-950/40 border border-blue-500/30 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Official Program Resource Portal</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Official registration links &amp; program requirements referenced in this guide.
                </p>
              </div>
            </div>

            {hasOfficialLink && (
              <a
                href={officialActionLink}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('opportunity', blog.title, { pagePath: `/blogs/${blog.slug}` })}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-102 cursor-pointer shrink-0"
              >
                <span>{officialActionLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Metadata badges (Only shown if custom data exists) */}
          {(blog.deadline || blog.perks || blog.eligibility) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {blog.deadline && (
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Registration Deadline</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white block">{blog.deadline}</span>
                </div>
              )}

              {blog.perks && (
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-0.5 flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    <span>Swags &amp; Perks</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white block">{blog.perks}</span>
                </div>
              )}

              {blog.eligibility && (
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block mb-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>Eligibility</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white block">{blog.eligibility}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. VIDEO EMBED PLAYER (OR COVER IMAGE) */}
      {cleanVideoId && cleanVideoId.length === 11 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Youtube className="w-4 h-4 text-red-600" />
              <span>Video Tutorial Walkthrough</span>
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${cleanVideoId}`}
              target="_blank"
              rel="noreferrer"
              className="text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Watch on YouTube ↗</span>
            </a>
          </div>

          <div className="aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${cleanVideoId}?autoplay=0&rel=0`}
              title={blog.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : blog.coverImage ? (
        <div className="aspect-[21/9] sm:aspect-[16/7] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-900">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>
      ) : null}

      {/* 5. INTERACTIVE TABLE OF CONTENTS (IF HEADINGS EXIST) */}
      {toc.length >= 2 && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-5 shadow-2xs space-y-3">
          <div 
            onClick={() => setShowToc(!showToc)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Table of Contents &amp; Quick Navigation
              </h3>
            </div>
            <span className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline">
              {showToc ? 'Collapse' : 'Expand'}
            </span>
          </div>

          {showToc && (
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {toc.map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.id}`}
                  className="flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-white dark:hover:bg-slate-800/80 transition-colors"
                >
                  <span className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate font-medium">{item.text}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. PRIMARY ARTICLE CONTENT - POWERED BY MARKDOWN READER */}
      <div className="p-6 sm:p-10 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <MarkdownArticleReader content={blog.content} />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
            {blog.tags.map((t) => (
              <span
                key={t}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 6.5 SOCIAL SHARING BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Share this guide with friends &amp; batchmates
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Help fellow learners discover verified solutions and swags
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${blog.title}*\nRead full guide on SakshamXTech: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>WhatsApp</span>
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(`🔥 ${blog.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Telegram</span>
          </a>
          <button
            onClick={handleShareLink}
            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* 7. CREATOR COMMUNITY END-CARD */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={siteSettings.creatorAvatarUrl || '/assets/branding/saksham_avatar.png'}
            alt={siteSettings.creatorName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-md shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/branding/saksham_avatar.png';
            }}
          />
          <div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5 justify-center sm:justify-start">
              <span>Saksham Sharma</span>
              <span className="text-blue-500">✓</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Founder of SakshamXTech • YouTube Tech Creator &amp; Cloud Mentor
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Need help with this lab or program? Ask in our YouTube comments or join our official student community!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={siteSettings.socialLinks.telegram}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors shadow-2xs"
          >
            Telegram Group
          </a>
          <a
            href={youtubeSubscribeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all hover:scale-102 flex items-center gap-1.5"
          >
            <Youtube className="w-3.5 h-3.5 fill-white" />
            <span>Subscribe</span>
          </a>
        </div>
      </div>

      {/* 8. RELATED BLOGS & RECOMMENDATIONS */}
      {relatedBlogs.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>More Recommended Articles &amp; Guides</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedBlogs.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  navigate(`/blogs/${rel.slug}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 cursor-pointer group transition-all bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 block mb-1 uppercase tracking-wider">
                    {rel.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <span>{rel.readTimeMinutes} min read</span>
                  <span className="text-blue-600 dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read ➔
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN INLINE STUDIO MODAL */}
      {isEditModalOpen && (
        <BlogEditorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={blog}
          onSave={(updated) => {
            updateBlog(blog.id, updated);
            setIsEditModalOpen(false);
            if (updated.slug && updated.slug !== blog.slug) {
              navigate(`/blogs/${updated.slug}`);
            }
          }}
          creatorName={siteSettings.creatorName}
          creatorRole={siteSettings.creatorTitle}
          creatorAvatar={siteSettings.creatorAvatarUrl}
        />
      )}
    </div>
  );
};
