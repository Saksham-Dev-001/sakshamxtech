import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import https from 'node:https';
import { defineConfig, Plugin } from 'vite';

function youtubeFeedPlugin(): Plugin {
  return {
    name: 'youtube-feed-proxy',
    configureServer(server) {
      server.middlewares.use('/api/youtube-feed', (req, res) => {
        const reqUrl = new URL(req.url || '', 'http://localhost:3000');
        const channelId = reqUrl.searchParams.get('channel_id') || 'UCn1yGwm9e3VoYenlzuIzw5g';
        const ytFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

        const proxyReq = https.get(
          ytFeedUrl,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/xml, text/xml, */*',
            },
          },
          (ytRes) => {
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Cache-Control', 'no-cache');
            ytRes.pipe(res);
          }
        );

        proxyReq.on('error', (err) => {
          console.error('[YouTube Dev Proxy Error]:', err.message);
          res.statusCode = 502;
          res.end(`Proxy error: ${err.message}`);
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    define: {
      'process.env': {},
    },
    plugins: [react(), tailwindcss(), youtubeFeedPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
