import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'course' | 'techArticle';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'SakshamXTech | Complete Technology, Learning, Cloud & Opportunities',
  description = 'Your one-stop platform for Google Cloud Arcade, Unstop POTD Solutions, C Academy, Tech Blogs, Internships, Hackathons, and Free Swags.',
  canonicalPath = '/',
  image,
  noIndex = false,
  type = 'website',
  keywords,
  author,
  publishedTime,
  modifiedTime,
  section,
  breadcrumbs,
  jsonLd,
}) => {
  const { siteSettings } = useApp();

  useEffect(() => {
    // 1. Dynamic Page Title
    const fullTitle = title.includes('SakshamXTech') ? title : `${title} | SakshamXTech`;
    document.title = fullTitle;

    // Helper to set or update meta tag by name or property
    const setMeta = (nameOrProp: 'name' | 'property', key: string, content?: string | null) => {
      if (!content) {
        const existing = document.querySelector(`meta[${nameOrProp}="${key}"]`);
        if (existing) existing.remove();
        return;
      }
      let meta = document.querySelector(`meta[${nameOrProp}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameOrProp, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 2. Canonical Tag (Strictly prevents duplicate content penalties across query params)
    const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://sakshamxtech.vercel.app';
    const cleanCanonical = canonicalPath.startsWith('http')
      ? canonicalPath
      : `${siteOrigin}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;
    
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', cleanCanonical);

    // 3. Primary SEO Meta Tags
    setMeta('name', 'description', description);
    
    // Target Keywords (Combines page keywords with site defaults)
    const defaultKeywords = siteSettings?.seoConfig?.defaultKeywords || [
      'Google Cloud Arcade 2026',
      'Unstop POTD Solutions',
      'C Programming Academy',
      'Free Swags & Goodies',
      'Tech Internships 2026',
      'Hackathons',
      'Saksham Sharma',
      'SakshamXTech',
    ];
    const combinedKeywords = Array.from(new Set([...(keywords || []), ...defaultKeywords])).join(', ');
    setMeta('name', 'keywords', combinedKeywords);

    // Author
    const finalAuthor = author || siteSettings?.seoConfig?.authorName || siteSettings?.creatorName || 'Saksham Sharma';
    setMeta('name', 'author', finalAuthor);

    // 4. Search Console & Webmaster Verification Tags
    if (siteSettings?.seoConfig?.googleSiteVerification) {
      setMeta('name', 'google-site-verification', siteSettings.seoConfig.googleSiteVerification);
    }
    if (siteSettings?.seoConfig?.bingSiteVerification) {
      setMeta('name', 'msvalidate.01', siteSettings.seoConfig.bingSiteVerification);
    }

    // 4b. Google AdSense Site Ownership & Verification Tag
    if (siteSettings?.adsConfig?.adClient) {
      const cleanClient = siteSettings.adsConfig.adClient.trim();
      const pubId = cleanClient.startsWith('ca-pub-') ? cleanClient : `ca-${cleanClient}`;
      if (pubId.length >= 15 && !pubId.includes('0000000000000000')) {
        setMeta('name', 'google-adsense-account', pubId);

        // Also inject Google AdSense review script if not yet loaded
        const scriptId = 'google-adsense-site-script';
        if (!document.getElementById(scriptId)) {
          try {
            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
          } catch (e) {
            console.warn('AdSense script injection warning:', e);
          }
        }
      }
    }

    // 5. Open Graph Meta Tags (WhatsApp, Telegram, LinkedIn, Discord, Facebook)
    const defaultImage = siteSettings?.seoConfig?.ogDefaultImage || `${siteOrigin}/assets/branding/saksham_banner.png`;
    const resolvedImage = image
      ? (image.startsWith('http://') || image.startsWith('https://')
          ? image
          : `${siteOrigin}${image.startsWith('/') ? '' : '/'}${image}`)
      : defaultImage;

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', cleanCanonical);
    setMeta('property', 'og:site_name', siteSettings?.brandName || 'SakshamXTech');
    setMeta('property', 'og:locale', 'en_US');
    setMeta('property', 'og:image', resolvedImage);
    setMeta('property', 'og:image:secure_url', resolvedImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:type', type === 'article' || type === 'techArticle' ? 'article' : 'website');

    // Article Specific Open Graph tags
    if (type === 'article' || type === 'techArticle') {
      if (publishedTime) setMeta('property', 'article:published_time', publishedTime);
      if (modifiedTime || publishedTime) setMeta('property', 'article:modified_time', modifiedTime || publishedTime);
      setMeta('property', 'article:author', finalAuthor);
      if (section) setMeta('property', 'article:section', section);
      (keywords || []).slice(0, 6).forEach((tag, idx) => {
        setMeta('property', `article:tag:${idx}`, tag);
      });
    }

    // 6. Twitter / X Cards
    const twitterHandle = siteSettings?.seoConfig?.twitterHandle || '@sakshamxtech';
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', twitterHandle);
    setMeta('name', 'twitter:creator', twitterHandle);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedImage);

    // 7. Search Engine Robots & Snippet Controls
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    if (noIndex) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      metaRobots.setAttribute(
        'content',
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );
    }

    // 8. JSON-LD Rich Snippet Schema Generation (Google Rich Results / Sitelinks)
    const schemaGraph: Record<string, any>[] = [
      // WebSite Schema with Sitelinks Search Box
      {
        '@type': 'WebSite',
        '@id': `${siteOrigin}/#website`,
        'url': siteOrigin,
        'name': siteSettings?.brandName || 'SakshamXTech',
        'description': siteSettings?.creatorBio || description,
        'inLanguage': 'en-US',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${siteOrigin}/blogs?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      // Organization / Creator Schema with Social Media SameAs
      {
        '@type': 'Organization',
        '@id': `${siteOrigin}/#organization`,
        'name': siteSettings?.brandName || 'SakshamXTech',
        'url': siteOrigin,
        'logo': {
          '@type': 'ImageObject',
          'url': `${siteOrigin}/favicon.png`,
          'width': 512,
          'height': 512,
        },
        'founder': {
          '@type': 'Person',
          'name': finalAuthor,
          'jobTitle': siteSettings?.creatorTitle || 'Cloud Architect & Tech Creator',
        },
        'sameAs': [
          siteSettings?.socialLinks?.youtube || 'https://youtube.com/@sakshamxtech',
          siteSettings?.socialLinks?.telegram || 'https://t.me/SakshamXTech',
          siteSettings?.socialLinks?.linkedin || 'https://linkedin.com/in/saksham-sharma-tech',
          siteSettings?.socialLinks?.instagram || 'https://instagram.com/sakshamxtech',
          siteSettings?.socialLinks?.discord || 'https://discord.gg/sakshamxtech',
          siteSettings?.socialLinks?.github || 'https://github.com/sakshamxtech',
          siteSettings?.socialLinks?.twitter || 'https://twitter.com/sakshamxtech',
        ].filter(Boolean),
      },
    ];

    // BreadcrumbList Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemaGraph.push({
        '@type': 'BreadcrumbList',
        '@id': `${cleanCanonical}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': siteOrigin,
          },
          ...breadcrumbs.map((b, idx) => ({
            '@type': 'ListItem',
            'position': idx + 2,
            'name': b.name,
            'item': b.path.startsWith('http') ? b.path : `${siteOrigin}${b.path.startsWith('/') ? '' : '/'}${b.path}`,
          })),
        ],
      });
    }

    // Article / BlogPosting Schema
    if (type === 'article' || type === 'techArticle') {
      schemaGraph.push({
        '@type': type === 'techArticle' ? 'TechArticle' : 'BlogPosting',
        '@id': `${cleanCanonical}#article`,
        'isPartOf': {
          '@id': `${siteOrigin}/#website`,
        },
        'headline': title,
        'description': description,
        'mainEntityOfPage': cleanCanonical,
        'datePublished': publishedTime || new Date().toISOString(),
        'dateModified': modifiedTime || publishedTime || new Date().toISOString(),
        'image': resolvedImage,
        'author': {
          '@type': 'Person',
          'name': finalAuthor,
          'url': `${siteOrigin}/#organization`,
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'SakshamXTech',
          'logo': {
            '@type': 'ImageObject',
            'url': `${siteOrigin}/favicon.png`,
          },
        },
      });
    }

    // Course Schema (For C Academy Lessons)
    if (type === 'course') {
      schemaGraph.push({
        '@type': 'Course',
        '@id': `${cleanCanonical}#course`,
        'name': title,
        'description': description,
        'provider': {
          '@type': 'Organization',
          'name': 'SakshamXTech C Programming Academy',
          'sameAs': siteOrigin,
        },
        'educationalLevel': 'Beginner to Advanced Systems Programming',
      });
    }

    // Append any custom jsonLd
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemaGraph.push(...jsonLd);
      } else {
        schemaGraph.push(jsonLd);
      }
    }

    // Inject or update application/ld+json script tag
    let schemaScript = document.getElementById('sakshamxtech-seo-schema') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'sakshamxtech-seo-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemaGraph,
    });
  }, [
    title,
    description,
    canonicalPath,
    image,
    noIndex,
    type,
    keywords,
    author,
    publishedTime,
    modifiedTime,
    section,
    breadcrumbs,
    jsonLd,
    siteSettings,
  ]);

  return null;
};
