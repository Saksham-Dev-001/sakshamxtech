// Dynamic Open Graph & Social Preview Generator for SakshamXTech
// Serves rich link previews (Title, Summary, Cover Image) to WhatsApp, Telegram, Discord, Twitter & Facebook bots

const STATIC_BLOG_FALLBACKS = {
  'google-student-ambassador-2026-guide': {
    title: 'Google Student Ambassador 2026: Zero to Hero Guide & Registration Link',
    description: 'Complete step-by-step application blueprint by Saksham Sharma. How to crack selection rounds, showcase community leadership, and claim guaranteed Google swag kits.',
    image: 'https://i.ytimg.com/vi/JVE_m3awBTU/hqdefault.jpg',
  },
  'how-to-complete-getting-started-with-cloud': {
    title: 'How to Complete Getting Started with Cloud | Google Cloud Arcade',
    description: 'A step-by-step master walkthrough on how to complete Google Cloud foundational labs, configure Cloud Shell, and earn maximum points in record time.',
    image: 'https://sakshamxtech.vercel.app/assets/branding/arcade_skill_badges.png',
  },
  'c-programming-roadmap-for-beginners': {
    title: 'C Programming Roadmap for Beginners | SakshamXTech',
    description: 'A complete roadmap to learn C programming from scratch. Master pointers, dynamic memory allocation, data structures, and prepare for systems coding interviews.',
    image: 'https://sakshamxtech.vercel.app/assets/branding/arcade_1.png',
  },
  'google-cloud-arcade-champion-swags-guide-2026': {
    title: 'Google Cloud Arcade 2026: Official Roadmap to Unlock Champion Tier Swags',
    description: 'The ultimate blueprint to reach 75+ Arcade points, complete trivia milestones, and claim the exclusive Google Cloud hoodie, backpack, and smart bottle.',
    image: 'https://i.ytimg.com/vi/InMCIxL2Azk/hqdefault.jpg',
  },
  'unstop-potd-daily-streak-strategy-masterclass': {
    title: 'Unstop POTD Streak Masterclass: How to Solve Daily Challenges in 10 Minutes',
    description: 'Learn pattern recognition for greedy, two pointers, and dynamic programming problems to keep your 100-day Unstop streak alive and win exclusive goodies.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  'how-to-crack-tech-internships-off-campus-guide': {
    title: 'The Off-Campus Internship Playbook: Cold Emailing, Resume ATS & GitHub Projects',
    description: 'A comprehensive guide on how tier-3 college students can land high-paying software engineering internships through proof of work and open source.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  },
};

export default async function handler(req, res) {
  const { type = 'blog', slug = '' } = req.query;

  const siteOrigin = 'https://sakshamxtech.vercel.app';
  let title = 'SakshamXTech | Complete Technology, Learning, Cloud & Opportunities';
  let description = 'Learn, build, and explore Google Cloud Arcade, Unstop POTD solutions, C Academy, tech blogs, and free swags.';
  let image = `${siteOrigin}/assets/branding/saksham_banner.png`;
  let pageUrl = `${siteOrigin}/${type === 'blog' ? 'blogs' : type}/${slug}`;

  // Helper to ensure image URLs are fully qualified absolute URLs
  const toAbsoluteUrl = (img) => {
    if (!img) return `${siteOrigin}/assets/branding/saksham_banner.png`;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const cleanPath = img.startsWith('/') ? img : `/${img}`;
    return `${siteOrigin}${cleanPath}`;
  };

  try {
    if (type === 'blog' && slug) {
      // 1. Try static fallback dictionary first
      if (STATIC_BLOG_FALLBACKS[slug]) {
        title = STATIC_BLOG_FALLBACKS[slug].title;
        description = STATIC_BLOG_FALLBACKS[slug].description;
        image = toAbsoluteUrl(STATIC_BLOG_FALLBACKS[slug].image);
      }

      // 2. Query Firestore REST API for dynamic or updated blog articles
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/sakshamxtech-7fe06/databases/(default)/documents/blogs';
      const response = await fetch(firestoreUrl, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        const doc = (data.documents || []).find((d) => {
          const docSlug = d.fields?.slug?.stringValue;
          const docId = d.fields?.id?.stringValue;
          return docSlug === slug || docId === slug;
        });

        if (doc?.fields) {
          title = doc.fields.title?.stringValue || title;
          description = doc.fields.summary?.stringValue || doc.fields.content?.stringValue?.slice(0, 180) || description;
          if (doc.fields.coverImage?.stringValue && !doc.fields.coverImage.stringValue.startsWith('data:')) {
            image = toAbsoluteUrl(doc.fields.coverImage.stringValue);
          } else if (doc.fields.youtubeVideoId?.stringValue) {
            image = `https://i.ytimg.com/vi/${doc.fields.youtubeVideoId.stringValue}/hqdefault.jpg`;
          }
        }
      }
    } else if (type === 'arcade' && slug) {
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/sakshamxtech-7fe06/databases/(default)/documents/arcadeSolutions';
      const response = await fetch(firestoreUrl, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        const doc = (data.documents || []).find((d) => {
          const docSlug = d.fields?.slug?.stringValue;
          const docCode = d.fields?.labCode?.stringValue;
          return docSlug === slug || docCode?.toLowerCase() === slug.toLowerCase();
        });
        if (doc?.fields) {
          title = `${doc.fields.labCode?.stringValue || ''}: ${doc.fields.title?.stringValue || ''} | Google Cloud Arcade Solution`;
          description = doc.fields.description?.stringValue || description;
          if (doc.fields.youtubeVideoId?.stringValue) {
            image = `https://i.ytimg.com/vi/${doc.fields.youtubeVideoId.stringValue}/hqdefault.jpg`;
          }
        }
      }
    } else if (type === 'unstop' && slug) {
      const cleanDay = slug.replace(/^day-/, '');
      const firestoreUrl = 'https://firestore.googleapis.com/v1/projects/sakshamxtech-7fe06/databases/(default)/documents/unstopProblems';
      const response = await fetch(firestoreUrl, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        const doc = (data.documents || []).find((d) => {
          return String(d.fields?.dayNumber?.integerValue) === cleanDay || d.fields?.id?.stringValue === slug;
        });
        if (doc?.fields) {
          title = `Day ${doc.fields.dayNumber?.integerValue}: ${doc.fields.title?.stringValue} | Unstop POTD Solution`;
          description = doc.fields.description?.stringValue || description;
          image = 'https://sakshamxtech.vercel.app/assets/branding/potd_day7.png';
        }
      }
    }
  } catch (err) {
    console.warn('[OG Generator] Error querying Firestore:', err);
  }

  // Escape HTML entities to prevent broken meta tags
  const escapeHtml = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImage = escapeHtml(toAbsoluteUrl(image));
  const safeUrl = escapeHtml(pageUrl);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn / Discord -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="SakshamXTech" />
  <meta property="og:url" content="${safeUrl}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:image:secure_url" content="${safeImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@sakshamxtech" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${safeImage}" />

  <!-- Instant redirect for real browser visitors -->
  <meta http-equiv="refresh" content="0;url=${safeUrl}" />
  <script>window.location.replace("${safeUrl}");</script>
</head>
<body style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: auto;">
  <h2>${safeTitle}</h2>
  <p>${safeDesc}</p>
  <img src="${safeImage}" alt="${safeTitle}" style="width: 100%; border-radius: 12px; margin-top: 1rem;" />
  <p><a href="${safeUrl}">Continue reading on SakshamXTech &rarr;</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
}
