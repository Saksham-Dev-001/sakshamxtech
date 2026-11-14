// Dynamic XML Sitemap Generator for SakshamXTech
// Auto-discovers all published blogs, arcade solutions, unstop POTD, and C Academy days from Firestore

export default async function handler(req, res) {
  const siteOrigin = 'https://sakshamxtech.vercel.app';
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${siteOrigin}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${siteOrigin}/google-arcade`, priority: '0.95', changefreq: 'daily' },
    { loc: `${siteOrigin}/unstop`, priority: '0.95', changefreq: 'daily' },
    { loc: `${siteOrigin}/blogs`, priority: '0.95', changefreq: 'daily' },
    { loc: `${siteOrigin}/c-academy`, priority: '0.90', changefreq: 'weekly' },
    { loc: `${siteOrigin}/opportunities`, priority: '0.90', changefreq: 'daily' },
    { loc: `${siteOrigin}/tools`, priority: '0.80', changefreq: 'weekly' },
    { loc: `${siteOrigin}/resources`, priority: '0.80', changefreq: 'weekly' },
  ];

  // 30 Days of C Academy
  for (let i = 1; i <= 30; i++) {
    staticUrls.push({
      loc: `${siteOrigin}/c-academy/day-${i}`,
      priority: '0.75',
      changefreq: 'monthly',
      lastmod: today,
    });
  }

  const dynamicUrls = [];

  // Helper to query Firestore REST collection
  const fetchFirestoreCollection = async (collectionName) => {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/sakshamxtech-7fe06/databases/(default)/documents/${collectionName}`;
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const data = await response.json();
        return data.documents || [];
      }
    } catch (e) {
      console.warn(`[Sitemap] Failed to fetch ${collectionName}:`, e);
    }
    return [];
  };

  try {
    const [blogDocs, arcadeDocs, unstopDocs] = await Promise.all([
      fetchFirestoreCollection('blogs'),
      fetchFirestoreCollection('arcadeSolutions'),
      fetchFirestoreCollection('unstopProblems'),
    ]);

    // Process blogs
    blogDocs.forEach((d) => {
      const slug = d.fields?.slug?.stringValue || d.fields?.id?.stringValue;
      const status = d.fields?.status?.stringValue || 'published';
      const publishedAt = d.fields?.publishedAt?.stringValue || today;
      if (slug && status === 'published') {
        dynamicUrls.push({
          loc: `${siteOrigin}/blogs/${slug}`,
          priority: '0.85',
          changefreq: 'weekly',
          lastmod: publishedAt.slice(0, 10),
        });
      }
    });

    // Process arcade solutions
    arcadeDocs.forEach((d) => {
      const slug = d.fields?.slug?.stringValue;
      if (slug) {
        dynamicUrls.push({
          loc: `${siteOrigin}/arcade/${slug}`,
          priority: '0.80',
          changefreq: 'weekly',
          lastmod: today,
        });
      }
    });

    // Process unstop problems
    unstopDocs.forEach((d) => {
      const slug = d.fields?.slug?.stringValue;
      const dayNum = d.fields?.dayNumber?.integerValue;
      const targetSlug = slug || (dayNum ? `day-${dayNum}` : null);
      if (targetSlug) {
        dynamicUrls.push({
          loc: `${siteOrigin}/unstop/${targetSlug}`,
          priority: '0.80',
          changefreq: 'weekly',
          lastmod: today,
        });
      }
    });
  } catch (err) {
    console.warn('[Sitemap] Dynamic fetch error:', err);
  }

  // Deduplicate and assemble
  const allUrlsMap = new Map();
  [...staticUrls, ...dynamicUrls].forEach((item) => {
    allUrlsMap.set(item.loc, item);
  });

  const urlEntries = Array.from(allUrlsMap.values())
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq || 'weekly'}</changefreq>
    <priority>${u.priority || '0.7'}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=14400, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
