import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  email: string;
  name: string;
  role: 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, passkey: string) => Promise<{ success: boolean; message?: string }>;
  loginWithPasskey: (passkey: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  authorizedEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTHORIZED_ADMIN_EMAIL = 'hutch.saksham@gmail.com';
const STORAGE_KEY = 'sakshamxtech_owner_session_v2';
const PASSKEY_STORAGE_KEY = 'sakshamxtech_owner_secret_hash_v2';
const AUTH_GUARD_KEY = 'sx_auth_guard_v2';

// Salted SHA-256 hash of default master key with salt
const MASTER_SALT = 'sx_salt_9x';
const DEFAULT_HASH = 'bbcc9d71f94630bb499ba35bea23e004d6548b62d2993fb0210b20fcb1cc1f84';
const SESSION_MAX_AGE_MS = 4 * 60 * 60 * 1000; // 4 Hours

function readStoredGuard(): { failedAttempts: number; lockoutUntil: number | null } {
  try {
    const raw = localStorage.getItem(AUTH_GUARD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        failedAttempts: Number(parsed.failedAttempts) || 0,
        lockoutUntil: typeof parsed.lockoutUntil === 'number' ? parsed.lockoutUntil : null,
      };
    }
  } catch {}
  return { failedAttempts: 0, lockoutUntil: null };
}

function persistStoredGuard(failedAttempts: number, lockoutUntil: number | null) {
  try {
    localStorage.setItem(AUTH_GUARD_KEY, JSON.stringify({ failedAttempts, lockoutUntil }));
  } catch {}
}

async function hashPasskey(rawPass: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(MASTER_SALT + rawPass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rate limiting & persistent lockout protection against reload brute-forcing
  const [failedAttempts, setFailedAttempts] = useState(() => readStoredGuard().failedAttempts);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => readStoredGuard().lockoutUntil);

  useEffect(() => {
    // Check active session with expiry validation
    try {
      const savedSession = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        const isFresh = Date.now() - (parsed.timestamp || 0) < SESSION_MAX_AGE_MS;
        if (parsed.email === AUTHORIZED_ADMIN_EMAIL && parsed.token && isFresh) {
          setUser({
            email: AUTHORIZED_ADMIN_EMAIL,
            name: 'Saksham (Founder)',
            role: 'admin',
          });
        } else if (!isFresh) {
          sessionStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn('Session check error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, passkey: string): Promise<{ success: boolean; message?: string }> => {
    // Check persistent lockout state
    const currentGuard = readStoredGuard();
    const effectiveLockout = currentGuard.lockoutUntil || lockoutUntil;

    if (effectiveLockout && Date.now() < effectiveLockout) {
      const waitSeconds = Math.ceil((effectiveLockout - Date.now()) / 1000);
      return {
        success: false,
        message: `Temporary hold active. Please wait ${waitSeconds}s before retrying.`,
      };
    }

    // Artificial delay to prevent high-frequency automated brute-force scripts
    await new Promise((r) => setTimeout(r, 350));

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      recordFailure();
      return {
        success: false,
        message: 'Verification declined. Invalid identity.',
      };
    }

    const inputHash = await hashPasskey(passkey.trim());
    const targetHash = localStorage.getItem(PASSKEY_STORAGE_KEY) || DEFAULT_HASH;

    if (!safeCompare(inputHash, targetHash)) {
      recordFailure();
      return {
        success: false,
        message: 'Verification declined. Incorrect passkey.',
      };
    }

    // Success! Generate cryptographically random session token
    const tokenBuffer = new Uint8Array(24);
    crypto.getRandomValues(tokenBuffer);
    const sessionToken = Array.from(tokenBuffer).map(b => b.toString(16).padStart(2, '0')).join('');

    const sessionData = {
      email: AUTHORIZED_ADMIN_EMAIL,
      token: sessionToken,
      timestamp: Date.now(),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

    setUser({
      email: AUTHORIZED_ADMIN_EMAIL,
      name: 'Saksham (Founder)',
      role: 'admin',
    });
    setFailedAttempts(0);
    setLockoutUntil(null);
    persistStoredGuard(0, null);

    return { success: true };
  };

  const loginWithPasskey = async (passkey: string): Promise<{ success: boolean; message?: string }> => {
    return login(AUTHORIZED_ADMIN_EMAIL, passkey);
  };

  const recordFailure = () => {
    const current = readStoredGuard();
    const nextAttempts = (current.failedAttempts || failedAttempts) + 1;
    let nextLockout: number | null = null;

    // Exponential progressive lockout
    if (nextAttempts >= 9) {
      nextLockout = Date.now() + 30 * 60 * 1000; // 30 minutes
    } else if (nextAttempts >= 7) {
      nextLockout = Date.now() + 10 * 60 * 1000; // 10 minutes
    } else if (nextAttempts >= 5) {
      nextLockout = Date.now() + 3 * 60 * 1000; // 3 minutes
    } else if (nextAttempts >= 3) {
      nextLockout = Date.now() + 30 * 1000; // 30 seconds
    }

    setFailedAttempts(nextAttempts);
    setLockoutUntil(nextLockout);
    persistStoredGuard(nextAttempts, nextLockout);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: !!user && user.email === AUTHORIZED_ADMIN_EMAIL,
        isLoading,
        login,
        loginWithPasskey,
        logout,
        authorizedEmail: AUTHORIZED_ADMIN_EMAIL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
