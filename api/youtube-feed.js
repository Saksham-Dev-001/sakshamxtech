// Vercel Serverless Function: High-Speed YouTube Channel XML Feed Proxy
// Proxies YouTube's official RSS feed server-side with zero CORS issues and fast edge caching

export default async function handler(req, res) {
  const channelId = req.query.channel_id || req.query.channelId || 'UCNbYyd_gW3G_b815n9Qp0TQ'; // @sakshamxtech default channel

  try {
    const ytUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
    const response = await fetch(ytUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `YouTube feed returned HTTP ${response.status}`,
        channelId
      });
    }

    const xmlText = await response.text();

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1800, stale-while-revalidate=86400');
    return res.status(200).send(xmlText);
  } catch (error) {
    console.error('[YouTube Feed API] Error fetching channel feed:', error);
    return res.status(500).json({
      error: 'Failed to fetch YouTube feed',
      message: error?.message || 'Unknown server error'
    });
  }
}

