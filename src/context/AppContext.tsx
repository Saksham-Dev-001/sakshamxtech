import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BlogPost,
  ArcadeSolution,
  UnstopProblem,
  Opportunity,
  SwagItem,
  CLesson,
  ResourceItem,
  SiteSettings,
  ArcadeCalculatorConfig,
  AnalyticsMetric,
  LeaderboardUser,
  YouTubeVideoItem,
} from '../types';
import { 
  fetchYouTubeVideos, 
  authenticYouTubeVideos, 
  getAuthenticYouTubeVideosWithLiveTimings, 
  relativePublished, 
  clearYouTubeCache 
} from '../services/youtubeService';
import {
  initialSiteSettings,
  initialArcadeSolutions,
  initialUnstopProblems,
  initialBlogs,
  initialOpportunities,
  initialSwags,
  initialCLessons,
  initialResources,
  initialArcadeCalculatorConfig,
  initialAnalytics,
  initialLeaderboard,
} from '../data/initialData';
import {
  saveItemToFirestore,
  deleteItemFromFirestore,
  fetchCollectionFromFirestore,
  saveDocToFirestore,
  fetchDocFromFirestore,
  logVisitorEventToFirestore,
  logYouTubeClickToFirestore,
  syncEntireDatabaseToFirestore,
  initFirebase,
  subscribeToCollection,
  subscribeToDoc,
} from '../services/firebaseService';
import {
  recordActualPageView,
  recordActualYouTubeClick,
  recordActualToolUse,
  getRecentVisitorLogs,
  getRecentYouTubeClickLogs,
  getRealDateWiseAnalytics,
  clearRealAnalytics,
  VisitorLogEntry,
  YouTubeClickEntry,
} from '../services/realAnalyticsService';
import { DateDataPoint } from '../utils/realTime';

interface AppContextType {
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, 'id' | 'views'>) => void;
  updateBlog: (id: string, blog: Partial<BlogPost>) => void;
  deleteBlog: (id: string) => void;
  arcadeSolutions: ArcadeSolution[];
  addArcadeSolution: (solution: Omit<ArcadeSolution, 'id'>) => void;
  updateArcadeSolution: (id: string, solution: Partial<ArcadeSolution>) => void;
  deleteArcadeSolution: (id: string) => void;
  unstopProblems: UnstopProblem[];
  addUnstopProblem: (problem: Omit<UnstopProblem, 'id'>) => void;
  updateUnstopProblem: (id: string, problem: Partial<UnstopProblem>) => void;
  deleteUnstopProblem: (id: string) => void;
  opportunities: Opportunity[];
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'clicksCount'>) => void;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  swags: SwagItem[];
  addSwag: (swag: Omit<SwagItem, 'id'>) => void;
  updateSwag: (id: string, swag: Partial<SwagItem>) => void;
  deleteSwag: (id: string) => void;
  cLessons: CLesson[];
  addCLesson: (lesson: Omit<CLesson, 'id'>) => void;
  updateCLesson: (id: string, lesson: Partial<CLesson>) => void;
  deleteCLesson: (id: string) => void;
  resources: ResourceItem[];
  addResource: (resource: Omit<ResourceItem, 'id' | 'downloadsCount'>) => void;
  updateResource: (id: string, resource: Partial<ResourceItem>) => void;
  deleteResource: (id: string) => void;
  arcadeCalculatorConfig: ArcadeCalculatorConfig;
  updateArcadeCalculatorConfig: (config: Partial<ArcadeCalculatorConfig>) => void;
  analytics: AnalyticsMetric;
  trackEvent: (
    eventType: 'pageView' | 'download' | 'compiler' | 'calculator' | 'youtube' | 'opportunity' | 'search',
    metadata?: string,
    extra?: { videoId?: string; videoTitle?: string; pagePath?: string }
  ) => void;
  recordActualYouTubeClick: (videoId: string, videoTitle: string, pagePath: string, clickType?: string) => void;
  getRecentVisitorLogs: (limit?: number) => VisitorLogEntry[];
  getRecentYouTubeClickLogs: (limit?: number) => YouTubeClickEntry[];
  getRealDateWiseAnalytics: (timeframe: 'today' | '7d' | '30d' | 'ytd') => {
    points: DateDataPoint[];
    summary: {
      totalVisitors: number;
      totalPageViews: number;
      totalNewUsers: number;
      totalYoutubeClicks: number;
      growthPercent: number;
    };
  };
  clearRealAnalytics: () => void;
  leaderboard: LeaderboardUser[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
  youtubeVideos: YouTubeVideoItem[];
  refreshYouTubeVideos: (force?: boolean) => Promise<void>;
  isFetchingYouTube: boolean;
  addCustomYouTubeVideo: (video: YouTubeVideoItem) => Promise<boolean>;
  deleteCustomYouTubeVideo: (id: string) => Promise<boolean>;
  saveCustomYouTubeVideos: (videos: YouTubeVideoItem[]) => Promise<boolean>;
  isFirebaseConnected: boolean;
  isFirebaseHydrated: boolean;
  cloudSyncStatus: 'connected' | 'syncing' | 'offline';
  lastCloudSyncTime: string;
  hydrateFromFirebase: (forceSeedIfEmpty?: boolean) => Promise<void>;
  syncAllToFirebase: () => Promise<{ success: boolean; syncedCounts: Record<string, number>; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PREFIX = 'sakshamxtech_db_';

const sanitizeAvatarUrl = (url?: string): string => {
  if (!url || url.includes('unsplash') || url.includes('file_00000000') || url.includes('/assets/aistudio/')) {
    return '/assets/branding/saksham_avatar.png';
  }
  return url;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with local storage fallback
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(`${PREFIX}settings`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.creatorAvatarUrl = sanitizeAvatarUrl(parsed.creatorAvatarUrl);
        return parsed;
      } catch (e) {
        return initialSiteSettings;
      }
    }
    return initialSiteSettings;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}blogs`);
    return saved ? JSON.parse(saved) : initialBlogs;
  });

  const [arcadeSolutions, setArcadeSolutions] = useState<ArcadeSolution[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}arcade`);
    return saved ? JSON.parse(saved) : initialArcadeSolutions;
  });

  const [unstopProblems, setUnstopProblems] = useState<UnstopProblem[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}unstop`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialUnstopProblems;
      }
    }
    return initialUnstopProblems;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}opportunities`);
    return saved ? JSON.parse(saved) : initialOpportunities;
  });

  const [swags, setSwags] = useState<SwagItem[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}swags`);
    return saved ? JSON.parse(saved) : initialSwags;
  });

  const [cLessons, setCLessons] = useState<CLesson[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}clessons`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialCLessons.length) {
          return parsed;
        }
        // If localStorage has fewer lessons, merge initialCLessons so all 30 are available!
        const existingMap = new Map<string, CLesson>(parsed.map((l: CLesson) => [l.id, l]));
        return initialCLessons.map((initL) => existingMap.get(initL.id) || initL);
      } catch {}
    }
    return initialCLessons;
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}resources`);
    return saved ? JSON.parse(saved) : initialResources;
  });

  const [arcadeCalculatorConfig, setArcadeCalculatorConfig] = useState<ArcadeCalculatorConfig>(() => {
    const saved = localStorage.getItem(`${PREFIX}arcade_calc`);
    return saved ? JSON.parse(saved) : initialArcadeCalculatorConfig;
  });

  const [analytics, setAnalytics] = useState<AnalyticsMetric>(() => {
    const saved = localStorage.getItem(`${PREFIX}analytics`);
    return saved ? JSON.parse(saved) : initialAnalytics;
  });

  const [leaderboard] = useState<LeaderboardUser[]>(initialLeaderboard);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('sakshamxtech_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${PREFIX}bookmarks`);
    return saved ? JSON.parse(saved) : [];
  });

  // YouTube live automatic feed state
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${PREFIX}youtube_videos`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.videoId === 'm26u-QxPw1E') {
          return parsed.map((v: YouTubeVideoItem) => ({
            ...v,
            publishedAt: v.publishedAtRaw ? relativePublished(v.publishedAtRaw) : v.publishedAt,
          }));
        }
      }
    } catch {}
    return getAuthenticYouTubeVideosWithLiveTimings();
  });
  const [isFetchingYouTube, setIsFetchingYouTube] = useState(false);

  const refreshYouTubeVideos = async (force = false) => {
    setIsFetchingYouTube(true);
    try {
      if (force) {
        clearYouTubeCache();
      }
      const live = await fetchYouTubeVideos({ forceRefresh: force });
      if (live && live.length > 0) {
        setYoutubeVideos(live);
        localStorage.setItem(`${PREFIX}youtube_videos`, JSON.stringify(live));
        saveDocToFirestore('appConfig', 'youtubeFeed', {
          lastUpdated: new Date().toISOString(),
          videos: live
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Error syncing YouTube videos:', e);
    } finally {
      setIsFetchingYouTube(false);
    }
  };

  const addCustomYouTubeVideo = async (video: YouTubeVideoItem): Promise<boolean> => {
    const updated = [video, ...youtubeVideos.filter((v) => (v.videoId || v.id) !== (video.videoId || video.id))];
    setYoutubeVideos(updated);
    localStorage.setItem(`${PREFIX}youtube_videos`, JSON.stringify(updated));
    await saveDocToFirestore('appConfig', 'youtubeFeed', {
      lastUpdated: new Date().toISOString(),
      videos: updated
    }).catch(() => {});
    return true;
  };

  const deleteCustomYouTubeVideo = async (id: string): Promise<boolean> => {
    const updated = youtubeVideos.filter((v) => v.id !== id && v.videoId !== id);
    setYoutubeVideos(updated);
    localStorage.setItem(`${PREFIX}youtube_videos`, JSON.stringify(updated));
    await saveDocToFirestore('appConfig', 'youtubeFeed', {
      lastUpdated: new Date().toISOString(),
      videos: updated
    }).catch(() => {});
    return true;
  };

  const saveCustomYouTubeVideos = async (videos: YouTubeVideoItem[]): Promise<boolean> => {
    setYoutubeVideos(videos);
    localStorage.setItem(`${PREFIX}youtube_videos`, JSON.stringify(videos));
    await saveDocToFirestore('appConfig', 'youtubeFeed', {
      lastUpdated: new Date().toISOString(),
      videos
    }).catch(() => {});
    return true;
  };

  // Automated Real-time YouTube Polling & Visibility Resync
  useEffect(() => {
    refreshYouTubeVideos();

    // Check for new uploads every 15 minutes silently in background
    const interval = setInterval(() => {
      refreshYouTubeVideos();
    }, 15 * 60 * 1000);

    // Refresh when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshYouTubeVideos();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Theme synchronization
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('sakshamxtech_theme', theme);
  }, [theme]);

  // Persist handlers
  useEffect(() => {
    localStorage.setItem(`${PREFIX}settings`, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}blogs`, JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}arcade`, JSON.stringify(arcadeSolutions));
  }, [arcadeSolutions]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}unstop`, JSON.stringify(unstopProblems));
  }, [unstopProblems]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}opportunities`, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}swags`, JSON.stringify(swags));
  }, [swags]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}clessons`, JSON.stringify(cLessons));
  }, [cLessons]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}resources`, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}arcade_calc`, JSON.stringify(arcadeCalculatorConfig));
  }, [arcadeCalculatorConfig]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}analytics`, JSON.stringify(analytics));
  }, [analytics]);

  useEffect(() => {
    localStorage.setItem(`${PREFIX}bookmarks`, JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Real-time Cloud Firebase hydration & sync state
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [isFirebaseHydrated, setIsFirebaseHydrated] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string>('');

  const syncAllToFirebase = async () => {
    setCloudSyncStatus('syncing');
    const result = await syncEntireDatabaseToFirestore({
      siteSettings,
      blogs,
      arcadeSolutions,
      unstopProblems,
      opportunities,
      swags,
      cLessons,
      resources,
      arcadeCalculatorConfig,
    });
    if (result.success) {
      setCloudSyncStatus('connected');
      setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
    }
    return result;
  };

  /**
   * Smartly merges cloud items with local state:
   * - Preserves locally modified or created items whose updatedAt timestamp is newer than cloud.
   * - Immediately pushes the newer local item to Firestore so the cloud stays in sync.
   * - Guarantees that refreshing the page never "undoes" or resets newly edited blogs/cards.
   */
  const mergeCollectionSmart = <T extends { id: string; updatedAt?: number }>(
    localList: T[], 
    cloudList: T[],
    collectionName: string
  ): T[] => {
    const map = new Map<string, T>();
    cloudList.forEach((item) => {
      map.set(item.id, item);
    });

    localList.forEach((localItem) => {
      const cloudItem = map.get(localItem.id);
      if (!cloudItem) {
        // Preserve locally created items so they never disappear if cloud write is queued or pending
        map.set(localItem.id, localItem);
        saveItemToFirestore(collectionName, localItem).catch(() => {});
      } else if ((localItem.updatedAt || 0) > (cloudItem.updatedAt || 0)) {
        map.set(localItem.id, localItem);
        saveItemToFirestore(collectionName, localItem).catch(() => {});
      }
    });

    if (collectionName === 'cLessons') {
      initialCLessons.forEach((initL) => {
        if (!map.has(initL.id)) {
          map.set(initL.id, initL as unknown as T);
          saveItemToFirestore(collectionName, initL).catch(() => {});
        }
      });
      return (Array.from(map.values()) as unknown as CLesson[])
        .sort((a, b) => (a.dayNumber || 0) - (b.dayNumber || 0)) as unknown as T[];
    }

    return Array.from(map.values());
  };

  const hydrateCollection = async <T extends { id: string; updatedAt?: number }>(
    colName: string,
    fallbackItems: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    localStorageKey: string,
    forceSeed: boolean
  ) => {
    try {
      const cloudItems = await fetchCollectionFromFirestore<T>(colName);
      if ((!cloudItems || cloudItems.length === 0) && forceSeed) {
        // Auto-seed this collection to Firestore so it is guaranteed to exist on Firebase!
        const toSeed = fallbackItems;
        for (const item of toSeed) {
          await saveItemToFirestore(colName, item);
        }
        setter(toSeed);
        try {
          localStorage.setItem(localStorageKey, JSON.stringify(toSeed));
        } catch {}
      } else if (cloudItems && cloudItems.length > 0) {
        setter((local) => {
          const merged = mergeCollectionSmart(local, cloudItems, colName);
          try {
            localStorage.setItem(localStorageKey, JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    } catch (err) {
      console.warn(`Firestore collection hydration warning for ${colName}:`, err);
    }
  };

  const hydrateFromFirebase = async (forceSeedIfEmpty = true) => {
    const { isConnected } = initFirebase();
    setIsFirebaseConnected(isConnected);
    if (!isConnected) {
      setCloudSyncStatus('offline');
      return;
    }

    try {
      setCloudSyncStatus('syncing');

      // Hydrate all collections in parallel, auto-seeding any collection that is empty on Firestore!
      await Promise.all([
        hydrateCollection<BlogPost>(
          'blogs',
          blogs.length > 0 ? blogs : initialBlogs,
          setBlogs,
          `${PREFIX}blogs`,
          forceSeedIfEmpty
        ),
        hydrateCollection<ArcadeSolution>(
          'arcadeSolutions',
          arcadeSolutions.length > 0 ? arcadeSolutions : initialArcadeSolutions,
          setArcadeSolutions,
          `${PREFIX}arcade`,
          forceSeedIfEmpty
        ),
        hydrateCollection<UnstopProblem>(
          'unstopProblems',
          unstopProblems.length > 0 ? unstopProblems : initialUnstopProblems,
          setUnstopProblems,
          `${PREFIX}unstop`,
          forceSeedIfEmpty
        ),
        hydrateCollection<Opportunity>(
          'opportunities',
          opportunities.length > 0 ? opportunities : initialOpportunities,
          setOpportunities,
          `${PREFIX}opportunities`,
          forceSeedIfEmpty
        ),
        // Swags: guarantees that swags is created and populated directly on Firestore
        hydrateCollection<SwagItem>(
          'swags',
          swags.length > 0 ? swags : initialSwags,
          setSwags,
          `${PREFIX}swags`,
          forceSeedIfEmpty
        ),
        hydrateCollection<CLesson>(
          'cLessons',
          cLessons.length > 0 ? cLessons : initialCLessons,
          setCLessons,
          `${PREFIX}clessons`,
          forceSeedIfEmpty
        ),
        hydrateCollection<ResourceItem>(
          'resources',
          resources.length > 0 ? resources : initialResources,
          setResources,
          `${PREFIX}resources`,
          forceSeedIfEmpty
        ),
        // Site Settings
        (async () => {
          const cloudSettings = await fetchDocFromFirestore<SiteSettings>('appConfig', 'siteSettings');
          if (!cloudSettings && forceSeedIfEmpty) {
            await saveDocToFirestore('appConfig', 'siteSettings', siteSettings || initialSiteSettings);
          } else if (cloudSettings) {
            const sanitized: SiteSettings = {
              ...cloudSettings,
              creatorAvatarUrl: sanitizeAvatarUrl(cloudSettings.creatorAvatarUrl),
            };
            setSiteSettings(sanitized);
            try { localStorage.setItem(`${PREFIX}settings`, JSON.stringify(sanitized)); } catch {}
            if (cloudSettings.creatorAvatarUrl !== sanitized.creatorAvatarUrl) {
              saveDocToFirestore('appConfig', 'siteSettings', sanitized).catch(() => {});
            }
          }
        })(),
        // Arcade Calculator Config
        (async () => {
          const cloudCalc = await fetchDocFromFirestore<ArcadeCalculatorConfig>('appConfig', 'arcadeCalculatorConfig');
          if (!cloudCalc && forceSeedIfEmpty) {
            await saveDocToFirestore('appConfig', 'arcadeCalculatorConfig', arcadeCalculatorConfig || initialArcadeCalculatorConfig);
          } else if (cloudCalc) {
            setArcadeCalculatorConfig(cloudCalc);
          }
        })(),
        // YouTube Live Feed
        (async () => {
          const cloudYt = await fetchDocFromFirestore<{ videos: YouTubeVideoItem[] }>('appConfig', 'youtubeFeed');
          if ((!cloudYt || !cloudYt.videos || cloudYt.videos.length === 0) && forceSeedIfEmpty) {
            const initialFeed = authenticYouTubeVideos;
            await saveDocToFirestore('appConfig', 'youtubeFeed', { videos: initialFeed, updatedAt: Date.now() });
            setYoutubeVideos(initialFeed);
            try { localStorage.setItem(`${PREFIX}youtube_videos`, JSON.stringify(initialFeed)); } catch {}
          } else if (cloudYt && Array.isArray(cloudYt.videos) && cloudYt.videos.length > 0) {
            setYoutubeVideos(cloudYt.videos);
            try { localStorage.setItem(`${PREFIX}youtube_videos`, JSON.stringify(cloudYt.videos)); } catch {}
          }
        })(),
      ]);

      setIsFirebaseHydrated(true);
      setCloudSyncStatus('connected');
      setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
    } catch (err) {
      console.warn('Firebase auto-sync hydration notice:', err);
      setCloudSyncStatus('offline');
    }
  };

  // Real-time automatic 2-way listeners for all collections
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const startRealTimeSync = async () => {
      await hydrateFromFirebase(true);

      const { isConnected } = initFirebase();
      if (!isConnected) return;

      // Real-time listener for Blogs
      const unsubB = subscribeToCollection<BlogPost>('blogs', (items) => {
        if (items) {
          setBlogs((local) => {
            const merged = mergeCollectionSmart(local, items, 'blogs');
            try {
              localStorage.setItem(`${PREFIX}blogs`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubB) unsubs.push(unsubB);

      // Real-time listener for Arcade Solutions
      const unsubA = subscribeToCollection<ArcadeSolution>('arcadeSolutions', (items) => {
        if (items) {
          setArcadeSolutions((local) => {
            const merged = mergeCollectionSmart(local, items, 'arcadeSolutions');
            try {
              localStorage.setItem(`${PREFIX}arcade`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubA) unsubs.push(unsubA);

      // Real-time listener for Unstop Problems
      const unsubU = subscribeToCollection<UnstopProblem>('unstopProblems', (items) => {
        if (items) {
          setUnstopProblems((local) => {
            const merged = mergeCollectionSmart(local, items, 'unstopProblems');
            try {
              localStorage.setItem(`${PREFIX}unstop`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubU) unsubs.push(unsubU);

      // Real-time listener for Opportunities
      const unsubO = subscribeToCollection<Opportunity>('opportunities', (items) => {
        if (items) {
          setOpportunities((local) => {
            const merged = mergeCollectionSmart(local, items, 'opportunities');
            try {
              localStorage.setItem(`${PREFIX}opportunities`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubO) unsubs.push(unsubO);

      // Real-time listener for Swags
      const unsubS = subscribeToCollection<SwagItem>('swags', (items) => {
        if (items) {
          setSwags((local) => {
            const merged = mergeCollectionSmart(local, items, 'swags');
            try {
              localStorage.setItem(`${PREFIX}swags`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubS) unsubs.push(unsubS);

      // Real-time listener for C Lessons
      const unsubC = subscribeToCollection<CLesson>('cLessons', (items) => {
        if (items) {
          setCLessons((local) => {
            const merged = mergeCollectionSmart(local, items, 'cLessons');
            try {
              localStorage.setItem(`${PREFIX}clessons`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubC) unsubs.push(unsubC);

      // Real-time listener for Resources
      const unsubR = subscribeToCollection<ResourceItem>('resources', (items) => {
        if (items) {
          setResources((local) => {
            const merged = mergeCollectionSmart(local, items, 'resources');
            try {
              localStorage.setItem(`${PREFIX}resources`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubR) unsubs.push(unsubR);

      // Real-time listener for Site Settings
      const unsubCfg = subscribeToDoc<SiteSettings>('appConfig', 'siteSettings', (data) => {
        if (data) {
          const sanitized: SiteSettings = {
            ...data,
            creatorAvatarUrl: sanitizeAvatarUrl(data.creatorAvatarUrl),
          };
          setSiteSettings(sanitized);
          try {
            localStorage.setItem(`${PREFIX}settings`, JSON.stringify(sanitized));
          } catch {}
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubCfg) unsubs.push(unsubCfg);

      // Real-time listener for Arcade Calculator Config
      const unsubCalc = subscribeToDoc<ArcadeCalculatorConfig>('appConfig', 'arcadeCalculatorConfig', (data) => {
        if (data) {
          setArcadeCalculatorConfig(data);
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubCalc) unsubs.push(unsubCalc);

      // Real-time listener for YouTube Live Feed
      const unsubYt = subscribeToDoc<{ videos: YouTubeVideoItem[] }>('appConfig', 'youtubeFeed', (data) => {
        if (data && Array.isArray(data.videos) && data.videos.length > 0) {
          setYoutubeVideos(data.videos);
          try {
            localStorage.setItem(`${PREFIX}youtube_videos`, JSON.stringify(data.videos));
          } catch {}
          setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
        }
      });
      if (unsubYt) unsubs.push(unsubYt);
    };

    startRealTimeSync();

    return () => {
      unsubs.forEach((u) => u());
    };
  }, []);

  // Analytics event tracking
  const trackEvent = (
    eventType: 'pageView' | 'download' | 'compiler' | 'calculator' | 'youtube' | 'opportunity' | 'search',
    metadata?: string,
    extra?: { videoId?: string; videoTitle?: string; pagePath?: string }
  ) => {
    // Record into persistent real analytics engine
    if (eventType === 'pageView' && metadata) {
      recordActualPageView(metadata);
      logVisitorEventToFirestore({
        id: `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        userHash: typeof window !== 'undefined' ? (localStorage.getItem('sx_visitor_id') || 'guest') : 'guest',
        path: metadata,
        device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
        type: 'page_view',
      }).catch(() => {});
    } else if (eventType === 'youtube') {
      recordActualYouTubeClick(
        extra?.videoId || 'video',
        extra?.videoTitle || metadata || 'SakshamXTech Video',
        extra?.pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/')
      );
      logYouTubeClickToFirestore({
        id: `yt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        userHash: typeof window !== 'undefined' ? (localStorage.getItem('sx_visitor_id') || 'guest') : 'guest',
        videoId: extra?.videoId || 'video',
        videoTitle: extra?.videoTitle || metadata || 'SakshamXTech Video',
        pagePath: extra?.pagePath || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      }).catch(() => {});
    } else if (eventType === 'compiler' || eventType === 'calculator') {
      recordActualToolUse(eventType, metadata || (typeof window !== 'undefined' ? window.location.pathname : '/'));
    } else if (eventType === 'download') {
      recordActualToolUse(`Download: ${metadata || 'Resource'}`, '/resources');
    }

    setAnalytics((prev) => {
      const updated = { ...prev };
      if (eventType === 'pageView') {
        updated.pageViews += 1;
        if (metadata) {
          const existing = updated.topPages.find((p) => p.path === metadata);
          if (existing) {
            existing.count += 1;
          } else {
            updated.topPages.push({ path: metadata, count: 1 });
          }
        }
      } else if (eventType === 'download') {
        updated.resourceDownloads += 1;
      } else if (eventType === 'compiler') {
        updated.compilerExecutions += 1;
      } else if (eventType === 'calculator') {
        updated.calculatorUses += 1;
      } else if (eventType === 'youtube') {
        updated.youtubeClicks += 1;
      } else if (eventType === 'opportunity') {
        updated.opportunityClicks += 1;
      } else if (eventType === 'search' && metadata) {
        const queryClean = metadata.trim().toLowerCase();
        const existing = updated.searchQueries.find((q) => q.query === queryClean);
        if (existing) {
          existing.count += 1;
        } else {
          updated.searchQueries.unshift({ query: queryClean, count: 1 });
          if (updated.searchQueries.length > 20) updated.searchQueries.pop();
        }
      }
      return updated;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const markSyncSuccess = (ok: boolean) => {
    if (ok) {
      setCloudSyncStatus('connected');
      setLastCloudSyncTime(new Date().toLocaleTimeString('en-US'));
    }
  };

  // Settings (Automatic Cloud Sync)
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const next = { ...prev, ...settings };
      try {
        localStorage.setItem(`${PREFIX}settings`, JSON.stringify(next));
      } catch {}
      setCloudSyncStatus('syncing');
      saveDocToFirestore('appConfig', 'siteSettings', next).then(markSyncSuccess).catch(() => {});
      return next;
    });
  };

  // Blogs CRUD (Automatic Cloud Sync)
  const addBlog = (blog: Omit<BlogPost, 'id' | 'views'>) => {
    const newBlog: BlogPost = {
      ...blog,
      id: 'blog-' + Date.now(),
      views: 0,
      updatedAt: Date.now(),
    };
    setBlogs((prev) => {
      const next = [newBlog, ...prev];
      try {
        localStorage.setItem(`${PREFIX}blogs`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    saveItemToFirestore('blogs', newBlog).then(markSyncSuccess).catch(() => {});
  };

  const updateBlog = (id: string, updated: Partial<BlogPost>) => {
    setBlogs((prev) => {
      const nowTs = Date.now();
      const next = prev.map((b) => (b.id === id ? { ...b, ...updated, updatedAt: nowTs } : b));
      try {
        localStorage.setItem(`${PREFIX}blogs`, JSON.stringify(next));
      } catch {}
      const target = next.find((b) => b.id === id);
      if (target) {
        setCloudSyncStatus('syncing');
        saveItemToFirestore('blogs', target).then(markSyncSuccess).catch(() => {});
      }
      return next;
    });
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => {
      const next = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem(`${PREFIX}blogs`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    deleteItemFromFirestore('blogs', id).then(markSyncSuccess).catch(() => {});
  };

  // Arcade Solutions CRUD (Automatic Cloud Sync)
  const addArcadeSolution = (solution: Omit<ArcadeSolution, 'id'>) => {
    const newSolution: ArcadeSolution = {
      ...solution,
      id: 'arc-' + Date.now(),
      updatedAt: Date.now(),
    };
    setArcadeSolutions((prev) => {
      const next = [newSolution, ...prev];
      try {
        localStorage.setItem(`${PREFIX}arcade`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    saveItemToFirestore('arcadeSolutions', newSolution).then(markSyncSuccess).catch(() => {});
  };

  const updateArcadeSolution = (id: string, updated: Partial<ArcadeSolution>) => {
    setArcadeSolutions((prev) => {
      const nowTs = Date.now();
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated, updatedAt: nowTs } : s));
      try {
        localStorage.setItem(`${PREFIX}arcade`, JSON.stringify(next));
      } catch {}
      const target = next.find((s) => s.id === id);
      if (target) {
        setCloudSyncStatus('syncing');
        saveItemToFirestore('arcadeSolutions', target).then(markSyncSuccess).catch(() => {});
      }
      return next;
    });
  };

  const deleteArcadeSolution = (id: string) => {
    setArcadeSolutions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(`${PREFIX}arcade`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    deleteItemFromFirestore('arcadeSolutions', id).then(markSyncSuccess).catch(() => {});
  };

  // Unstop Problems CRUD (Automatic Cloud Sync)
  const addUnstopProblem = (problem: Omit<UnstopProblem, 'id'>) => {
    const newProblem: UnstopProblem = {
      ...problem,
      id: 'uns-' + Date.now(),
      updatedAt: Date.now(),
    };
    setUnstopProblems((prev) => {
      const next = [newProblem, ...prev];
      try {
        localStorage.setItem(`${PREFIX}unstop`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    saveItemToFirestore('unstopProblems', newProblem).then(markSyncSuccess).catch(() => {});
  };

  const updateUnstopProblem = (id: string, updated: Partial<UnstopProblem>) => {
    setUnstopProblems((prev) => {
      const nowTs = Date.now();
      const next = prev.map((p) => (p.id === id ? { ...p, ...updated, updatedAt: nowTs } : p));
      try {
        localStorage.setItem(`${PREFIX}unstop`, JSON.stringify(next));
      } catch {}
      const target = next.find((p) => p.id === id);
      if (target) {
        setCloudSyncStatus('syncing');
        saveItemToFirestore('unstopProblems', target).then(markSyncSuccess).catch(() => {});
      }
      return next;
    });
  };

  const deleteUnstopProblem = (id: string) => {
    setUnstopProblems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(`${PREFIX}unstop`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    deleteItemFromFirestore('unstopProblems', id).then(markSyncSuccess).catch(() => {});
  };

  // Opportunities CRUD (Automatic Cloud Sync)
  const addOpportunity = (opportunity: Omit<Opportunity, 'id' | 'clicksCount'>) => {
    const newOpp: Opportunity = {
      ...opportunity,
      id: 'opp-' + Date.now(),
      clicksCount: 0,
      updatedAt: Date.now(),
    };
    setOpportunities((prev) => {
      const next = [newOpp, ...prev];
      try {
        localStorage.setItem(`${PREFIX}opportunities`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    saveItemToFirestore('opportunities', newOpp).then(markSyncSuccess).catch(() => {});
  };

  const updateOpportunity = (id: string, updated: Partial<Opportunity>) => {
    setOpportunities((prev) => {
      const nowTs = Date.now();
      const next = prev.map((o) => (o.id === id ? { ...o, ...updated, updatedAt: nowTs } : o));
      try {
        localStorage.setItem(`${PREFIX}opportunities`, JSON.stringify(next));
      } catch {}
      const target = next.find((o) => o.id === id);
      if (target) {
        setCloudSyncStatus('syncing');
        saveItemToFirestore('opportunities', target).then(markSyncSuccess).catch(() => {});
      }
      return next;
    });
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => {
      const next = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem(`${PREFIX}opportunities`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    deleteItemFromFirestore('opportunities', id).then(markSyncSuccess).catch(() => {});
  };

  // Swags CRUD (Automatic Cloud Sync)
  const addSwag = (swag: Omit<SwagItem, 'id'>) => {
    const newSwag: SwagItem = {
      ...swag,
      id: 'swag-' + Date.now(),
      updatedAt: Date.now(),
    };
    setSwags((prev) => {
      const next = [newSwag, ...prev];
      try {
        localStorage.setItem(`${PREFIX}swags`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    saveItemToFirestore('swags', newSwag).then(markSyncSuccess).catch(() => {});
  };

  const updateSwag = (id: string, updated: Partial<SwagItem>) => {
    setSwags((prev) => {
      const nowTs = Date.now();
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated, updatedAt: nowTs } : s));
      try {
        localStorage.setItem(`${PREFIX}swags`, JSON.stringify(next));
      } catch {}
      const target = next.find((s) => s.id === id);
      if (target) {
        setCloudSyncStatus('syncing');
        saveItemToFirestore('swags', target).then(markSyncSuccess).catch(() => {});
      }
      return next;
    });
  };

  const deleteSwag = (id: string) => {
    setSwags((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(`${PREFIX}swags`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    deleteItemFromFirestore('swags', id).then(markSyncSuccess).catch(() => {});
  };

  // C Lessons CRUD (Automatic Cloud Sync)
  const addCLesson = (lesson: Omit<CLesson, 'id'>) => {
    const newLesson: CLesson = {
      ...lesson,
      id: 'c-' + Date.now(),
      updatedAt: Date.now(),
    };
    setCLessons((prev) => {
      const next = [...prev, newLesson];
      try {
        localStorage.setItem(`${PREFIX}clessons`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    saveItemToFirestore('cLessons', newLesson).then(markSyncSuccess).catch(() => {});
  };

  const updateCLesson = (id: string, updated: Partial<CLesson>) => {
    setCLessons((prev) => {
      const nowTs = Date.now();
      const next = prev.map((l) => (l.id === id ? { ...l, ...updated, updatedAt: nowTs } : l));
      try {
        localStorage.setItem(`${PREFIX}clessons`, JSON.stringify(next));
      } catch {}
      const target = next.find((l) => l.id === id);
      if (target) {
        setCloudSyncStatus('syncing');
        saveItemToFirestore('cLessons', target).then(markSyncSuccess).catch(() => {});
      }
      return next;
    });
  };

  const deleteCLesson = (id: string) => {
    setCLessons((prev) => {
      const next = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem(`${PREFIX}clessons`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    deleteItemFromFirestore('cLessons', id).then(markSyncSuccess).catch(() => {});
  };

  // Resources CRUD (Automatic Cloud Sync)
  const addResource = (resource: Omit<ResourceItem, 'id' | 'downloadsCount'>) => {
    const newResource: ResourceItem = {
      ...resource,
      id: 'res-' + Date.now(),
      downloadsCount: 0,
      updatedAt: Date.now(),
    };
    setResources((prev) => {
      const next = [newResource, ...prev];
      try {
        localStorage.setItem(`${PREFIX}resources`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setCloudSyncStatus('syncing');
    saveItemToFirestore('resources', newResource).then(markSyncSuccess).catch(() => {});
  };

  const updateResource = (id: string, updated: Partial<ResourceItem>) => {
    setResources((prev) => {
      const nowTs = Date.now();
      const next = prev.map((r) => (r.id === id ? { ...r, ...updated, updatedAt: nowTs } : r));
      try {
        localStorage.setItem(`${PREFIX}resources`, JSON.stringify(next));
      } catch {}
      const target = next.find((r) => r.id === id);
      if (target) {
        setCloudSyncStatus('syncing');
        saveItemToFirestore('resources', target).then(markSyncSuccess).catch(() => {});
      }
      return next;
    });
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    setCloudSyncStatus('syncing');
    deleteItemFromFirestore('resources', id).then(markSyncSuccess).catch(() => {});
  };

  // Arcade Config (Automatic Cloud Sync)
  const updateArcadeCalculatorConfig = (config: Partial<ArcadeCalculatorConfig>) => {
    setArcadeCalculatorConfig((prev) => {
      const next = { ...prev, ...config };
      setCloudSyncStatus('syncing');
      saveDocToFirestore('appConfig', 'arcadeCalculatorConfig', next).then(markSyncSuccess).catch(() => {});
      return next;
    });
  };

  // Export / Import
  const exportDatabaseJSON = () => {
    const payload = {
      siteSettings,
      blogs,
      arcadeSolutions,
      unstopProblems,
      opportunities,
      swags,
      cLessons,
      resources,
      arcadeCalculatorConfig,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      // Security check: reject oversized payloads and prototype pollution keys
      if (typeof jsonString !== 'string' || jsonString.length > 5000000) {
        return false;
      }
      if (jsonString.includes('__proto__') || jsonString.includes('constructor') || jsonString.includes('prototype')) {
        console.warn('Suspicious database payload rejected.');
        return false;
      }

      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return false;
      }

      if (data.siteSettings && typeof data.siteSettings === 'object' && !Array.isArray(data.siteSettings)) {
        setSiteSettings(data.siteSettings);
      }
      if (Array.isArray(data.blogs)) setBlogs(data.blogs);
      if (Array.isArray(data.arcadeSolutions)) setArcadeSolutions(data.arcadeSolutions);
      if (Array.isArray(data.unstopProblems)) setUnstopProblems(data.unstopProblems);
      if (Array.isArray(data.opportunities)) setOpportunities(data.opportunities);
      if (Array.isArray(data.swags)) setSwags(data.swags);
      if (Array.isArray(data.cLessons)) setCLessons(data.cLessons);
      if (Array.isArray(data.resources)) setResources(data.resources);
      if (data.arcadeCalculatorConfig && typeof data.arcadeCalculatorConfig === 'object' && !Array.isArray(data.arcadeCalculatorConfig)) {
        setArcadeCalculatorConfig(data.arcadeCalculatorConfig);
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setSiteSettings(initialSiteSettings);
    setBlogs(initialBlogs);
    setArcadeSolutions(initialArcadeSolutions);
    setUnstopProblems(initialUnstopProblems);
    setOpportunities(initialOpportunities);
    setSwags(initialSwags);
    setCLessons(initialCLessons);
    setResources(initialResources);
    setArcadeCalculatorConfig(initialArcadeCalculatorConfig);
  };

  return (
    <AppContext.Provider
      value={{
        siteSettings,
        updateSiteSettings,
        blogs,
        addBlog,
        updateBlog,
        deleteBlog,
        arcadeSolutions,
        addArcadeSolution,
        updateArcadeSolution,
        deleteArcadeSolution,
        unstopProblems,
        addUnstopProblem,
        updateUnstopProblem,
        deleteUnstopProblem,
        opportunities,
        addOpportunity,
        updateOpportunity,
        deleteOpportunity,
        swags,
        addSwag,
        updateSwag,
        deleteSwag,
        cLessons,
        addCLesson,
        updateCLesson,
        deleteCLesson,
        resources,
        addResource,
        updateResource,
        deleteResource,
        arcadeCalculatorConfig,
        updateArcadeCalculatorConfig,
        analytics,
        trackEvent,
        leaderboard,
        theme,
        toggleTheme,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToDefaultData,
        youtubeVideos,
        refreshYouTubeVideos,
        isFetchingYouTube,
        addCustomYouTubeVideo,
        deleteCustomYouTubeVideo,
        saveCustomYouTubeVideos,
        recordActualYouTubeClick,
        getRecentVisitorLogs,
        getRecentYouTubeClickLogs,
        getRealDateWiseAnalytics,
        clearRealAnalytics,
        isFirebaseConnected,
        isFirebaseHydrated,
        cloudSyncStatus,
        lastCloudSyncTime,
        hydrateFromFirebase,
        syncAllToFirebase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
