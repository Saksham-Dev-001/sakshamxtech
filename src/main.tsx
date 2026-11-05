import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Purge legacy broken service worker caches (unbricks any users stuck on old cache)
if ('caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      if (name === 'sakshamxtech-v1') {
        caches.delete(name);
      }
    }
  }).catch(() => {});
}

// 2. Auto-recover from Vite dynamic chunk 404s after new Vercel deployments
window.addEventListener('vite:preloadError', (event) => {
  console.warn('New deployment detected (Vite preload error). Auto-reloading to fetch latest assets...');
  window.location.reload();
});

// 3. Register PWA Service Worker with auto-update
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Force update check on every page load
        reg.update().catch(() => {});
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
