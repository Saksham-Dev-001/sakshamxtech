import { createPortal } from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  X,
  Youtube,
  Play,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Sparkles,
  BookOpen,
  FileText,
  Code2,
  Terminal,
  Award,
  Briefcase,
  Calendar,
  Clock,
  Tag,
  HelpCircle,
  Eye,
  Gift,
  Download,
  Flame,
  CheckCircle2,
  Share2,
  FolderOpen
} from 'lucide-react';
import {
  BlogPost,
  ArcadeSolution,
  UnstopProblem,
  Opportunity,
  SwagItem,
  CLesson,
  ResourceItem,
} from '../../types';
import { formatCleanDateTime, formatDelhiDateTime, getDelhiCurrentDateTimeLocal, getTodayISODate, formatLocalDateIso, getSiteOrigin } from '../../utils/realTime';
import { MarkdownArticleReader } from '../../components/shared/MarkdownArticleReader';

// ============================================================================
// REUSABLE HELPER UTILITIES & SUBCOMPONENTS
// ============================================================================

export const extractYouTubeVideoId = (input: string): string => {
  if (!input) return '';
  const trimmed = input.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return '';
};

interface StudioTopBarProps {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  saveLabel?: string;
}

const StudioTopBar: React.FC<StudioTopBarProps> = ({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  onClose,
  onSave,
  saveLabel = 'Save & Publish',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 shadow-xs w-full max-w-full overflow-hidden">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-2xs shrink-0 cursor-pointer mobile-tap"
          title="Return to Admin Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden font-medium">Back</span>
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-bold border truncate max-w-[130px] sm:max-w-none ${badgeColor}`}>
            {badge}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:inline">•</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:inline truncate max-w-sm">
            {title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mobile-tap"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer mobile-tap"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="hidden sm:inline">{saveLabel}</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>
    </header>
  );
};

interface StudioBottomBarProps {
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  saveLabel?: string;
}

const StudioBottomBar: React.FC<StudioBottomBarProps> = ({
  onClose,
  onSave,
  saveLabel = 'Save & Publish Changes',
}) => {
  return (
    <div className="sticky bottom-4 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between gap-2 mt-8 w-full max-w-full">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span className="font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
          Ready to save and deploy changes to website
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300 sm:hidden text-2xs truncate">
          Ready to save
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mobile-tap"
        >
          <span className="hidden sm:inline">Discard / Cancel</span>
          <span className="sm:hidden">Cancel</span>
        </button>
        <button
          type="submit"
          onClick={onSave}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer mobile-tap"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="hidden sm:inline">{saveLabel}</span>
          <span className="sm:hidden">Save</span>
        </button>
      </div>
    </div>
  );
};


interface YouTubeStudioBoxProps {
  videoId: string;
  onChange: (val: string) => void;
  label?: string;
  helperText?: string;
}

const YouTubeStudioBox: React.FC<YouTubeStudioBoxProps> = ({
  videoId,
  onChange,
  label = 'YouTube Video Integration (Optional)',
  helperText = 'Paste full YouTube URL or Video ID. Video will be embedded directly in the post and used for automated thumbnail displays.',
}) => {
  const cleanId = extractYouTubeVideoId(videoId);
  const isValid = cleanId.length === 11;

  return (
    <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 dark:bg-red-500/5 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-600 dark:text-red-500" />
          <span>{label}</span>
        </label>
        {isValid && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Live Preview Linked
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        {helperText}
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={videoId}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. JVE_m3awBTU or https://youtu.be/JVE_m3awBTU"
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-hidden"
        />
        {isValid && (
          <a
            href={`https://www.youtube.com/watch?v=${cleanId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/40 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        )}
      </div>

      {isValid ? (
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 bg-white/70 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="relative aspect-video w-full sm:w-48 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950 shrink-0 shadow-sm">
            <img
              src={`https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`}
              alt="YouTube Thumbnail Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          </div>
          <div className="space-y-1 w-full text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
              Clean Video ID: {cleanId}
            </span>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              This high-res video card will replace the cover image on website grids and embed the YouTube player automatically inside the article.
            </p>
          </div>
        </div>
      ) : videoId ? (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          Enter a valid 11-character YouTube video ID or video link.
        </p>
      ) : null}
    </div>
  );
};

interface YouTubeDescriptionSnippetProps {
  title: string;
  snippetText: string;
}

const YouTubeDescriptionSnippetBox: React.FC<YouTubeDescriptionSnippetProps> = ({
  title,
  snippetText,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
            {title}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xs active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy For Description</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Paste this pre-formatted block directly into your YouTube video description so viewers land on this page with one click!
      </p>

      <pre className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap select-all overflow-x-auto leading-relaxed max-h-36 overflow-y-auto">
        {snippetText}
      </pre>
    </div>
  );
};

interface MarkdownToolbarProps {
  onInsert: (prefix: string, suffix?: string, defaultText?: string) => void;
  activeTab?: 'write' | 'preview';
  onTabChange?: (tab: 'write' | 'preview') => void;
}

export const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return <MarkdownArticleReader content={content} />;
};

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ onInsert, activeTab = 'write', onTabChange }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
      {onTabChange && (
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={() => onTabChange('write')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'write'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      )}

      {activeTab === 'write' ? (
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => onInsert('# ', '', 'Main Heading')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 font-extrabold text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => onInsert('## ', '', 'Section Title')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => onInsert('### ', '', 'Sub-section Title')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Heading 3"
          >
            H3
          </button>
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={() => onInsert('**', '**', 'bold text')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 font-black text-slate-800 dark:text-slate-200 cursor-pointer"
            title="Bold (**text**)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => onInsert('*', '*', 'italic text')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 italic font-serif text-slate-800 dark:text-slate-200 cursor-pointer"
            title="Italic (*text*)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => onInsert('`', '`', 'code')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 font-mono text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Inline Code (`code`)"
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() => onInsert('\n```bash\n', '\n```\n', 'echo "Hello SakshamXTech"')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 font-mono text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Code Block"
          >
            Code Block
          </button>
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={() => onInsert('\n- ', '', 'List item')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Bullet list"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => onInsert('\n1. ', '', 'First step')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer font-mono"
            title="Numbered list"
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => onInsert('\n> ', '', 'Quote or highlight text')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
            title="Blockquote"
          >
            &ldquo; Quote
          </button>
          <button
            type="button"
            onClick={() => onInsert('\n> 💡 **Pro-Tip:** ', '', 'Add your helpful advice here')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 font-bold cursor-pointer"
            title="Pro-Tip Callout"
          >
            💡 Tip
          </button>
          <button
            type="button"
            onClick={() => onInsert('\n> ⚠️ **Important:** ', '', 'Keep this requirement in mind')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold cursor-pointer"
            title="Warning Callout"
          >
            ⚠️ Alert
          </button>
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
          <button
            type="button"
            onClick={() => onInsert('[', `](${getSiteOrigin()})`, 'Click Here')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
            title="Insert Link"
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => onInsert('\n---\n', '', '')}
            className="px-2 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-500 font-mono cursor-pointer"
            title="Divider Line"
          >
            Divider
          </button>
        </div>
      ) : (
        <span className="text-[11px] text-slate-400 italic pr-2">
          Previewing formatted article appearance
        </span>
      )}
    </div>
  );
};


// ============================================================================
// 1. BLOG ARTICLE STUDIO (FULL-PAGE EDITOR)
// ============================================================================

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<BlogPost>) => void;
  initialData?: BlogPost | null;
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
}

export const BlogEditorModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  creatorName,
  creatorRole,
  creatorAvatar,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Google Cloud');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [officialLink, setOfficialLink] = useState('');
  const [officialLinkLabel, setOfficialLinkLabel] = useState('');
  const [deadline, setDeadline] = useState('');
  const [perks, setPerks] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(8);
  const [tags, setTags] = useState('Google Cloud, Tech');
  const [featured, setFeatured] = useState(false);
  const [postStatus, setPostStatus] = useState<'published' | 'scheduled' | 'draft'>('published');
  const [scheduledAt, setScheduledAt] = useState(() => getDelhiCurrentDateTimeLocal());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [draftAvailable, setDraftAvailable] = useState<any | null>(null);

  const siteUrl = getSiteOrigin();

  // Check if draft exists on open
  useEffect(() => {
    if (isOpen && !initialData) {
      try {
        const raw = localStorage.getItem('sx_blog_draft');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.title || parsed.content)) {
            setDraftAvailable(parsed);
          }
        }
      } catch {}
    } else {
      setDraftAvailable(null);
    }
  }, [isOpen, initialData]);

  // Auto-save draft when editing a new article
  useEffect(() => {
    if (!isOpen || initialData) return;
    if (!title && (!content || content.startsWith('# Write your article here'))) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem('sx_blog_draft', JSON.stringify({
          title,
          slug,
          category,
          summary,
          content,
          coverImage,
          youtubeVideoId,
          officialLink,
          officialLinkLabel,
          deadline,
          perks,
          eligibility,
          readTimeMinutes,
          tags,
          postStatus,
          savedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }));
      } catch {}
    }, 1500);

    return () => clearTimeout(timer);
  }, [isOpen, initialData, title, slug, category, summary, content, coverImage, youtubeVideoId, officialLink, officialLinkLabel, deadline, perks, eligibility, readTimeMinutes, tags, postStatus]);

  const handleRestoreDraft = () => {
    if (!draftAvailable) return;
    setTitle(draftAvailable.title || '');
    setSlug(draftAvailable.slug || '');
    setCategory(draftAvailable.category || 'Google Cloud');
    setSummary(draftAvailable.summary || '');
    setContent(draftAvailable.content || '');
    setCoverImage(draftAvailable.coverImage || '');
    setYoutubeVideoId(draftAvailable.youtubeVideoId || '');
    setOfficialLink(draftAvailable.officialLink || '');
    setOfficialLinkLabel(draftAvailable.officialLinkLabel || '');
    setDeadline(draftAvailable.deadline || '');
    setPerks(draftAvailable.perks || '');
    setEligibility(draftAvailable.eligibility || '');
    setReadTimeMinutes(draftAvailable.readTimeMinutes || 8);
    setTags(draftAvailable.tags || 'Google Cloud, Tech');
    setDraftAvailable(null);
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem('sx_blog_draft');
    } catch {}
    setDraftAvailable(null);
  };

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setCategory(initialData.category || 'Google Cloud');
      setSummary(initialData.summary || '');
      setContent(initialData.content || '');
      setCoverImage(initialData.coverImage || '');
      setYoutubeVideoId(initialData.youtubeVideoId || '');
      setOfficialLink(initialData.officialLink || '');
      setOfficialLinkLabel(initialData.officialLinkLabel || '');
      setDeadline(initialData.deadline || '');
      setPerks(initialData.perks || '');
      setEligibility(initialData.eligibility || '');
      setReadTimeMinutes(initialData.readTimeMinutes || 8);
      setTags(Array.isArray(initialData.tags) ? initialData.tags.join(', ') : 'Tech');
      setFeatured(initialData.featured ?? false);
      setPostStatus(
        initialData.status ||
        (initialData.scheduledAt && new Date(initialData.scheduledAt).getTime() > Date.now() ? 'scheduled' : 'published')
      );
      setScheduledAt(
        initialData.scheduledAt
          ? initialData.scheduledAt.slice(0, 16)
          : getDelhiCurrentDateTimeLocal()
      );
    } else {
      setTitle('');
      setSlug('');
      setCategory('Google Cloud');
      setSummary('');
      setContent('# Write your article here...\n\nStart writing in markdown or plain text.');
      setCoverImage('');
      setYoutubeVideoId('');
      setOfficialLink('');
      setOfficialLinkLabel('');
      setDeadline('');
      setPerks('');
      setEligibility('');
      setReadTimeMinutes(8);
      setTags('Google Cloud, Guide');
      setFeatured(false);
      setPostStatus('published');
      setScheduledAt(getDelhiCurrentDateTimeLocal());
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleInsertMarkdown = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => prev + prefix + defaultText + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    const selected = val.substring(start, end);
    const replacement = selected ? (prefix + selected + suffix) : (prefix + defaultText + suffix);
    
    const nextVal = val.substring(0, start) + replacement + val.substring(end);
    setContent(nextVal);
    
    setTimeout(() => {
      textarea.focus();
      if (selected) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + defaultText.length);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      setContent(val.substring(0, start) + '  ' + val.substring(end));
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      handleInsertMarkdown('**', '**', 'bold text');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      handleInsertMarkdown('*', '*', 'italic text');
    }
  };

  const cleanVideoId = extractYouTubeVideoId(youtubeVideoId);

  const getSaveBtnLabel = () => {
    if (postStatus === 'scheduled') {
      return 'Schedule Article';
    }
    if (postStatus === 'draft') {
      return 'Save Draft';
    }
    return initialData ? 'Update & Publish' : 'Save & Publish';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return alert('Please enter an article title');

    const cleanContent = content.trim();
    if (!cleanContent) return alert('Please write some content in the article body');

    // Safe summary: never allow empty summary to reach Firestore (guarantees isBoundedString 1-2000 chars passes)
    const cleanSummary = summary.trim() || 
      (cleanContent.replace(/[#*`_~>[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180) + '...') ||
      `${cleanTitle} - Official guide and walkthrough on SakshamXTech.`;

    // Safe cover image: never allow empty cover image or base64 > 1000 chars to reach Firestore
    let cleanCover = coverImage.trim();
    if (cleanCover.startsWith('data:image/') && cleanCover.length > 1000) {
      alert('Cover image is too large as a direct file upload. Please paste a direct image URL or link a YouTube video.');
      return;
    }
    if (!cleanCover) {
      cleanCover = cleanVideoId 
        ? `https://i.ytimg.com/vi/${cleanVideoId}/hqdefault.jpg`
        : (initialData?.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80');
    }

    try {
      localStorage.removeItem('sx_blog_draft');
    } catch {}

    onSave({
      title: cleanTitle,
      slug: slug.trim() || cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      summary: cleanSummary,
      content: cleanContent,
      coverImage: cleanCover,
      youtubeVideoId: cleanVideoId || '',
      officialLink: officialLink.trim() || '',
      officialLinkLabel: officialLinkLabel.trim() || '',
      deadline: deadline.trim() || '',
      perks: perks.trim() || '',
      eligibility: eligibility.trim() || '',
      readTimeMinutes: Number(readTimeMinutes) || 5,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      featured,
      status: postStatus,
      scheduledAt: postStatus === 'scheduled' ? new Date(scheduledAt).toISOString() : '',
      publishedAt: postStatus === 'scheduled'
        ? formatDelhiDateTime(scheduledAt).split(',')[0]
        : (initialData?.publishedAt || getTodayISODate()),
      updatedAt: Date.now(),
      author: initialData?.author || {
        name: creatorName,
        role: creatorRole,
        avatar: creatorAvatar,
      },
    });
    onClose();
  };

  const descriptionSnippet = `📌 Official Program Link & Guide:
${siteUrl}/blogs/${slug || 'guide'}

${officialLink ? `🔗 Direct Application Portal:
${officialLink}

` : ''}${deadline ? `⏰ Last Date / Deadline: ${deadline}
` : ''}${perks ? `🎁 Perks & Goodies: ${perks}
` : ''}${eligibility ? `🎓 Eligibility: ${eligibility}
` : ''}
🔔 Subscribe for More Tech Swags & Guides:
https://youtube.com/@sakshamxtech?sub_confirmation=1`;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <StudioTopBar
        title={title ? title : 'New Blog Article'}
        subtitle="Blogs & YouTube Hub"
        badge="Blog Article Studio"
        onClose={onClose}
        onSave={handleSubmit}
        saveLabel={getSaveBtnLabel()}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 overflow-x-hidden">
        {draftAvailable && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Unsaved Draft Found {draftAvailable.savedAt ? `(Saved at ${draftAvailable.savedAt})` : ''}
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                  "{draftAvailable.title || 'Untitled Article'}" — Would you like to restore your unsaved writing?
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Restore Draft
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* LEFT COLUMN: Main Editorial Content (8 cols) */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Title & Slug Box */}
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Google Cloud Arcade 2026: Official Roadmap to Unlock Champion Tier Swags"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  URL Slug Preview
                </label>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 min-w-0">
                  <span className="text-slate-400 select-none truncate shrink-0 max-w-[200px] sm:max-w-none"><span className="hidden sm:inline">{siteUrl}</span>/blogs/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="my-article-slug"
                    className="flex-1 min-w-0 bg-transparent border-none text-blue-600 dark:text-blue-400 font-semibold focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Summary / Excerpt */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Short Summary / SEO Excerpt
                </label>
                <span className="text-[11px] text-slate-400">{summary.length} characters</span>
              </div>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief 1-2 sentence preview shown on blog cards, search engines, and YouTube cards..."
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden"
              />
            </div>

            {/* YouTube Video Attachment Studio */}
            <YouTubeStudioBox
              videoId={youtubeVideoId}
              onChange={setYoutubeVideoId}
              label="YouTube Video Hub Link"
              helperText="Paste full YouTube video URL or ID. Linking a video automatically shows the video on this blog, displays the video thumbnail on cards, and enables YouTube description quick-copy."
            />

            {/* Article Content / Markdown Editor */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Article Body (Markdown Supported)
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Use full markdown headings, code blocks, lists, quotes, and callouts.
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400">
                  {content.split(/\s+/).filter(Boolean).length} words • {Math.max(1, Math.round(content.split(/\s+/).filter(Boolean).length / 200))} min read
                </div>
              </div>

              <MarkdownToolbar
                onInsert={handleInsertMarkdown}
                activeTab={editorTab}
                onTabChange={setEditorTab}
              />

              {editorTab === 'write' ? (
                <textarea
                  ref={textareaRef}
                  rows={16}
                  value={content}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="# Introduction&#10;&#10;Explain the opportunity, eligibility, and steps here..."
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-hidden resize-y min-h-[380px]"
                />
              ) : (
                <div className="min-h-[380px] p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 overflow-y-auto">
                  <SimpleMarkdownRenderer content={content} />
                </div>
              )}
            </div>

            {/* YouTube Description Destination Box (Official Links & Deadlines) */}
            <div className="p-6 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-500/20 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Official Program Portal & Registration Box
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                These fields power the prominent "Official Registration Portal" banner at the top of the blog page so YouTube viewers can apply immediately.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Apply / Registration Link
                  </label>
                  <input
                    type="url"
                    value={officialLink}
                    onChange={(e) => setOfficialLink(e.target.value)}
                    placeholder="https://cloud.google.com/innovators/arcade"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={officialLinkLabel}
                    onChange={(e) => setOfficialLinkLabel(e.target.value)}
                    placeholder="e.g. Apply on Official Portal"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Last Date / Deadline
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. Nov 20, 2026"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Swags & Perks
                  </label>
                  <input
                    type="text"
                    value={perks}
                    onChange={(e) => setPerks(e.target.value)}
                    placeholder="e.g. Free Goodies, T-Shirt"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Eligibility
                  </label>
                  <input
                    type="text"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="e.g. All College Students"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Settings & Tools (4 cols) - SINGLE CLEAR HIERARCHY */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publishing Schedule Card */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Publishing Schedule
                </h4>
              </div>

              {/* 3-Mode Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPostStatus('published')}
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                    postStatus === 'published'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  🚀 Live Now
                </button>
                <button
                  type="button"
                  onClick={() => setPostStatus('scheduled')}
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                    postStatus === 'scheduled'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  📅 Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setPostStatus('draft')}
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                    postStatus === 'draft'
                      ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  📝 Draft
                </button>
              </div>

              {/* Dynamic Panel based on mode */}
              {postStatus === 'scheduled' ? (
                <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Target Release Date &amp; Time
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      min={getDelhiCurrentDateTimeLocal()}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-purple-500 outline-hidden"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-purple-200 dark:border-purple-800 space-y-1">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Will Automatically Unlock On:</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {formatCleanDateTime(scheduledAt)}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    ✨ <strong>Auto-Unlock:</strong> At this scheduled time, the article will automatically become visible to all public website visitors and appear on blog listings. Until then, only authenticated admins can preview it.
                  </p>
                </div>
              ) : postStatus === 'draft' ? (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Unpublished Draft</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    This article will remain saved in your private admin workspace and will not appear on the public website.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Immediate Public Release</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    This article will be published immediately and be visible right now to all visitors across the platform.
                  </p>
                </div>
              )}
            </div>


            {/* Publishing Metadata Card */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Publishing Details
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-medium"
                >
                  <option value="Google Cloud">Google Cloud</option>
                  <option value="Programming">Programming</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Career">Career</option>
                  <option value="Tutorials">Tutorials</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Estimated Read Time (Minutes)
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Tags (Comma separated)
                </label>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Google Cloud, Arcade, Swags"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Custom Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or paste image link"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
                {coverImage && (
                  <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Featured Article
                  </span>
                  <span className="text-[11px] text-slate-400">Show on homepage showcase</span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <img
                  src={creatorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt={creatorName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-white block">
                    {creatorName}
                  </span>
                  <span className="text-slate-400 text-[11px]">{creatorRole}</span>
                </div>
              </div>
            </div>

            {/* YouTube Description Quick-Copy Box */}
            <YouTubeDescriptionSnippetBox
              title="YouTube Description Snippet"
              snippetText={descriptionSnippet}
            />

            {/* Quick Tips */}
            <div className="p-5 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>YouTube Creator Tip</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                When you upload a YouTube video, create the blog here first, click <b>"Copy For Description"</b>, and paste it into your video description. Viewers will click directly into your branded portal!
              </p>
            </div>

          </div>

        </form>
      </main>
    </div>,
    document.body
  );
};


// ============================================================================
// 2. GOOGLE CLOUD ARCADE LAB STUDIO (FULL-PAGE EDITOR)
// ============================================================================

interface ArcadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ArcadeSolution>) => void;
  initialData?: ArcadeSolution | null;
}

export const ArcadeEditorModal: React.FC<ArcadeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [labCode, setLabCode] = useState('GSP001');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState<ArcadeSolution['difficulty']>('Beginner');
  const [category, setCategory] = useState<ArcadeSolution['category']>('Arcade Lab');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [description, setDescription] = useState('');
  const [commands, setCommands] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setLabCode(initialData.labCode || 'GSP001');
      setSlug(initialData.slug || '');
      setDifficulty(initialData.difficulty || 'Beginner');
      setCategory(initialData.category || 'Arcade Lab');
      setDurationMinutes(initialData.durationMinutes || 15);
      setYoutubeVideoId(initialData.youtubeVideoId || '');
      setDescription(initialData.description || '');
      setCommands(
        Array.isArray(initialData.steps)
          ? initialData.steps.map((s) => s.command).filter(Boolean).join('\n')
          : ''
      );
    } else {
      setTitle('');
      setLabCode('GSP001');
      setSlug('');
      setDifficulty('Beginner');
      setCategory('Arcade Lab');
      setDurationMinutes(15);
      setYoutubeVideoId('');
      setDescription('');
      setCommands('# Run these commands in Google Cloud Shell\ngcloud config set project $(gcloud config get-value project)');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const cleanVideoId = extractYouTubeVideoId(youtubeVideoId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter lab title');

    const cmdList = commands.split('\n').filter(Boolean);

    onSave({
      title: title.trim(),
      labCode: labCode.trim().toUpperCase() || 'GSP001',
      slug: slug.trim() || (labCode + '-' + title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty,
      category,
      durationMinutes: Number(durationMinutes) || 10,
      youtubeVideoId: cleanVideoId || undefined,
      description: description.trim(),
      pointsAwarded: 1,
      isPublished: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      steps: cmdList.map((cmd, idx) => ({
        stepNumber: idx + 1,
        title: `Cloud Shell Command ${idx + 1}`,
        description: 'Execute in Google Cloud Shell terminal.',
        command: cmd,
      })),
      importantCommands: cmdList,
      prerequisites: ['Google Cloud Console account', 'Active Cloud Shell session'],
    });
    onClose();
  };

  const siteUrl = getSiteOrigin();

  const arcadeSnippet = `⭐ Google Cloud Arcade Solution - ${labCode.toUpperCase()}: ${title}
📌 Step-by-Step Commands & Verification:
${siteUrl}/arcade/${slug || labCode.toLowerCase()}

⏱️ Estimated Lab Time: ${durationMinutes} mins | Points: 1 Arcade Point
🔔 Subscribe for all Arcade & Trivia Answers:
https://youtube.com/@sakshamxtech?sub_confirmation=1`;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <StudioTopBar
        title={title ? `${labCode}: ${title}` : 'New Arcade Lab Solution'}
        subtitle="Google Cloud Arcade Studio"
        badge="Arcade Lab Studio"
        badgeColor="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        onClose={onClose}
        onSave={handleSubmit}
        saveLabel={initialData ? 'Update Lab Solution' : 'Publish Lab Solution'}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 overflow-x-hidden">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Main Area (8 cols) */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Lab Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={labCode}
                    onChange={(e) => setLabCode(e.target.value.toUpperCase())}
                    placeholder="GSP001"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-mono font-black"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Lab Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!initialData) {
                        setSlug((labCode + '-' + e.target.value).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="Deploying a Container to Cloud Run"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Lab URL Slug
                </label>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 min-w-0">
                  <span className="text-slate-400 select-none truncate shrink-0 max-w-[200px] sm:max-w-none"><span className="hidden sm:inline">{siteUrl}</span>/arcade/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="gsp001-deploying-container"
                    className="flex-1 min-w-0 bg-transparent border-none text-blue-600 dark:text-blue-400 font-semibold focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Cloud Shell Terminal Commands Box */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-500" />
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Cloud Shell Commands (1 command per line)
                  </label>
                </div>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {commands.split('\n').filter(Boolean).length} steps parsed
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                These commands will be converted into one-click copyable steps on the lab page for students.
              </p>
              <textarea
                rows={10}
                value={commands}
                onChange={(e) => setCommands(e.target.value)}
                placeholder="gcloud services enable run.googleapis.com&#10;gcloud run deploy ...&#10;gcloud auth list"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              />
            </div>

            {/* YouTube Walkthrough */}
            <YouTubeStudioBox
              videoId={youtubeVideoId}
              onChange={setYoutubeVideoId}
              label="YouTube Video Lab Walkthrough"
              helperText="Link your video tutorial for this lab. Students can watch the live video while copying the Cloud Shell commands."
            />

            {/* Description / Overview */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Lab Objective & Summary
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this lab teaches and how to pass the progress check..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white outline-hidden"
              />
            </div>
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Publish Actions
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Update & Publish' : 'Save & Publish'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Discard / Cancel
              </button>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Lab Parameters
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Beginner">Beginner (1 Point)</option>
                  <option value="Intermediate">Intermediate (1 Point)</option>
                  <option value="Advanced">Advanced (1 Point)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Arcade Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Arcade Lab">Arcade Lab</option>
                  <option value="Skill Badge">Skill Badge</option>
                  <option value="Trivia">Trivia Challenge</option>
                  <option value="Certification Prep">Certification Prep</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Estimated Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <YouTubeDescriptionSnippetBox
              title="YouTube Description Snippet"
              snippetText={arcadeSnippet}
            />
          </div>

        </form>
      </main>
    </div>,
    document.body
  );
};


// ============================================================================
// 3. UNSTOP POTD STUDIO (FULL-PAGE EDITOR)
// ============================================================================

interface UnstopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<UnstopProblem>) => void;
  initialData?: UnstopProblem | null;
  suggestedDayNumber?: number;
}

export const UnstopEditorModal: React.FC<UnstopModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  suggestedDayNumber = 1,
}) => {
  const [dayNumber, setDayNumber] = useState<number>(suggestedDayNumber);
  const [problemDate, setProblemDate] = useState<string>(() => initialData?.date || getTodayISODate());
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<UnstopProblem['difficulty']>('Medium');
  const [description, setDescription] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [tags, setTags] = useState('Arrays, Algorithms');

  useEffect(() => {
    if (initialData) {
      setDayNumber(initialData.dayNumber || suggestedDayNumber || 1);
      setProblemDate(initialData.date || getTodayISODate());
      setTitle(initialData.title || '');
      setDifficulty(initialData.difficulty || 'Medium');
      setDescription(initialData.description || '');
      setSolutionCode(
        initialData.codeSolutions?.find((s) => s.language === 'c' || s.language === 'cpp')?.code ||
        initialData.codeSolutions?.[0]?.code ||
        ''
      );
      setExplanation(initialData.solutionExplanation || '');
      setTags(Array.isArray(initialData.tags) ? initialData.tags.join(', ') : 'POTD');
    } else {
      setDayNumber(suggestedDayNumber || 1);
      setProblemDate(getTodayISODate());
      setTitle('');
      setDifficulty('Medium');
      setDescription('');
      setSolutionCode('#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Read input and compute result\n    return 0;\n}');
      setExplanation('');
      setTags('POTD, Data Structures');
    }
  }, [initialData, isOpen, suggestedDayNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter problem title');

    onSave({
      dayNumber: Number(dayNumber) || 1,
      title: title.trim(),
      slug: `day-${dayNumber}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      difficulty,
      description: description.trim(),
      date: problemDate || initialData?.date || getTodayISODate(),
      inputFormat: initialData?.inputFormat || 'Array / Numbers input',
      outputFormat: initialData?.outputFormat || 'Result output',
      constraints: initialData?.constraints || ['1 <= n <= 10^5'],
      examples: initialData?.examples || [{ input: '5', output: '5' }],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      codeSolutions: [
        { language: 'cpp', code: solutionCode },
        { language: 'c', code: solutionCode },
        { language: 'python', code: `# Python Solution\ndef solve():\n    pass` },
      ],
      solutionExplanation: explanation.trim(),
    });
    onClose();
  };

  const siteUrl = getSiteOrigin();

  const potdSnippet = `🔥 Unstop POTD Day ${dayNumber} Solution - ${title}
📌 View Complete Code (C, C++, Python) & Logic:
${siteUrl}/unstop/day-${dayNumber}

💡 Difficulty: ${difficulty}
🔔 Subscribe for Daily Unstop POTD & Contest Solutions:
https://youtube.com/@sakshamxtech?sub_confirmation=1`;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <StudioTopBar
        title={title ? `Day ${dayNumber}: ${title}` : 'New Unstop POTD'}
        subtitle="Daily Coding Streak"
        badge="Unstop POTD Studio"
        badgeColor="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        onClose={onClose}
        onSave={handleSubmit}
        saveLabel={initialData ? 'Update POTD' : 'Publish POTD'}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 overflow-x-hidden">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 flex items-center justify-between">
                    <span>Day Number <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold lowercase">auto (prev+1)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={dayNumber}
                    onChange={(e) => setDayNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-mono font-black"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 flex items-center justify-between">
                    <span>Date <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold lowercase">local date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={problemDate}
                    onChange={(e) => setProblemDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Problem Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Subarray with Given Sum"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Problem Statement
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem, input format, and constraints..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Code Solution Editor */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-500" />
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    C / C++ Solution Code
                  </label>
                </div>
                <span className="text-xs font-mono text-slate-400">Syntax checked</span>
              </div>
              <textarea
                rows={12}
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-amber-400 leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-hidden"
              />
            </div>

            {/* Explanation / Approach */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Approach & Complexity Explanation
              </label>
              <textarea
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain the intuition, time complexity O(N), and space complexity..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Publish Actions
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Update & Publish' : 'Save & Publish'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Discard / Cancel
              </button>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Problem Settings
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Arrays, Binary Search, POTD"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <YouTubeDescriptionSnippetBox
              title="YouTube Description Snippet"
              snippetText={potdSnippet}
            />
          </div>

        </form>
      </main>
    </div>,
    document.body
  );
};


// ============================================================================
// 4. TECH OPPORTUNITIES STUDIO (FULL-PAGE EDITOR)
// ============================================================================

interface OpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Opportunity>) => void;
  initialData?: Opportunity | null;
}

export const OpportunityEditorModal: React.FC<OpportunityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<Opportunity['category']>('Student Programs');
  const [applyUrl, setApplyUrl] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<Opportunity['status']>('Active');
  const [type, setType] = useState<Opportunity['type']>('Remote');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [benefits, setBenefits] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCompany(initialData.company || '');
      setCategory(initialData.category || 'Student Programs');
      setApplyUrl(initialData.officialUrl || '');
      setDeadline(initialData.deadline || '');
      setStatus(initialData.status || 'Active');
      setType(initialData.type || 'Remote');
      setDescription(initialData.description || '');
      setEligibility(initialData.eligibility || '');
      setBenefits(Array.isArray(initialData.benefits) ? initialData.benefits.join(', ') : '');
    } else {
      setTitle('');
      setCompany('Google');
      setCategory('Student Programs');
      setApplyUrl('https://careers.google.com');
      setDeadline(new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0]);
      setStatus('Active');
      setType('Remote');
      setDescription('');
      setEligibility('College Students (All Years)');
      setBenefits('Free Goodies, Certificate, Cloud Credits');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter opportunity title');

    onSave({
      title: title.trim(),
      company: company.trim() || 'Tech Organization',
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      officialUrl: applyUrl.trim(),
      deadline: deadline.trim(),
      status,
      type,
      description: description.trim(),
      eligibility: eligibility.trim() || 'Open to all students',
      benefits: benefits.split(',').map((b) => b.trim()).filter(Boolean),
      logo: initialData?.logo || '/assets/branding/arcade_skill_badges.png',
      postedDate: initialData?.postedDate || new Date().toISOString().split('T')[0],
      featured: initialData?.featured || false,
      clicksCount: initialData?.clicksCount || 0,
    });
    onClose();
  };

  const siteUrl = getSiteOrigin();

  const oppSnippet = `🚀 New Tech Opportunity: ${title} (${company})
🔗 Direct Application Portal:
${applyUrl || `${siteUrl}/opportunities`}

⏰ Deadline: ${deadline}
🎁 Perks & Benefits: ${benefits}
🎓 Eligibility: ${eligibility}
🔔 Subscribe for Daily Opportunity Alerts:
https://youtube.com/@sakshamxtech?sub_confirmation=1`;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <StudioTopBar
        title={title ? `${company}: ${title}` : 'New Opportunity'}
        subtitle="Student Programs & Internships"
        badge="Opportunity Studio"
        badgeColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        onClose={onClose}
        onSave={handleSubmit}
        saveLabel={initialData ? 'Update Opportunity' : 'Publish Opportunity'}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 overflow-x-hidden">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Company / Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, ISRO"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Program Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Google Student Ambassador Program 2026"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Official Application Link (Direct Link) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={applyUrl}
                  onChange={(e) => setApplyUrl(e.target.value)}
                  placeholder="https://careers.google.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-mono font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Full Opportunity Description
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain role, stipend/benefits, responsibilities, and how selection happens..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Eligibility & Perks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Eligibility Criteria
                  </label>
                  <input
                    type="text"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="e.g. 1st to 4th year college students"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Benefits & Perks (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder="Free Goodies, Certificate, Mentorship"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Publish Actions
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Update & Publish' : 'Save & Publish'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Discard / Cancel
              </button>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Status & Dates
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Student Programs">Student Programs</option>
                  <option value="Internships">Internships</option>
                  <option value="Hackathons">Hackathons</option>
                  <option value="Competitions">Competitions</option>
                  <option value="Scholarships">Scholarships</option>
                  <option value="Certifications">Certifications</option>
                  <option value="Webinars">Webinars</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Work Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Deadline Date
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Closing Soon">Closing Soon</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <YouTubeDescriptionSnippetBox
              title="YouTube Description Snippet"
              snippetText={oppSnippet}
            />
          </div>

        </form>
      </main>
    </div>,
    document.body
  );
};


// ============================================================================
// 5. TECH SWAGS STUDIO (FULL-PAGE EDITOR)
// ============================================================================

interface SwagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<SwagItem>) => void;
  initialData?: SwagItem | null;
}

export const SwagEditorModal: React.FC<SwagModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [claimUrl, setClaimUrl] = useState('');
  const [revealedDate, setRevealedDate] = useState('15 September 2026');
  const [tierTags, setTierTags] = useState<('Trooper' | 'Ranger' | 'Champion' | 'Legend')[]>(['Champion']);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setImageUrl(initialData.imageUrl || '');
      setClaimUrl(initialData.officialSourceUrl || 'https://go.qwiklabs.com/arcade');
      setRevealedDate(initialData.revealedDate || '15 September 2026');
      setTierTags(
        (initialData.tierTags && initialData.tierTags.length > 0)
          ? (initialData.tierTags.filter((t) => t !== 'All Tiers') as any)
          : ['Champion']
      );
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setImageUrl('');
      setClaimUrl('https://go.qwiklabs.com/arcade');
      setRevealedDate('15 September 2026');
      setTierTags(['Champion']);
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleTierTag = (tag: 'Trooper' | 'Ranger' | 'Champion' | 'Legend') => {
    setTierTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter swag title');

    onSave({
      title: title.trim(),
      brand: 'Google Cloud Arcade',
      category: initialData?.category || 'Google Cloud Swag',
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      tierRequired: tierTags.length > 0 ? tierTags.join(', ') : 'Champion',
      tierTags: tierTags.length > 0 ? tierTags : ['Champion'],
      revealedDate: revealedDate.trim() || 'Revealed in 2026',
      eligibility: initialData?.eligibility || 'Complete required points in Google Cloud Arcade 2026',
      officialSourceUrl: claimUrl.trim() || 'https://go.qwiklabs.com/arcade',
      description: description.trim() || 'Official Google Cloud Arcade 2026 swag merchandise.',
      status: 'Active',
      howToClaim: initialData?.howToClaim || ['Complete required points', 'Check claim email', 'Order swags'],
      campaignStartDate: initialData?.campaignStartDate || '2026-08-01',
      campaignEndDate: initialData?.campaignEndDate || '2026-12-31',
      featured: true,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <StudioTopBar
        title={title ? `Arcade Swag: ${title}` : 'New Arcade Swag Drop'}
        subtitle="Google Cloud Arcade Hub"
        badge="Swags Studio"
        badgeColor="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        onClose={onClose}
        onSave={handleSubmit}
        saveLabel={initialData ? 'Update & Publish' : 'Save & Publish'}
      />

      <main className="max-w-3xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8 flex-1 overflow-x-hidden">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          
          <div className="p-4 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm space-y-4 sm:space-y-6">
            
            {/* Title */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                Swag Item Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weather-Shield Jacket, Magnetic Fill Light, Magic Mug..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Image URL Manual Input */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                Swag Image URL <span className="text-slate-400 font-normal lowercase">(direct image link / CDN)</span>
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://d2yds90mtvelsl.cloudfront.net/... or any image link"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {imageUrl && (
                <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-contain bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">Image Preview</span>
                    <span className="text-[10px] text-slate-400">Loads dynamically via link</span>
                  </div>
                </div>
              )}
            </div>

            {/* Official Swag Drop Link (Manual) */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                Swag Drop Link <span className="text-red-500">*</span> <span className="text-slate-400 font-normal lowercase">(opens on "Swag Drop ↗" click)</span>
              </label>
              <input
                type="url"
                required
                value={claimUrl}
                onChange={(e) => setClaimUrl(e.target.value)}
                placeholder="https://discuss.google.dev/... or https://go.qwiklabs.com/arcade"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Revealed Date Text */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                Revealed Date Text
              </label>
              <input
                type="text"
                value={revealedDate}
                onChange={(e) => setRevealedDate(e.target.value)}
                placeholder="e.g. 15 September 2026, 3 November 2026"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Displayed on card: "Revealed on [Date]"</span>
            </div>

            {/* 4 Prize Tiers Checkboxes */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
                4 Prize Tiers Division <span className="text-slate-400 font-normal lowercase">(select which tiers unlock this swag)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {(['Trooper', 'Ranger', 'Champion', 'Legend'] as const).map((t) => {
                  const isSelected = tierTags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTierTag(t)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25 scale-[1.02]'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
                      <span>{t} Tier</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item Description (Optional) */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5">
                Item Description &amp; Details <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Official swag specifications, features, material, and kit inclusions..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Update & Publish' : 'Save & Publish'}</span>
              </button>
            </div>

          </div>

        </form>
      </main>
    </div>,
    document.body
  );
};


// ============================================================================
// 6. C ACADEMY MASTERCLASS STUDIO (FULL-PAGE EDITOR)
// ============================================================================

interface CLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<CLesson>) => void;
  initialData?: CLesson | null;
}

export const CLessonEditorModal: React.FC<CLessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [dayNumber, setDayNumber] = useState(4);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');

  useEffect(() => {
    if (initialData) {
      setDayNumber(initialData.dayNumber || 4);
      setTitle(initialData.title || '');
      setSummary(initialData.summary || '');
      setYoutubeVideoId(initialData.youtubeVideoId || '');
      setDurationMinutes(initialData.durationMinutes || 25);
      setContent(initialData.content || '');
      setCodeSnippet(initialData.codeSnippet || '');
    } else {
      setDayNumber(4);
      setTitle('');
      setSummary('');
      setYoutubeVideoId('');
      setDurationMinutes(25);
      setContent('# Lesson Notes\n\nExplain key concepts, memory representation, and common pitfalls.');
      setCodeSnippet('#include <stdio.h>\n\nint main() {\n    printf("Hello C Academy!\\n");\n    return 0;\n}');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const cleanVideoId = extractYouTubeVideoId(youtubeVideoId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter lesson title');

    onSave({
      dayNumber: Number(dayNumber) || 1,
      title: title.trim(),
      slug: `day-${dayNumber}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      summary: summary.trim(),
      durationMinutes: Number(durationMinutes) || 20,
      youtubeVideoId: cleanVideoId || undefined,
      content: content.trim(),
      codeSnippet: codeSnippet.trim(),
      expectedOutput: 'Output generated',
      isPublished: true,
      practiceQuestions: [],
      quiz: [],
    });
    onClose();
  };

  const siteUrl = getSiteOrigin();

  const cLessonSnippet = `💻 C Programming Academy Day ${dayNumber} - ${title}
📌 Run Code in In-Browser Compiler & Notes:
${siteUrl}/c-academy/day-${dayNumber}

⏱️ Duration: ${durationMinutes} mins
🔔 Subscribe for Full C Masterclass (Basics to Low-Level Memory):
https://youtube.com/@sakshamxtech?sub_confirmation=1`;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <StudioTopBar
        title={title ? `Day ${dayNumber}: ${title}` : 'New C Lecture'}
        subtitle="C Academy Masterclass"
        badge="C Academy Studio"
        badgeColor="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
        onClose={onClose}
        onSave={handleSubmit}
        saveLabel={initialData ? 'Update Lecture' : 'Publish Lecture'}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 overflow-x-hidden">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Day Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={dayNumber}
                    onChange={(e) => setDayNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-mono font-black"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                    Lecture Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Pointers, Stack vs Heap & Memory Layout"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Lecture Summary
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Key concepts covered in this video lecture..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Code Snippet */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-500" />
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Interactive C Code Example
                  </label>
                </div>
                <span className="text-xs font-mono text-slate-400">Loads into In-Browser Compiler</span>
              </div>
              <textarea
                rows={10}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-sky-400 leading-relaxed focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-hidden"
              />
            </div>

            {/* YouTube Tutorial */}
            <YouTubeStudioBox
              videoId={youtubeVideoId}
              onChange={setYoutubeVideoId}
              label="YouTube Video Lecture"
              helperText="Embed the full video lesson so students can follow along directly while executing C code."
            />

            {/* Lecture Notes */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Lecture Notes & Explanations (Markdown)
              </label>
              <textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Publish Actions
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Update & Publish' : 'Save & Publish'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Discard / Cancel
              </button>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Lecture Settings
              </h4>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Video Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <YouTubeDescriptionSnippetBox
              title="YouTube Description Snippet"
              snippetText={cLessonSnippet}
            />
          </div>

        </form>
      </main>
    </div>,
    document.body
  );
};


// ============================================================================
// 7. STUDY RESOURCES & PDFS STUDIO (FULL-PAGE EDITOR)
// ============================================================================

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ResourceItem>) => void;
  initialData?: ResourceItem | null;
}

export const ResourceEditorModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResourceItem['category']>('PDF Notes');
  const [fileFormat, setFileFormat] = useState<ResourceItem['format']>('PDF');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [description, setDescription] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [tags, setTags] = useState('Cheat Sheet, Notes');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'PDF Notes');
      setFileFormat(initialData.format || 'PDF');
      setFileSize(initialData.fileSize || '2.4 MB');
      setDescription(initialData.description || '');
      setDownloadUrl(initialData.downloadUrl || '');
      setTags(Array.isArray(initialData.tags) ? initialData.tags.join(', ') : 'PDF');
    } else {
      setTitle('');
      setCategory('PDF Notes');
      setFileFormat('PDF');
      setFileSize('2.5 MB');
      setDescription('');
      setDownloadUrl('https://github.com/sakshamxtech');
      setTags('Notes, PDF, Revision');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter resource title');

    onSave({
      title: title.trim(),
      category,
      format: fileFormat,
      fileSize,
      description: description.trim(),
      downloadUrl: downloadUrl.trim() || '#download',
      previewImageUrl: initialData?.previewImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      downloadsCount: initialData?.downloadsCount || 0,
      publishedDate: initialData?.publishedDate || new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  const siteUrl = getSiteOrigin();

  const resourceSnippet = `📚 Download Free Study Material: ${title}
📌 Direct Download & PDF Notes:
${downloadUrl || `${siteUrl}/resources`}

📄 Format: ${fileFormat} (${fileSize}) | Category: ${category}
🔔 Subscribe for Free Engineering Notes & Handbooks:
https://youtube.com/@sakshamxtech?sub_confirmation=1`;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-950 overflow-y-auto overflow-x-hidden w-full max-w-full min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <StudioTopBar
        title={title ? title : 'New Study Resource'}
        subtitle="PDFs & Cheat Sheets"
        badge="Resource Studio"
        badgeColor="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
        onClose={onClose}
        onSave={handleSubmit}
        saveLabel={initialData ? 'Update Resource' : 'Publish Resource'}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 overflow-x-hidden">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Resource Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Google Cloud Arcade 2026: Complete Cheat Sheet & Command List"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-base text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Download URL / Google Drive Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                  Resource Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed summary of what topics and formulas are covered in this PDF..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Publish Actions
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{initialData ? 'Update & Publish' : 'Save & Publish'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Discard / Cancel
              </button>
            </div>
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Resource Metadata
              </h4>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Cheat Sheet">Cheat Sheet</option>
                  <option value="Roadmap">Roadmap</option>
                  <option value="PDF Notes">PDF Notes</option>
                  <option value="Lab Guide">Lab Guide</option>
                  <option value="Code Template">Code Template</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Format
                  </label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono"
                  >
                    <option value="PDF">PDF</option>
                    <option value="ZIP">ZIP</option>
                    <option value="Markdown">Markdown</option>
                    <option value="Link">Link</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="2.5 MB"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Notes, PDF, Revision"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <YouTubeDescriptionSnippetBox
              title="YouTube Description Snippet"
              snippetText={resourceSnippet}
            />
          </div>

        </form>
      </main>
    </div>,
    document.body
  );
};
