import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export interface AdBannerProps {
  placement?: 'header' | 'sidebar' | 'inArticle';
  className?: string;
  customSlotId?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement = 'header',
  className = '',
  customSlotId,
}) => {
  const { siteSettings } = useApp();
  const { isAdmin } = useAuth();
  const adRef = useRef<HTMLModElement | null>(null);
  const [adPushed, setAdPushed] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);

  const adsConfig = siteSettings?.adsConfig;

  // 1. Placement visibility check
  const isPlacementEnabled = (() => {
    if (!adsConfig?.enabled) return false;
    if (placement === 'header') return adsConfig.headerBanner ?? true;
    if (placement === 'inArticle') return adsConfig.inArticleBanner ?? true;
    if (placement === 'sidebar') return adsConfig.sidebarBanner ?? true;
    return true;
  })();

  const rawClient = adsConfig?.adClient?.trim() || '';
  const cleanClient = rawClient.startsWith('ca-pub-') ? rawClient : `ca-${rawClient}`;
  const isDefaultClient = !rawClient || cleanClient === 'ca-pub-0000000000000000' || cleanClient.length < 15;
  const isTestMode = Boolean(adsConfig?.testMode || isDefaultClient);

  // Determine slot ID
  const slotId = customSlotId || (() => {
    if (placement === 'header') return adsConfig?.headerSlotId;
    if (placement === 'inArticle') return adsConfig?.inArticleSlotId;
    if (placement === 'sidebar') return adsConfig?.sidebarSlotId;
    return undefined;
  })();

  // 2. Inject Google AdSense Global Script (Once)
  useEffect(() => {
    if (!isPlacementEnabled || isTestMode) return;

    const existingScript = document.querySelector(`script[src*="pagead2.googlesyndication.com"]`);
    if (!existingScript && cleanClient) {
      try {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClient}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      } catch (e) {
        console.warn('AdSense script injection warning:', e);
      }
    }
  }, [isPlacementEnabled, isTestMode, cleanClient]);

  // 3. Trigger adsbygoogle.push safely
  useEffect(() => {
    if (!isPlacementEnabled || isTestMode || adPushed) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current) {
          // Check if ad blocker blocked the ins element or adsbygoogle
          if ((window as any).adsbygoogle === undefined) {
            setAdBlocked(true);
            return;
          }
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setAdPushed(true);
        }
      } catch (err) {
        console.warn('[AdSense] Slot push notice:', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isPlacementEnabled, isTestMode, adPushed]);

  if (!isPlacementEnabled) {
    return null;
  }

  // Dimension helpers by placement for layout stability (prevent CLS)
  const containerStyles = {
    header: 'min-h-[90px] max-w-5xl mx-auto my-6',
    inArticle: 'min-h-[140px] max-w-3xl mx-auto my-8',
    sidebar: 'min-h-[250px] w-full my-4',
  }[placement];

  // =========================================================================
  // TEST / PLACEHOLDER / ADMIN PREVIEW MODE
  // Displays when no official ca-pub ID is connected or in test preview mode
  // =========================================================================
  if (isTestMode || adBlocked) {
    if (!isAdmin && !adsConfig?.testMode) {
      // Clean fallback for students if ad blocker is active or no ID configured
      return null;
    }

    return (
      <div
        className={`w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 p-4 text-center transition-all ${containerStyles} ${className}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Google AdSense • {placement.toUpperCase()} AD PLACEMENT</span>
            {isTestMode && (
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px]">
                Preview Mode
              </span>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-md">
            {isDefaultClient ? (
              <span>
                Ad slot active: Connect your <b>Google AdSense Publisher ID</b> in Admin Studio to serve live monetization ads.
              </span>
            ) : (
              <span>
                Live Google Ads enabled with Client <b>{cleanClient}</b> {slotId ? `(Slot #${slotId})` : '(Auto Format)'}.
              </span>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Configure in <b>Admin Dashboard &rarr; SEO &amp; Ads</b></span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // LIVE GOOGLE ADSENSE INS CONTAINER
  // =========================================================================
  return (
    <div
      className={`w-full overflow-hidden text-center my-4 ${containerStyles} ${className}`}
      data-ad-placement={placement}
    >
      {/* Policy compliant sponsored label */}
      <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-600 mb-1">
        Advertisement
      </div>

      <div className="w-full flex justify-center items-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={cleanClient}
          {...(slotId ? { 'data-ad-slot': slotId } : {})}
          data-ad-format={placement === 'inArticle' ? 'fluid' : 'auto'}
          {...(placement === 'inArticle' ? { 'data-ad-layout': 'in-article' } : {})}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
