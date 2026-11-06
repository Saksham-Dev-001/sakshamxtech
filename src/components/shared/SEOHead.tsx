import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'SakshamXTech | Complete Technology, Learning, Cloud & Opportunities',
  description = 'Your one-stop platform for Google Cloud Arcade, Unstop POTD Solutions, C Academy, Tech Blogs, Internships, Hackathons, and Free Swags.',
  canonicalPath = '/',
  image,
  noIndex = false,
}) => {
  useEffect(() => {
    const fullTitle = title.includes('SakshamXTech') ? title : `${title} | SakshamXTech`;
    document.title = fullTitle;

    const setMeta = (nameOrProp: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector(`meta[${nameOrProp}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameOrProp, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', window.location.href);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:card', 'summary_large_image');

    const defaultImage = `${window.location.origin}/assets/branding/saksham_banner.png`;
    const resolvedImage = image
      ? (image.startsWith('http://') || image.startsWith('https://')
          ? image
          : `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`)
      : defaultImage;

    setMeta('property', 'og:image', resolvedImage);
    setMeta('name', 'twitter:image', resolvedImage);

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow');
    }

    // Scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [title, description, canonicalPath, image, noIndex]);

  return null;
};
