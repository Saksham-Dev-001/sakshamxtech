import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { ThreeBackground } from './components/shared/ThreeBackground';
import { SearchModal } from './components/shared/SearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ArcadePage } from './pages/ArcadePage';
import { ArcadeDetailPage } from './pages/ArcadeDetailPage';
import { ArcadeCalculatorPage } from './pages/ArcadeCalculatorPage';
import { ArcadeTrackerPage } from './pages/ArcadeTrackerPage';
import { ArcadeSwagsPage } from './pages/ArcadeSwagsPage';
import { UnstopPage } from './pages/UnstopPage';
import { UnstopDetailPage } from './pages/UnstopDetailPage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { OpportunityDetailPage } from './pages/OpportunityDetailPage';
import { SwagsPage } from './pages/SwagsPage';
import { CAcademyPage } from './pages/CAcademyPage';
import { CLessonPage } from './pages/CLessonPage';
import { CPlaygroundPage } from './pages/CPlaygroundPage';
import { ToolsPage } from './pages/ToolsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { LegalPage } from './pages/LegalPages';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SecretGateModal } from './components/shared/SecretGateModal';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

function AppContent() {
  const { trackEvent, theme } = useApp();
  const { isAdmin } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    trackEvent('pageView', window.location.pathname || '/');
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      trackEvent('pageView', path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    trackEvent('pageView', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderRoute = () => {
    // 1. Homepage
    if (currentPath === '' || currentPath === '/') {
      return <HomePage navigate={navigate} />;
    }

    // 2. Google Cloud Arcade
    if (currentPath === '/google-arcade' || currentPath === '/arcade') {
      return <ArcadePage navigate={navigate} />;
    }
    if (currentPath.startsWith('/google-arcade/')) {
      const slug = currentPath.replace('/google-arcade/', '');
      return <ArcadeDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath.startsWith('/arcade/')) {
      const slug = currentPath.replace('/arcade/', '');
      return <ArcadeDetailPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/arcade-calculator') {
      return <ArcadePage navigate={navigate} initialTab="calculator" />;
    }
    if (currentPath === '/arcade-tracker') {
      return <ArcadePage navigate={navigate} initialTab="tracker" />;
    }
    if (currentPath === '/arcade-swags') {
      return <ArcadePage navigate={navigate} initialTab="swags" />;
    }

    // 3. Unstop POTD
    if (currentPath === '/unstop') {
      return <UnstopPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/unstop/')) {
      const slug = currentPath.replace('/unstop/', '');
      return <UnstopDetailPage slug={slug} navigate={navigate} />;
    }

    // 4. Blogs
    if (currentPath === '/blogs') {
      return <BlogsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/blogs/')) {
      const slug = currentPath.replace('/blogs/', '');
      return <BlogDetailPage slug={slug} navigate={navigate} />;
    }

    // 5. Opportunities
    if (currentPath === '/opportunities') {
      return <OpportunitiesPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/opportunities/')) {
      const slug = currentPath.replace('/opportunities/', '');
      return <OpportunityDetailPage slug={slug} navigate={navigate} />;
    }

    // 6. Free Swags
    if (currentPath === '/swags') {
      return <SwagsPage navigate={navigate} />;
    }

    // 7. C Academy
    if (currentPath === '/c-academy') {
      return <CAcademyPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/c-academy/')) {
      const slug = currentPath.replace('/c-academy/', '');
      return <CLessonPage slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/c-playground') {
      return <CPlaygroundPage navigate={navigate} />;
    }

    // 8. Tools & Resources
    if (currentPath === '/tools') {
      return <ToolsPage navigate={navigate} />;
    }
    if (currentPath === '/resources') {
      return <ResourcesPage navigate={navigate} />;
    }

    // 9. About & Contact
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    // 10. Search Page
    if (currentPath === '/search') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q') || '';
      return <SearchResultsPage navigate={navigate} initialQuery={query} />;
    }

    // 11. Legal Pages
    if (currentPath === '/privacy') {
      return <LegalPage type="privacy" navigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <LegalPage type="terms" navigate={navigate} />;
    }

    // 12. Stealth Protected Management Route (Decoy 404 for unauthenticated visitors)
    if (currentPath === '/admin' || currentPath === '/admin/login' || currentPath === '/workspace') {
      if (isAdmin) {
        return <AdminDashboard navigate={navigate} />;
      }
      return <NotFoundPage navigate={navigate} />;
    }

    // Fallback 404
    return <NotFoundPage navigate={navigate} />;
  };

  const isAdminRoute = currentPath === '/admin' || currentPath === '/admin/login' || currentPath === '/workspace';

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-[#030712] text-slate-100 selection:bg-indigo-500/30 selection:text-cyan-200'
        : 'bg-[#f8fafc] text-slate-900 selection:bg-blue-500/20 selection:text-blue-700'
    }`}>
      {/* Interactive background in dark mode */}
      {theme === 'dark' && <ThreeBackground />}

      {/* Navigation Header (Hidden on admin studio for dedicated management view) */}
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          navigate={navigate}
          openSearch={() => setSearchModalOpen(true)}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1 relative z-10">
        {renderRoute()}
      </main>

      {/* Mobile Bottom Navigation (Hidden on admin studio) */}
      {!isAdminRoute && (
        <BottomNav
          currentPath={currentPath}
          navigate={navigate}
          openSearch={() => setSearchModalOpen(true)}
        />
      )}

      {/* Footer (Hidden on admin studio) */}
      {!isAdminRoute && <Footer navigate={navigate} />}

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        navigate={navigate}
      />

      {/* Stealth Master Gate Modal */}
      <SecretGateModal navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
