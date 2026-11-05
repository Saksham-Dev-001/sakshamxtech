// SakshamXTech OneSignal Web Push Integration Service
// Web SDK v16 with PWA & Android Standalone Support

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => Promise<void> | void>;
    OneSignal?: any;
  }
}

let isInitialized = false;
let currentAppId = '';

/**
 * Initializes OneSignal Web SDK v16
 * Can be called with an App ID from SiteSettings (Firestore) or VITE_ONESIGNAL_APP_ID (.env)
 */
export const initOneSignal = (appId?: string) => {
  if (typeof window === 'undefined') return;

  const resolvedAppId = (appId?.trim() || (import.meta.env.VITE_ONESIGNAL_APP_ID as string)?.trim() || '').trim();

  if (!resolvedAppId) {
    // Graceful silent wait — admin has not entered an App ID yet
    return;
  }

  // Prevent re-initialization with the same App ID
  if (isInitialized && currentAppId === resolvedAppId) {
    return;
  }

  currentAppId = resolvedAppId;
  isInitialized = true;

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal) => {
    try {
      await OneSignal.init({
        appId: resolvedAppId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false, // We use custom native UI in Navbar & Modals
        },
      });
      console.log('[OneSignal] Initialized with App ID:', resolvedAppId);
    } catch (err) {
      console.warn('[OneSignal] Initialization error:', err);
    }
  });
};

/**
 * Request notification permission from the user
 * Returns true if user allows notifications, false otherwise
 */
export const requestPushPermission = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  // If browser doesn't support notifications at all
  if (!('Notification' in window)) {
    alert('Push notifications are not supported on this browser.');
    return false;
  }

  // If already granted
  if (Notification.permission === 'granted') {
    return true;
  }

  // 1. Try via OneSignal SDK v16
  try {
    if (window.OneSignal?.Notifications?.requestPermission) {
      const granted = await window.OneSignal.Notifications.requestPermission();
      return Boolean(granted);
    }
  } catch (e) {
    console.warn('[OneSignal] SDK permission request fallback:', e);
  }

  // 2. Browser native fallback
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch (err) {
    console.error('[OneSignal] Permission request error:', err);
    return false;
  }
};

/**
 * Check current push permission status
 */
export const getPushPermissionState = (): 'default' | 'granted' | 'denied' | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

/**
 * Check if Web Push is supported on this device
 */
export const isPushSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
};

