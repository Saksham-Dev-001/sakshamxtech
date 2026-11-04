import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  getDoc,
  deleteDoc, 
  onSnapshot,
  Firestore,
  Unsubscribe
} from 'firebase/firestore';
import { 
  ArcadeSolution, 
  UnstopProblem, 
  BlogPost, 
  Opportunity, 
  SwagItem, 
  CLesson, 
  ResourceItem, 
  SiteSettings,
  ArcadeCalculatorConfig
} from '../types';

export const FIREBASE_CONFIG_STORAGE = 'sakshamxtech_firebase_config';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

// Default Firebase Configuration (reads from Vite env or local config)
export const getActiveFirebaseConfig = (): FirebaseConfig | null => {
  const envKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sakshamxtech-7fe06';

  if (envKey) {
    return {
      apiKey: envKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '500868127820',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:500868127820:web:09c7460094468c3236e8e9',
    };
  }

  // Check saved custom config from Admin Settings
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_STORAGE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return {
          apiKey: parsed.apiKey || '',
          authDomain: parsed.authDomain || 'sakshamxtech-7fe06.firebaseapp.com',
          projectId: parsed.projectId || 'sakshamxtech-7fe06',
          storageBucket: parsed.storageBucket || 'sakshamxtech-7fe06.appspot.com',
          messagingSenderId: parsed.messagingSenderId || '500868127820',
          appId: parsed.appId || '1:500868127820:web:09c7460094468c3236e8e9',
        };
      }
    }
  } catch (e) {
    console.warn('Error reading saved firebase config:', e);
  }

  // Pre-configured official SakshamXTech Firebase Project
  return {
    apiKey: '',
    authDomain: 'sakshamxtech-7fe06.firebaseapp.com',
    projectId: 'sakshamxtech-7fe06',
    storageBucket: 'sakshamxtech-7fe06.appspot.com',
    messagingSenderId: '500868127820',
    appId: '1:500868127820:web:09c7460094468c3236e8e9',
  };
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let currentConfigFingerprint = '';

export const initFirebase = (forceNew = false): { isConnected: boolean; db: Firestore | null; projectId?: string } => {
  const config = getActiveFirebaseConfig();
  if (!config || !config.apiKey || config.apiKey.includes('YOUR_API_KEY') || !config.projectId) {
    return { isConnected: false, db: null };
  }

  const fingerprint = `${config.apiKey}_${config.projectId}_${config.appId}`;
  if (!forceNew && app && db && currentConfigFingerprint === fingerprint) {
    return { isConnected: true, db, projectId: config.projectId };
  }

  try {
    if (getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(config);
    }
    try {
      db = initializeFirestore(app, {
        ignoreUndefinedProperties: true,
      });
    } catch {
      db = getFirestore(app);
    }
    currentConfigFingerprint = fingerprint;
    return { isConnected: true, db, projectId: config.projectId };
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return { isConnected: false, db: null };
  }
};

/**
 * Recursively cleans any object before writing to Firestore:
 * - Removes keys with `undefined` values.
 * - Recursively strips `undefined` from nested objects.
 * This guarantees Firestore never rejects writes with "Unsupported field value: undefined".
 */
export function sanitizeForFirestore<T>(data: T): any {
  if (data === null || data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeForFirestore).filter((item) => item !== undefined);
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned;
  }
  return data;
}

// Sync Individual Item in a Collection
export const saveItemToFirestore = async <T extends { id: string }>(
  collectionName: string, 
  item: T
): Promise<boolean> => {
  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return false;

  try {
    const ref = doc(db, collectionName, item.id);
    const sanitized = sanitizeForFirestore(item);
    await setDoc(ref, sanitized, { merge: true });
    return true;
  } catch (err) {
    console.error(`Failed to save document to ${collectionName}:`, err);
    return false;
  }
};

// Delete Individual Item in a Collection
export const deleteItemFromFirestore = async (
  collectionName: string, 
  id: string
): Promise<boolean> => {
  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return false;

  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (err) {
    console.error(`Failed to delete document from ${collectionName}:`, err);
    return false;
  }
};

// Fetch Entire Collection
export const fetchCollectionFromFirestore = async <T>(
  collectionName: string
): Promise<T[] | null> => {
  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return null;

  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: T[] = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as T);
    });
    return items;
  } catch (err) {
    console.error(`Failed to fetch ${collectionName} from Firestore:`, err);
    return null;
  }
};

// Save a Single Configuration Document
export const saveDocToFirestore = async <T>(
  collectionName: string,
  docId: string,
  data: T
): Promise<boolean> => {
  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return false;

  try {
    const ref = doc(db, collectionName, docId);
    const sanitized = sanitizeForFirestore(data);
    await setDoc(ref, sanitized, { merge: true });
    return true;
  } catch (err) {
    console.error(`Failed to save doc ${docId} to ${collectionName}:`, err);
    return false;
  }
};

// Fetch a Single Configuration Document
export const fetchDocFromFirestore = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return null;

  try {
    const ref = doc(db, collectionName, docId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as T;
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch doc ${docId} from ${collectionName}:`, err);
    return null;
  }
};

// Real-time automatic listener for entire Firestore collection
export const subscribeToCollection = <T>(
  collectionName: string,
  onData: (items: T[]) => void,
  onError?: (err: any) => void
): Unsubscribe | null => {
  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return null;

  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((d) => {
          items.push(d.data() as T);
        });
        onData(items);
      },
      (err) => {
        console.warn(`Firestore real-time subscription error for ${collectionName}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn(`Could not attach real-time listener for ${collectionName}:`, err);
    return null;
  }
};

// Real-time automatic listener for a single Firestore document
export const subscribeToDoc = <T>(
  collectionName: string,
  docId: string,
  onData: (item: T | null) => void,
  onError?: (err: any) => void
): Unsubscribe | null => {
  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return null;

  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          onData(snap.data() as T);
        } else {
          onData(null);
        }
      },
      (err) => {
        console.warn(`Firestore real-time doc subscription error for ${collectionName}/${docId}:`, err);
        if (onError) onError(err);
      }
    );
  } catch (err) {
    console.warn(`Could not attach real-time doc listener for ${collectionName}/${docId}:`, err);
    return null;
  }
};

// Real Analytics Log to Firestore
let lastVisitorLogTime = 0;
let lastYouTubeLogTime = 0;
const MIN_TELEMETRY_INTERVAL_MS = 2500; // Max 1 Firestore telemetry write per 2.5s per client to protect against quota exhaustion

export const logVisitorEventToFirestore = async (entry: {
  id: string;
  timestamp: string;
  userHash: string;
  path: string;
  device: string;
  type: string;
}): Promise<boolean> => {
  const now = Date.now();
  if (now - lastVisitorLogTime < MIN_TELEMETRY_INTERVAL_MS) {
    return false; // Throttled against flood attacks
  }
  lastVisitorLogTime = now;

  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return false;
  try {
    const sanitizedEntry = {
      id: String(entry.id || '').slice(0, 80),
      timestamp: String(entry.timestamp || '').slice(0, 50),
      userHash: String(entry.userHash || '').slice(0, 80),
      path: String(entry.path || '').slice(0, 150),
      device: String(entry.device || '').slice(0, 30),
      type: String(entry.type || '').slice(0, 50),
    };
    const ref = doc(db, 'visitorEvents', sanitizedEntry.id || `vis_${now}`);
    await setDoc(ref, sanitizedEntry, { merge: true });
    return true;
  } catch {
    return false;
  }
};

export const logYouTubeClickToFirestore = async (entry: {
  id: string;
  timestamp: string;
  userHash: string;
  videoId: string;
  videoTitle: string;
  pagePath: string;
}): Promise<boolean> => {
  const now = Date.now();
  if (now - lastYouTubeLogTime < MIN_TELEMETRY_INTERVAL_MS) {
    return false; // Throttled against flood attacks
  }
  lastYouTubeLogTime = now;

  const { isConnected, db } = initFirebase();
  if (!isConnected || !db) return false;
  try {
    const sanitizedEntry = {
      id: String(entry.id || '').slice(0, 80),
      timestamp: String(entry.timestamp || '').slice(0, 50),
      userHash: String(entry.userHash || '').slice(0, 80),
      videoId: String(entry.videoId || '').slice(0, 50),
      videoTitle: String(entry.videoTitle || '').slice(0, 150),
      pagePath: String(entry.pagePath || '').slice(0, 150),
    };
    const ref = doc(db, 'youtubeClicks', sanitizedEntry.id || `yt_${now}`);
    await setDoc(ref, sanitizedEntry, { merge: true });
    return true;
  } catch {
    return false;
  }
};

// Full Platform Synchronization Payload
export interface FullDatabasePayload {
  siteSettings: SiteSettings;
  blogs: BlogPost[];
  arcadeSolutions: ArcadeSolution[];
  unstopProblems: UnstopProblem[];
  opportunities: Opportunity[];
  swags: SwagItem[];
  cLessons: CLesson[];
  resources: ResourceItem[];
  arcadeCalculatorConfig: ArcadeCalculatorConfig;
}

export const FIRESTORE_RULES_CONTENT = `rules_version = '2';

// SakshamXTech Platform - Hardened Cloud Firestore Security Rules
service cloud.firestore {
  match /databases/{database}/documents {

    function isBoundedString(val, minLen, maxLen) {
      return val is string && val.size() >= minLen && val.size() <= maxLen;
    }

    function isNonNegativeNumber(val, maxVal) {
      return val is number && val >= 0 && val <= maxVal;
    }

    function isBoundedList(val, minSize, maxSize) {
      return val is list && val.size() >= minSize && val.size() <= maxSize;
    }

    function isValidAuthor(author) {
      return author is map &&
             author.keys().hasAll(['name', 'role', 'avatar']) &&
             author.keys().hasOnly(['name', 'role', 'avatar']) &&
             isBoundedString(author.name, 1, 100) &&
             isBoundedString(author.role, 0, 150) &&
             isBoundedString(author.avatar, 0, 1000);
    }

    function isValidBlog(blogId) {
      let d = request.resource.data;
      return d.keys().hasAll([
               'id', 'slug', 'title', 'summary', 'content', 'category', 'tags',
               'coverImage', 'author', 'publishedAt', 'readTimeMinutes', 'featured', 'views'
             ]) &&
             d.keys().hasOnly([
               'id', 'slug', 'title', 'summary', 'content', 'category', 'tags',
               'coverImage', 'author', 'publishedAt', 'readTimeMinutes', 'featured', 'views',
               'youtubeVideoId', 'officialLink', 'officialLinkLabel', 'deadline', 'perks',
               'eligibility', 'quickSteps', 'status', 'scheduledAt', 'updatedAt'
             ]) &&
             d.id == blogId &&
             isBoundedString(d.id, 1, 100) &&
             isBoundedString(d.slug, 1, 150) &&
             isBoundedString(d.title, 1, 300) &&
             isBoundedString(d.summary, 1, 2000) &&
             isBoundedString(d.content, 1, 100000) &&
             isBoundedString(d.category, 1, 100) &&
             isBoundedList(d.tags, 0, 30) &&
             isBoundedString(d.coverImage, 1, 1000) &&
             isValidAuthor(d.author) &&
             isBoundedString(d.publishedAt, 1, 100) &&
             isNonNegativeNumber(d.readTimeMinutes, 10000) &&
             d.featured is bool &&
             isNonNegativeNumber(d.views, 100000000) &&
             (!('youtubeVideoId' in d) || isBoundedString(d.youtubeVideoId, 0, 100)) &&
             (!('officialLink' in d) || isBoundedString(d.officialLink, 0, 1000)) &&
             (!('officialLinkLabel' in d) || isBoundedString(d.officialLinkLabel, 0, 200)) &&
             (!('deadline' in d) || isBoundedString(d.deadline, 0, 200)) &&
             (!('perks' in d) || isBoundedString(d.perks, 0, 1000)) &&
             (!('eligibility' in d) || isBoundedString(d.eligibility, 0, 1000)) &&
             (!('quickSteps' in d) || isBoundedList(d.quickSteps, 0, 30)) &&
             (!('status' in d) || isBoundedString(d.status, 1, 50)) &&
             (!('scheduledAt' in d) || isBoundedString(d.scheduledAt, 0, 100)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidArcadeSolution(solutionId) {
      let d = request.resource.data;
      return d.keys().hasAll([
               'id', 'slug', 'title', 'labCode', 'difficulty', 'durationMinutes',
               'category', 'description', 'prerequisites', 'pointsAwarded',
               'lastUpdated', 'isPublished', 'steps', 'importantCommands'
             ]) &&
             d.keys().hasOnly([
               'id', 'slug', 'title', 'labCode', 'difficulty', 'durationMinutes',
               'category', 'description', 'prerequisites', 'pointsAwarded',
               'lastUpdated', 'isPublished', 'steps', 'importantCommands',
               'badgeTitle', 'badgeImageUrl', 'youtubeVideoId', 'updatedAt'
             ]) &&
             d.id == solutionId &&
             isBoundedString(d.id, 1, 100) &&
             isBoundedString(d.slug, 1, 150) &&
             isBoundedString(d.title, 1, 300) &&
             isBoundedString(d.labCode, 1, 50) &&
             isBoundedString(d.difficulty, 1, 50) &&
             isNonNegativeNumber(d.durationMinutes, 10000) &&
             isBoundedString(d.category, 1, 100) &&
             isBoundedString(d.description, 1, 10000) &&
             isBoundedList(d.prerequisites, 0, 50) &&
             isNonNegativeNumber(d.pointsAwarded, 1000) &&
             isBoundedString(d.lastUpdated, 1, 100) &&
             d.isPublished is bool &&
             isBoundedList(d.steps, 0, 100) &&
             isBoundedList(d.importantCommands, 0, 100) &&
             (!('badgeTitle' in d) || isBoundedString(d.badgeTitle, 0, 200)) &&
             (!('badgeImageUrl' in d) || isBoundedString(d.badgeImageUrl, 0, 1000)) &&
             (!('youtubeVideoId' in d) || isBoundedString(d.youtubeVideoId, 0, 100)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidUnstopProblem(problemId) {
      let d = request.resource.data;
      return d.keys().hasAll([
               'id', 'dayNumber', 'date', 'title', 'slug', 'difficulty', 'description',
               'inputFormat', 'outputFormat', 'constraints', 'examples',
               'solutionExplanation', 'codeSolutions', 'tags'
             ]) &&
             d.keys().hasOnly([
               'id', 'dayNumber', 'date', 'title', 'slug', 'difficulty', 'description',
               'inputFormat', 'outputFormat', 'constraints', 'examples',
               'solutionExplanation', 'codeSolutions', 'tags', 'youtubeVideoId', 'updatedAt'
             ]) &&
             d.id == problemId &&
             isBoundedString(d.id, 1, 100) &&
             isNonNegativeNumber(d.dayNumber, 10000) &&
             isBoundedString(d.date, 1, 100) &&
             isBoundedString(d.title, 1, 300) &&
             isBoundedString(d.slug, 1, 150) &&
             isBoundedString(d.difficulty, 1, 50) &&
             isBoundedString(d.description, 1, 15000) &&
             isBoundedString(d.inputFormat, 0, 5000) &&
             isBoundedString(d.outputFormat, 0, 5000) &&
             isBoundedList(d.constraints, 0, 50) &&
             isBoundedList(d.examples, 0, 30) &&
             isBoundedString(d.solutionExplanation, 0, 30000) &&
             isBoundedList(d.codeSolutions, 0, 30) &&
             isBoundedList(d.tags, 0, 50) &&
             (!('youtubeVideoId' in d) || isBoundedString(d.youtubeVideoId, 0, 100)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidOpportunity(opportunityId) {
      let d = request.resource.data;
      return d.keys().hasAll([
               'id', 'title', 'slug', 'company', 'logo', 'category', 'type',
               'description', 'eligibility', 'benefits', 'deadline', 'officialUrl',
               'status', 'featured', 'postedDate', 'clicksCount'
             ]) &&
             d.keys().hasOnly([
               'id', 'title', 'slug', 'company', 'logo', 'category', 'type',
               'description', 'eligibility', 'benefits', 'deadline', 'officialUrl',
               'status', 'featured', 'postedDate', 'clicksCount', 'location', 'updatedAt'
             ]) &&
             d.id == opportunityId &&
             isBoundedString(d.id, 1, 100) &&
             isBoundedString(d.title, 1, 300) &&
             isBoundedString(d.slug, 1, 150) &&
             isBoundedString(d.company, 1, 150) &&
             isBoundedString(d.logo, 1, 1000) &&
             isBoundedString(d.category, 1, 100) &&
             isBoundedString(d.type, 1, 50) &&
             isBoundedString(d.description, 1, 15000) &&
             isBoundedString(d.eligibility, 0, 5000) &&
             isBoundedList(d.benefits, 0, 50) &&
             isBoundedString(d.deadline, 1, 100) &&
             isBoundedString(d.officialUrl, 1, 1000) &&
             isBoundedString(d.status, 1, 50) &&
             d.featured is bool &&
             isBoundedString(d.postedDate, 1, 100) &&
             isNonNegativeNumber(d.clicksCount, 10000000) &&
             (!('location' in d) || isBoundedString(d.location, 0, 200)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidSwag(swagId) {
      let d = request.resource.data;
      return d.keys().hasAll([
               'id', 'title', 'brand', 'category', 'imageUrl', 'description',
               'eligibility', 'howToClaim', 'campaignStartDate', 'campaignEndDate',
               'officialSourceUrl', 'status', 'featured'
             ]) &&
             d.keys().hasOnly([
               'id', 'title', 'brand', 'category', 'imageUrl', 'description',
               'eligibility', 'howToClaim', 'campaignStartDate', 'campaignEndDate',
               'officialSourceUrl', 'status', 'featured', 'tierRequired',
               'pointsRequired', 'revealedDate', 'tierTags', 'updatedAt'
             ]) &&
             d.id == swagId &&
             isBoundedString(d.id, 1, 100) &&
             isBoundedString(d.title, 1, 300) &&
             isBoundedString(d.brand, 1, 100) &&
             isBoundedString(d.category, 1, 100) &&
             isBoundedString(d.imageUrl, 1, 1000) &&
             isBoundedString(d.description, 0, 15000) &&
             isBoundedString(d.eligibility, 0, 5000) &&
             isBoundedList(d.howToClaim, 0, 50) &&
             isBoundedString(d.campaignStartDate, 1, 100) &&
             isBoundedString(d.campaignEndDate, 1, 100) &&
             isBoundedString(d.officialSourceUrl, 1, 1000) &&
             isBoundedString(d.status, 1, 50) &&
             d.featured is bool &&
             (!('tierRequired' in d) || isBoundedString(d.tierRequired, 0, 200)) &&
             (!('pointsRequired' in d) || isNonNegativeNumber(d.pointsRequired, 10000)) &&
             (!('revealedDate' in d) || isBoundedString(d.revealedDate, 0, 100)) &&
             (!('tierTags' in d) || isBoundedList(d.tierTags, 0, 10)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidCLesson(lessonId) {
      let d = request.resource.data;
      return d.keys().hasAll([
               'id', 'dayNumber', 'title', 'slug', 'summary', 'durationMinutes',
               'content', 'codeSnippet', 'expectedOutput', 'youtubeVideoId',
               'practiceQuestions', 'quiz', 'isPublished'
             ]) &&
             d.keys().hasOnly([
               'id', 'dayNumber', 'title', 'slug', 'summary', 'durationMinutes',
               'content', 'codeSnippet', 'expectedOutput', 'youtubeVideoId',
               'practiceQuestions', 'quiz', 'isPublished', 'updatedAt'
             ]) &&
             d.id == lessonId &&
             isBoundedString(d.id, 1, 100) &&
             isNonNegativeNumber(d.dayNumber, 10000) &&
             isBoundedString(d.title, 1, 300) &&
             isBoundedString(d.slug, 1, 150) &&
             isBoundedString(d.summary, 1, 3000) &&
             isNonNegativeNumber(d.durationMinutes, 10000) &&
             isBoundedString(d.content, 1, 100000) &&
             isBoundedString(d.codeSnippet, 0, 50000) &&
             isBoundedString(d.expectedOutput, 0, 20000) &&
             isBoundedString(d.youtubeVideoId, 0, 100) &&
             isBoundedList(d.practiceQuestions, 0, 50) &&
             isBoundedList(d.quiz, 0, 50) &&
             d.isPublished is bool &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidResource(resourceId) {
      let d = request.resource.data;
      return d.keys().hasAll([
               'id', 'title', 'description', 'category', 'format', 'fileSize',
               'downloadUrl', 'previewImageUrl', 'tags', 'downloadsCount', 'publishedDate'
             ]) &&
             d.keys().hasOnly([
               'id', 'title', 'description', 'category', 'format', 'fileSize',
               'downloadUrl', 'previewImageUrl', 'tags', 'downloadsCount', 'publishedDate', 'updatedAt'
             ]) &&
             d.id == resourceId &&
             isBoundedString(d.id, 1, 100) &&
             isBoundedString(d.title, 1, 300) &&
             isBoundedString(d.description, 1, 15000) &&
             isBoundedString(d.category, 1, 100) &&
             isBoundedString(d.format, 1, 50) &&
             isBoundedString(d.fileSize, 1, 50) &&
             isBoundedString(d.downloadUrl, 1, 1000) &&
             isBoundedString(d.previewImageUrl, 1, 1000) &&
             isBoundedList(d.tags, 0, 50) &&
             isNonNegativeNumber(d.downloadsCount, 10000000) &&
             isBoundedString(d.publishedDate, 1, 100) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidSiteSettings() {
      let d = request.resource.data;
      return d.keys().hasAll(['brandName', 'creatorName', 'adminEmail', 'socialLinks', 'statistics']) &&
             d.keys().hasOnly([
               'brandName', 'tagline', 'creatorName', 'creatorTitle', 'creatorBio',
               'creatorAvatarUrl', 'adminEmail', 'socialLinks', 'statistics',
               'announcement', 'adsConfig', 'updatedAt'
             ]) &&
             isBoundedString(d.brandName, 1, 100) &&
             isBoundedString(d.creatorName, 1, 100) &&
             isBoundedString(d.adminEmail, 1, 150) &&
             d.socialLinks is map && d.socialLinks.size() <= 20 &&
             d.statistics is map && d.statistics.size() <= 20 &&
             (!('tagline' in d) || isBoundedString(d.tagline, 0, 300)) &&
             (!('creatorTitle' in d) || isBoundedString(d.creatorTitle, 0, 300)) &&
             (!('creatorBio' in d) || isBoundedString(d.creatorBio, 0, 3000)) &&
             (!('creatorAvatarUrl' in d) || isBoundedString(d.creatorAvatarUrl, 0, 1000)) &&
             (!('announcement' in d) || (d.announcement is map && d.announcement.size() <= 10)) &&
             (!('adsConfig' in d) || (d.adsConfig is map && d.adsConfig.size() <= 10)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidArcadeCalculatorConfig() {
      let d = request.resource.data;
      return d.keys().hasAll(['pointsPerSkillBadge', 'pointsPerTriviaGame', 'pointsPerLabCompletion', 'tiers']) &&
             d.keys().hasOnly(['pointsPerSkillBadge', 'pointsPerTriviaGame', 'pointsPerLabCompletion', 'tiers', 'updatedAt']) &&
             isNonNegativeNumber(d.pointsPerSkillBadge, 1000) &&
             isNonNegativeNumber(d.pointsPerTriviaGame, 1000) &&
             isNonNegativeNumber(d.pointsPerLabCompletion, 1000) &&
             isBoundedList(d.tiers, 0, 20) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidYouTubeFeed() {
      let d = request.resource.data;
      return d.keys().hasOnly(['videos', 'lastUpdated', 'updatedAt']) &&
             ('videos' in d) &&
             isBoundedList(d.videos, 0, 200) &&
             (!('lastUpdated' in d) || isBoundedString(d.lastUpdated, 0, 100)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidConfigHealthProbe() {
      let d = request.resource.data;
      return d.keys().hasOnly(['lastCheck', 'status']) &&
             (!('status' in d) || isBoundedString(d.status, 0, 50)) &&
             (!('lastCheck' in d) || isBoundedString(d.lastCheck, 0, 100));
    }

    function isValidAppConfig(configId) {
      return (configId == 'siteSettings' && isValidSiteSettings()) ||
             (configId == 'arcadeCalculatorConfig' && isValidArcadeCalculatorConfig()) ||
             (configId == 'youtubeFeed' && isValidYouTubeFeed()) ||
             (configId == 'healthCheck' && isValidConfigHealthProbe());
    }

    function isValidLeaderboardUser() {
      let d = request.resource.data;
      return d.keys().hasAll(['rank', 'displayName', 'points', 'badgesCount', 'avatar', 'tier', 'streakDays']) &&
             d.keys().hasOnly(['id', 'userId', 'rank', 'displayName', 'points', 'badgesCount', 'avatar', 'tier', 'streakDays', 'updatedAt']) &&
             isNonNegativeNumber(d.rank, 1000000) &&
             isBoundedString(d.displayName, 1, 100) &&
             isNonNegativeNumber(d.points, 1000000) &&
             isNonNegativeNumber(d.badgesCount, 100000) &&
             isBoundedString(d.avatar, 0, 1000) &&
             isBoundedString(d.tier, 1, 100) &&
             isNonNegativeNumber(d.streakDays, 100000) &&
             (!('id' in d) || isBoundedString(d.id, 1, 100)) &&
             (!('userId' in d) || isBoundedString(d.userId, 1, 100)) &&
             (!('updatedAt' in d) || isNonNegativeNumber(d.updatedAt, 10000000000000));
    }

    function isValidVisitorEvent(eventId) {
      let d = request.resource.data;
      return d.keys().hasAll(['id', 'timestamp', 'type', 'device', 'path']) &&
             d.keys().hasOnly(['id', 'timestamp', 'type', 'device', 'path', 'userHash']) &&
             d.id == eventId &&
             isBoundedString(d.id, 1, 100) &&
             isBoundedString(d.timestamp, 1, 100) &&
             isBoundedString(d.type, 1, 50) &&
             isBoundedString(d.device, 1, 50) &&
             isBoundedString(d.path, 1, 500) &&
             (!('userHash' in d) || isBoundedString(d.userHash, 0, 100));
    }

    function isValidYouTubeClick(clickId) {
      let d = request.resource.data;
      return d.keys().hasAll(['id', 'timestamp', 'videoId']) &&
             d.keys().hasOnly(['id', 'timestamp', 'videoId', 'userHash', 'videoTitle', 'pagePath']) &&
             d.id == clickId &&
             isBoundedString(d.id, 1, 100) &&
             isBoundedString(d.timestamp, 1, 100) &&
             isBoundedString(d.videoId, 1, 50) &&
             (!('userHash' in d) || isBoundedString(d.userHash, 0, 100)) &&
             (!('videoTitle' in d) || isBoundedString(d.videoTitle, 0, 200)) &&
             (!('pagePath' in d) || isBoundedString(d.pagePath, 0, 500));
    }

    function isValidHealthProbe(probeId) {
      let d = request.resource.data;
      return d.keys().hasOnly(['lastCheck', 'status']) &&
             isBoundedString(probeId, 1, 50) &&
             (!('status' in d) || isBoundedString(d.status, 0, 50)) &&
             (!('lastCheck' in d) || isBoundedString(d.lastCheck, 0, 100));
    }

    match /blogs/{blogId} {
      allow read: if true;
      allow create: if isValidBlog(blogId);
      allow update: if isValidBlog(blogId) && request.resource.data.id == resource.data.id;
      allow delete: if true;
    }

    match /arcadeSolutions/{solutionId} {
      allow read: if true;
      allow create: if isValidArcadeSolution(solutionId);
      allow update: if isValidArcadeSolution(solutionId) && request.resource.data.id == resource.data.id;
      allow delete: if true;
    }

    match /unstopProblems/{problemId} {
      allow read: if true;
      allow create: if isValidUnstopProblem(problemId);
      allow update: if isValidUnstopProblem(problemId) && request.resource.data.id == resource.data.id;
      allow delete: if true;
    }

    match /opportunities/{opportunityId} {
      allow read: if true;
      allow create: if isValidOpportunity(opportunityId);
      allow update: if isValidOpportunity(opportunityId) && request.resource.data.id == resource.data.id;
      allow delete: if true;
    }

    match /swags/{swagId} {
      allow read: if true;
      allow create: if isValidSwag(swagId);
      allow update: if isValidSwag(swagId) && request.resource.data.id == resource.data.id;
      allow delete: if true;
    }

    match /cLessons/{lessonId} {
      allow read: if true;
      allow create: if isValidCLesson(lessonId);
      allow update: if isValidCLesson(lessonId) && request.resource.data.id == resource.data.id;
      allow delete: if true;
    }

    match /resources/{resourceId} {
      allow read: if true;
      allow create: if isValidResource(resourceId);
      allow update: if isValidResource(resourceId) && request.resource.data.id == resource.data.id;
      allow delete: if true;
    }

    match /appConfig/{configId} {
      allow read: if true;
      allow create, update: if isValidAppConfig(configId);
      allow delete: if false;
    }

    match /leaderboard/{userId} {
      allow read: if true;
      allow create, update: if isValidLeaderboardUser();
      allow delete: if true;
    }

    match /visitorEvents/{eventId} {
      allow read: if false;
      allow create: if isValidVisitorEvent(eventId);
      allow update, delete: if false;
    }

    match /youtubeClicks/{clickId} {
      allow read: if false;
      allow create: if isValidYouTubeClick(clickId);
      allow update, delete: if false;
    }

    match /_healthCheck/{probeId} {
      allow read: if true;
      allow create, update: if isValidHealthProbe(probeId);
      allow delete: if true;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}`;

export const syncEntireDatabaseToFirestore = async (
  payload: FullDatabasePayload
): Promise<{
  success: boolean;
  syncedCounts: Record<string, number>;
  error?: string;
}> => {
  const { isConnected } = initFirebase();
  if (!isConnected) {
    return {
      success: false,
      syncedCounts: {},
      error: 'Firebase is not initialized or credentials are missing/invalid.',
    };
  }

  // Pre-flight check: verify rules allow writes
  const probe = await testFirestorePermissions();
  if (!probe.ok) {
    return {
      success: false,
      syncedCounts: {},
      error: probe.error || 'Firestore write rejected. Please publish the Firestore Security Rules in Firebase Console.',
    };
  }

  const counts: Record<string, number> = {
    blogs: 0,
    arcadeSolutions: 0,
    unstopProblems: 0,
    opportunities: 0,
    swags: 0,
    cLessons: 0,
    resources: 0,
    settings: 0,
  };

  try {
    for (const b of payload.blogs) {
      if (await saveItemToFirestore('blogs', b)) counts.blogs++;
    }
    for (const a of payload.arcadeSolutions) {
      if (await saveItemToFirestore('arcadeSolutions', a)) counts.arcadeSolutions++;
    }
    for (const u of payload.unstopProblems) {
      if (await saveItemToFirestore('unstopProblems', u)) counts.unstopProblems++;
    }
    for (const o of payload.opportunities) {
      if (await saveItemToFirestore('opportunities', o)) counts.opportunities++;
    }
    for (const s of payload.swags) {
      if (await saveItemToFirestore('swags', s)) counts.swags++;
    }
    for (const c of payload.cLessons) {
      if (await saveItemToFirestore('cLessons', c)) counts.cLessons++;
    }
    for (const r of payload.resources) {
      if (await saveItemToFirestore('resources', r)) counts.resources++;
    }
    if (await saveDocToFirestore('appConfig', 'siteSettings', payload.siteSettings)) counts.settings++;
    if (await saveDocToFirestore('appConfig', 'arcadeCalculatorConfig', payload.arcadeCalculatorConfig)) counts.settings++;

    const totalSynced = Object.values(counts).reduce((a, b) => a + b, 0);
    if (totalSynced === 0) {
      return {
        success: false,
        syncedCounts: counts,
        error: 'Firestore did not accept any document writes. Check that your security rules are published in Firebase Console.',
      };
    }

    return {
      success: true,
      syncedCounts: counts,
    };
  } catch (err: any) {
    return {
      success: false,
      syncedCounts: counts,
      error: err?.message || 'Sync encountered an error',
    };
  }
};

// Probe live read/write capability to diagnose rules or permissions
export const testFirestorePermissions = async (): Promise<{
  ok: boolean;
  status: 'connected_read_write' | 'permission_denied' | 'not_configured' | 'network_error';
  error?: string;
  projectId?: string;
}> => {
  const { isConnected, db, projectId } = initFirebase();
  if (!isConnected || !db) {
    return { ok: false, status: 'not_configured', error: 'Firebase is not initialized or credentials are missing' };
  }

  try {
    const probeDoc = doc(db, '_healthCheck', 'probe');
    await setDoc(probeDoc, { lastCheck: new Date().toISOString(), status: 'active' }, { merge: true });
    return { ok: true, status: 'connected_read_write', projectId };
  } catch (err: any) {
    // Secondary fallback probe on appConfig
    try {
      const cfgProbe = doc(db, 'appConfig', 'healthCheck');
      await setDoc(cfgProbe, { lastCheck: new Date().toISOString(), status: 'active' }, { merge: true });
      return { ok: true, status: 'connected_read_write', projectId };
    } catch (secondaryErr: any) {
      const msg = (secondaryErr?.message || err?.message || '').toLowerCase();
      if (
        msg.includes('permission') ||
        msg.includes('missing or insufficient') ||
        secondaryErr?.code === 'permission-denied' ||
        err?.code === 'permission-denied'
      ) {
        return {
          ok: false,
          status: 'permission_denied',
          projectId,
          error: 'Firestore Security Rules are blocking writes (Permission Denied). Please publish the security rules in Firebase Console.',
        };
      }
      return {
        ok: false,
        status: 'network_error',
        projectId,
        error: secondaryErr?.message || err?.message || 'Failed to communicate with Cloud Firestore',
      };
    }
  }
};


