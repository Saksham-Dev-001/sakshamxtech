// Dynamic Open Graph & Server-Side Pre-rendered Content Generator for SakshamXTech
// Serves rich semantic HTML and link previews to Search Bots, AI Crawlers, and Social Previews

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
  const { type = 'home', slug = '' } = req.query;

  const siteOrigin = 'https://sakshamxtech.vercel.app';
  let title = 'SakshamXTech | Complete Technology, Learning, Cloud & Opportunities';
  let description = 'Learn, build, and explore Google Cloud Arcade 2026, Unstop POTD solutions, C Academy, tech blogs, internships, and free swags. Founded by Saksham Sharma.';
  let image = `${siteOrigin}/assets/branding/saksham_banner.png`;
  let pageUrl = `${siteOrigin}/`;
  let extraContent = '';

  const toAbsoluteUrl = (img) => {
    if (!img) return `${siteOrigin}/assets/branding/saksham_banner.png`;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const cleanPath = img.startsWith('/') ? img : `/${img}`;
    return `${siteOrigin}${cleanPath}`;
  };

  try {
    if (type === 'home' || !type) {
      pageUrl = `${siteOrigin}/`;
      title = 'SakshamXTech | Complete Technology, Learning, Cloud & Opportunities';
      description = 'Your comprehensive platform for Google Cloud Arcade 2026, Unstop Problem of the Day solutions, 30-Day C Programming Academy, tech internships, and free developer swags. Founded by Saksham Sharma.';
      image = `${siteOrigin}/assets/branding/saksham_banner.png`;
      extraContent = `
        <section>
          <h3>Platform Highlights:</h3>
          <ul>
            <li><strong>Google Cloud Arcade 2026:</strong> Walkthroughs, points calculator, and milestone roadmaps for Champion Tier swags.</li>
            <li><strong>C Programming Academy:</strong> 30 comprehensive lectures covering GCC pipelines, memory layout, pointers, and data structures.</li>
            <li><strong>Unstop POTD:</strong> Daily algorithms and solutions for maintaining streak.</li>
            <li><strong>Tech Roadmaps & Blogs:</strong> In-depth articles by Saksham Sharma.</li>
          </ul>
        </section>
      `;
    } else if (type === 'blogs') {
      pageUrl = `${siteOrigin}/blogs`;
      title = 'Technical Blogs & Engineering Roadmaps | SakshamXTech';
      description = 'In-depth software engineering guides, Google Cloud blueprints, Unstop POTD masterclasses, and career roadmaps.';
    } else if (type === 'blog' && slug) {
      pageUrl = `${siteOrigin}/blogs/${slug}`;
      if (STATIC_BLOG_FALLBACKS[slug]) {
        title = STATIC_BLOG_FALLBACKS[slug].title;
        description = STATIC_BLOG_FALLBACKS[slug].description;
        image = toAbsoluteUrl(STATIC_BLOG_FALLBACKS[slug].image);
      }

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
          description = doc.fields.summary?.stringValue || doc.fields.content?.stringValue?.slice(0, 240) || description;
          if (doc.fields.coverImage?.stringValue && !doc.fields.coverImage.stringValue.startsWith('data:')) {
            image = toAbsoluteUrl(doc.fields.coverImage.stringValue);
          } else if (doc.fields.youtubeVideoId?.stringValue) {
            image = `https://i.ytimg.com/vi/${doc.fields.youtubeVideoId.stringValue}/hqdefault.jpg`;
          }
          if (doc.fields.content?.stringValue) {
            extraContent = `<article><h4>Article Excerpt:</h4><p>${doc.fields.content.stringValue.slice(0, 800)}...</p></article>`;
          }
        }
      }
    } else if (type === 'arcade-hub') {
      pageUrl = `${siteOrigin}/google-arcade`;
      title = 'Google Cloud Arcade 2026 Hub & Points Calculator | SakshamXTech';
      description = 'Complete guides, skill badges solutions, points calculator, and Champion Tier swags roadmap for Google Cloud Arcade 2026.';
    } else if (type === 'arcade' && slug) {
      pageUrl = `${siteOrigin}/arcade/${slug}`;
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
    } else if (type === 'unstop-hub') {
      pageUrl = `${siteOrigin}/unstop`;
      title = 'Unstop Problem of the Day (POTD) Solutions & Streak | SakshamXTech';
      description = 'Daily competitive programming challenges, algorithmic breakdown, and optimal solutions in C++, Python, and Java.';
    } else if (type === 'unstop' && slug) {
      pageUrl = `${siteOrigin}/unstop/${slug}`;
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
          image = `${siteOrigin}/assets/branding/potd_day7.png`;
        }
      }
    } else if (type === 'c-academy') {
      pageUrl = `${siteOrigin}/c-academy`;
      title = 'C Programming Academy | 30-Day Comprehensive Systems Course | SakshamXTech';
      description = 'Learn C programming from scratch with 30 structured lectures, RAM memory diagrams, pointers deep-dive, GCC pipeline, and interactive online compiler.';
    } else if (type === 'c-lesson' && slug) {
      pageUrl = `${siteOrigin}/c-academy/${slug}`;
      const dayNum = slug.replace(/^day-/, '');
      title = `Day ${dayNum}: C Programming Master Lecture | SakshamXTech`;
      description = `Complete Day ${dayNum} lecture notes, code snippets, memory layouts, and practice exercises for C Programming Academy by Saksham Sharma.`;
    } else if (type === 'privacy') {
      pageUrl = `${siteOrigin}/privacy`;
      title = 'Privacy Policy | SakshamXTech';
      description = 'SakshamXTech transparent privacy policy covering Google AdSense, advertising cookies, student data protection, and user opt-out information.';
    } else if (type === 'terms') {
      pageUrl = `${siteOrigin}/terms`;
      title = 'Terms and Conditions | SakshamXTech';
      description = 'SakshamXTech terms of service regarding educational tutorials, online compiler usage, and non-affiliation disclosures.';
    }
  } catch (err) {
    console.warn('[OG Generator] Error:', err);
  }

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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />
  <link rel="canonical" href="${safeUrl}" />

  <!-- Google AdSense Account Ownership & Verification Tag -->
  <meta name="google-adsense-account" content="ca-pub-5987406991972289" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5987406991972289" crossorigin="anonymous"></script>

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

  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; background: #f8fafc; }
    header { border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 2rem; }
    nav a { margin-right: 1rem; color: #0284c7; text-decoration: none; font-size: 0.9rem; font-weight: 600; }
    h1 { font-size: 2rem; color: #0f172a; margin-bottom: 0.5rem; }
    p { font-size: 1.05rem; color: #475569; }
    .hero-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 1rem; margin: 1.5rem 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .btn { display: inline-block; padding: 0.75rem 1.5rem; background: #0284c7; color: #ffffff; text-decoration: none; border-radius: 0.75rem; font-weight: bold; margin-top: 1rem; }
  </style>
</head>
<body>
  <header>
    <nav>
      <a href="${siteOrigin}/">Home</a>
      <a href="${siteOrigin}/google-arcade">Google Cloud Arcade</a>
      <a href="${siteOrigin}/c-academy">C Academy</a>
      <a href="${siteOrigin}/unstop">Unstop POTD</a>
      <a href="${siteOrigin}/blogs">Tech Blogs</a>
      <a href="${siteOrigin}/privacy">Privacy Policy</a>
    </nav>
  </header>

  <main>
    <h1>${safeTitle}</h1>
    <p>${safeDesc}</p>
    ${safeImage ? `<img src="${safeImage}" alt="${safeTitle}" class="hero-img" />` : ''}
    ${extraContent}
    <p><a href="${safeUrl}" class="btn">Open Interactive Experience on SakshamXTech &rarr;</a></p>
  </main>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
}
