import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  AlertCircle, 
  Info, 
  Lightbulb, 
  CheckCircle2,
  Sparkles,
  Flame,
  Bookmark
} from 'lucide-react';

interface MarkdownArticleReaderProps {
  content: string;
  className?: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Generate a clean URL-friendly ID slug from heading text
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[*_`#[\]]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper to extract Table of Contents from content
export const extractTableOfContents = (content: string): TocItem[] => {
  if (!content) return [];
  const lines = content.split(/\r?\n/);
  const toc: TocItem[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const hMatch = line.match(/^(#{2,3})\s+(.*)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const cleanText = hMatch[2].replace(/[*_`]/g, '').trim();
      const id = slugify(cleanText);
      if (cleanText) {
        toc.push({ id, text: cleanText, level });
      }
    }
  }
  return toc;
};

// Code block component with 1-click Copy button
const CodeSnippetBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-xl text-slate-100 font-mono text-xs sm:text-sm">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>{language || 'CODE'}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-xs active:scale-95"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 sm:p-5 overflow-x-auto leading-relaxed text-slate-200 no-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Parse inline Markdown: bold, italic, code, links, bare URLs, strikethrough
export const parseInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return text;

  // Regex tokenizes:
  // 1. Markdown Links [text](url)
  // 2. Bold Italic ***text***
  // 3. Bold **text** or __text__
  // 4. Italic *text* or _text_
  // 5. Inline Code `code`
  // 6. Strikethrough ~~text~~
  // 7. Bare URLs https://... or http://...
  const inlineRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`|~~([^~]+)~~|\*([^*]+)\*|_([^_]+)_|(https?:\/\/[^\s<)]+))/g;

  const tokens: React.ReactNode[] = [];
  let lastIndex = 0;
  let keyIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    const [
      ,
      ,
      linkText,
      linkUrl,
      boldItalicText,
      boldAsterisk,
      boldUnderscore,
      inlineCode,
      strikethroughText,
      italicAsterisk,
      italicUnderscore,
      bareUrl
    ] = match;

    if (linkText && linkUrl) {
      // Security: Validate protocol to prevent javascript: / data: / vbscript: URI XSS attacks
      const trimmedUrl = linkUrl.trim();
      const isSafeProtocol =
        /^https?:\/\//i.test(trimmedUrl) ||
        trimmedUrl.startsWith('/') ||
        trimmedUrl.startsWith('#') ||
        trimmedUrl.startsWith('mailto:');
      const safeHref = isSafeProtocol ? trimmedUrl : '#';

      tokens.push(
        <a
          key={keyIdx++}
          href={safeHref}
          target={safeHref.startsWith('#') || safeHref.startsWith('/') ? undefined : '_blank'}
          rel={safeHref.startsWith('#') || safeHref.startsWith('/') ? undefined : 'noopener noreferrer'}
          className="text-blue-600 dark:text-cyan-400 font-bold underline decoration-blue-500/40 hover:decoration-blue-500 transition-colors inline-flex items-center gap-0.5 mx-0.5"
        >
          <span>{linkText}</span>
          {safeHref.startsWith('http') && <ExternalLink className="w-3 h-3 inline opacity-70" />}
        </a>
      );
    } else if (boldItalicText) {
      tokens.push(
        <strong key={keyIdx++} className="font-black italic text-slate-900 dark:text-white">
          {boldItalicText}
        </strong>
      );
    } else if (boldAsterisk || boldUnderscore) {
      tokens.push(
        <strong key={keyIdx++} className="font-extrabold text-slate-900 dark:text-white">
          {boldAsterisk || boldUnderscore}
        </strong>
      );
    } else if (italicAsterisk || italicUnderscore) {
      tokens.push(
        <em key={keyIdx++} className="italic text-slate-800 dark:text-slate-200">
          {italicAsterisk || italicUnderscore}
        </em>
      );
    } else if (inlineCode) {
      tokens.push(
        <code
          key={keyIdx++}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-rose-600 dark:text-rose-400 font-mono text-[12px] sm:text-[13px] border border-slate-200/80 dark:border-slate-700/80 font-semibold"
        >
          {inlineCode}
        </code>
      );
    } else if (strikethroughText) {
      tokens.push(
        <del key={keyIdx++} className="line-through text-slate-400 dark:text-slate-500">
          {strikethroughText}
        </del>
      );
    } else if (bareUrl) {
      tokens.push(
        <a
          key={keyIdx++}
          href={bareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-cyan-400 underline decoration-blue-500/30 hover:decoration-blue-500 break-all font-mono text-xs inline-flex items-center gap-0.5 mx-0.5"
        >
          <span>{bareUrl}</span>
          <ExternalLink className="w-2.5 h-2.5 inline opacity-60" />
        </a>
      );
    }

    lastIndex = inlineRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return <>{tokens}</>;
};

export const MarkdownArticleReader: React.FC<MarkdownArticleReaderProps> = ({ 
  content,
  className = ''
}) => {
  if (!content || !content.trim()) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm italic">
        Article content is loading or not yet published.
      </div>
    );
  }

  const lines = content.split(/\r?\n/);
  const renderedElements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // 1. Code Block Fence (```)
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        renderedElements.push(
          <CodeSnippetBlock
            key={`code-${i}`}
            code={codeBlockLines.join('\n')}
            language={codeBlockLang}
          />
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // 2. Horizontal Divider (---, ***, ___)
    if (line === '---' || line === '***' || line === '___') {
      renderedElements.push(
        <hr key={`hr-${i}`} className="my-8 border-slate-200 dark:border-slate-800" />
      );
      continue;
    }

    // 3. Headings (# H1, ## H2, ### H3, #### H4)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].trim();
      const slugId = slugify(headingText);

      if (level === 1) {
        renderedElements.push(
          <div key={`h1-${i}`} id={slugId} className="pt-6 pb-2 mt-2 border-b border-slate-200/80 dark:border-slate-800/80 scroll-mt-24">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {parseInlineMarkdown(headingText)}
            </h1>
          </div>
        );
      } else if (level === 2) {
        renderedElements.push(
          <div key={`h2-${i}`} id={slugId} className="pt-8 pb-2 mt-2 scroll-mt-24">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5 tracking-tight group">
              <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-500 shrink-0 inline-block shadow-sm" />
              <span>{parseInlineMarkdown(headingText)}</span>
            </h2>
          </div>
        );
      } else if (level === 3) {
        renderedElements.push(
          <div key={`h3-${i}`} id={slugId} className="pt-6 pb-1 scroll-mt-24">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block shrink-0" />
              <span>{parseInlineMarkdown(headingText)}</span>
            </h3>
          </div>
        );
      } else {
        renderedElements.push(
          <div key={`h4-${i}`} id={slugId} className="pt-4 pb-1 scroll-mt-24">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {parseInlineMarkdown(headingText)}
            </h4>
          </div>
        );
      }
      continue;
    }

    // 4. Callout Alert Boxes (> [!TIP], > 💡, > ⚠️, >)
    if (line.startsWith('>')) {
      const quoteText = line.replace(/^>\s*/, '').trim();
      const isTip = quoteText.includes('💡') || quoteText.toLowerCase().includes('tip') || quoteText.startsWith('[!TIP]');
      const isWarn = quoteText.includes('⚠️') || quoteText.toLowerCase().includes('warning') || quoteText.toLowerCase().includes('important') || quoteText.startsWith('[!WARNING]') || quoteText.startsWith('[!IMPORTANT]');
      const isInfo = quoteText.includes('ℹ️') || quoteText.toLowerCase().includes('note') || quoteText.startsWith('[!NOTE]');

      const cleanText = quoteText
        .replace(/^\[!(TIP|WARNING|IMPORTANT|NOTE)\]\s*/i, '')
        .trim();

      renderedElements.push(
        <div
          key={`quote-${i}`}
          className={`my-4 p-4 sm:p-5 rounded-2xl border leading-relaxed text-xs sm:text-sm shadow-xs flex items-start gap-3.5 ${
            isTip
              ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-600/40 text-amber-950 dark:text-amber-200'
              : isWarn
              ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-600/40 text-rose-950 dark:text-rose-200'
              : isInfo
              ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-300 dark:border-blue-600/40 text-blue-950 dark:text-blue-200'
              : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 border-l-4 border-l-blue-600'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {isTip && <Lightbulb className="w-5 h-5 text-amber-500 fill-amber-500/20" />}
            {isWarn && <AlertCircle className="w-5 h-5 text-rose-500 fill-rose-500/20" />}
            {isInfo && <Info className="w-5 h-5 text-blue-500 fill-blue-500/20" />}
            {!isTip && !isWarn && !isInfo && (
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block mt-2" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
              {isTip ? 'Pro Tip' : isWarn ? 'Important Notice' : isInfo ? 'Helpful Note' : 'Key Takeaway'}
            </span>
            <div className="font-medium text-slate-800 dark:text-slate-200">
              {parseInlineMarkdown(cleanText)}
            </div>
          </div>
        </div>
      );
      continue;
    }

    // 5. Numbered Steps or Rules (e.g. "1. **Skill Badges Count**: Details" or "1) Step")
    const numberedStepMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (numberedStepMatch) {
      const stepNum = numberedStepMatch[1];
      const stepBody = numberedStepMatch[2];

      renderedElements.push(
        <div
          key={`num-step-${i}`}
          className="my-3 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all flex items-start gap-3.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            {stepNum}
          </div>
          <div className="flex-1 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal pt-1">
            {parseInlineMarkdown(stepBody)}
          </div>
        </div>
      );
      continue;
    }

    // 6. Bullet Lists (e.g. "- **Week 1-2**: Complete core..." or "* item" or "• item")
    if (line.match(/^[-*+•]\s+(.*)/)) {
      const bulletContent = line.replace(/^[-*+•]\s+/, '').trim();
      renderedElements.push(
        <div
          key={`bullet-${i}`}
          className="my-2 pl-3 flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 mt-2 shrink-0 shadow-2xs" />
          <div className="flex-1">{parseInlineMarkdown(bulletContent)}</div>
        </div>
      );
      continue;
    }

    // 7. Markdown Table Row (e.g. "| Col 1 | Col 2 |")
    if (line.startsWith('|') && line.endsWith('|')) {
      // Collect remaining consecutive table rows
      const tableRows: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|') && lines[i + 1].trim().endsWith('|')) {
        i++;
        tableRows.push(lines[i].trim());
      }

      // Filter out divider row (e.g. | --- | --- |)
      const dataRows = tableRows.filter((r) => !/^[\|\s\-:]+$/.test(r));
      if (dataRows.length > 0) {
        const headerRow = dataRows[0].split('|').map((c) => c.trim()).filter(Boolean);
        const bodyRows = dataRows.slice(1).map((r) => r.split('|').map((c) => c.trim()).filter(Boolean));

        renderedElements.push(
          <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="px-4 py-3 font-extrabold uppercase tracking-wider text-[11px]">
                      {parseInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 8. Empty Lines (Paragraph Spacing)
    if (!line) {
      renderedElements.push(<div key={`blank-${i}`} className="h-3" />);
      continue;
    }

    // 9. Regular Paragraph
    renderedElements.push(
      <p
        key={`p-${i}`}
        className="my-2.5 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal"
      >
        {parseInlineMarkdown(rawLine)}
      </p>
    );
  }

  return (
    <div className={`space-y-1 text-slate-800 dark:text-slate-200 font-sans selection:bg-blue-500/20 ${className}`}>
      {renderedElements}
    </div>
  );
};
