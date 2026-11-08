import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { UserProfile } from '../types/index';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (role: 'merchant' | 'admin' | 'user') => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('adengo_user_cache');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  const determineRole = (email?: string | null): 'admin' | 'merchant' | 'user' => {
    if (!email) return 'merchant';
    const lower = email.toLowerCase();
    if (lower === 'm89245932@gmail.com' || lower.includes('admin@adengo.ye')) {
      return 'admin';
    }
    return 'merchant';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const role = determineRole(fbUser.email);
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || 'user@adengo.ye',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Aden Merchant',
          role
        };
        setUser(profile);
        localStorage.setItem('adengo_user_cache', JSON.stringify(profile));
      } else {
        // Only clear if not in demo mode
        const cached = localStorage.getItem('adengo_user_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.uid?.startsWith('demo-')) {
            setUser(parsed);
            setLoading(false);
            return;
          }
        }
        setUser(null);
        localStorage.removeItem('adengo_user_cache');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const role = determineRole(result.user.email);
      const profile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email || 'user@adengo.ye',
        displayName: result.user.displayName || 'Aden Merchant',
        role
      };
      setUser(profile);
      localStorage.setItem('adengo_user_cache', JSON.stringify(profile));
    } catch (error) {
      console.warn('Google sign-in popup encountered error, falling back to demo session:', error);
      loginDemo('merchant');
    }
  };

  const loginDemo = (role: 'merchant' | 'admin' | 'user') => {
    const profile: UserProfile = {
      uid: `demo-${role}-${Date.now()}`,
      email: `${role}@adengo.ye`,
      displayName: role === 'admin' ? 'مدير منصة عدن (Admin)' : 'مالك مطعم الصياد (Merchant)',
      role
    };
    setUser(profile);
    localStorage.setItem('adengo_user_cache', JSON.stringify(profile));
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem('adengo_user_cache');
  };

  const isAdmin = user?.role === 'admin';
  const isMerchant = user?.role === 'merchant' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isMerchant,
        loginWithGoogle,
        loginDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
