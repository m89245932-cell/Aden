import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { UserProfile } from '../types/index';
import { fetchUserProfile, saveUserProfile } from '../services/userService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isMerchant: boolean;
  loginWithGoogle: () => Promise<void>;
  loginDemo: (role: 'merchant' | 'admin' | 'user') => void;
  loginWithEmail: (email: string, displayName?: string, role?: 'user' | 'merchant') => Promise<void>;
  registerUser: (email: string, displayName: string, role?: 'user' | 'merchant', phone?: string, district?: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function cacheUserProfile(profile: UserProfile): void {
  const { phoneNumber: _phoneNumber, ...cacheSafeProfile } = profile;
  localStorage.setItem('adengo_user_cache', JSON.stringify(cacheSafeProfile));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('adengo_user_cache');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  const determineRole = (email?: string | null): 'admin' | 'merchant' | 'user' => {
    if (!email) return 'user';
    const lower = email.toLowerCase();
    if (lower === 'm89245932@gmail.com' || lower.includes('admin@adengo.ye')) {
      return 'admin';
    }
    if (lower.includes('merchant')) {
      return 'merchant';
    }
    return 'user';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Try to load extended profile from Firestore
        const remoteProfile = await fetchUserProfile(fbUser.uid);
        const role = remoteProfile?.role || determineRole(fbUser.email);
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || 'user@adengo.ye',
          displayName: remoteProfile?.displayName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Aden Citizen',
          phoneNumber: remoteProfile?.phoneNumber || '+967 770 123 456',
          district: remoteProfile?.district || 'crater',
          bio: remoteProfile?.bio || '',
          avatarUrl: remoteProfile?.avatarUrl || '',
          preferredLanguage: remoteProfile?.preferredLanguage || 'ar',
          role
        };
        setUser(profile);
        cacheUserProfile(profile);
        // Save to Firestore asynchronously
        saveUserProfile(profile).catch(() => {});
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
        displayName: result.user.displayName || 'Aden Citizen',
        phoneNumber: '+967 770 123 456',
        district: 'crater',
        role
      };
      setUser(profile);
      cacheUserProfile(profile);
      saveUserProfile(profile).catch(() => {});
    } catch (error) {
      console.warn('Google sign-in popup encountered error, falling back to demo session:', error);
      loginDemo('user');
    }
  };

  const loginDemo = (role: 'merchant' | 'admin' | 'user') => {
    let displayName = 'فؤاد سالم (Fouad Salem)';
    if (role === 'admin') displayName = 'مدير منصة عدن (Admin)';
    if (role === 'merchant') displayName = 'مالك مطعم الصياد (Merchant)';

    const profile: UserProfile = {
      uid: `demo-${role}-${Date.now()}`,
      email: `${role}@adengo.ye`,
      displayName,
      phoneNumber: '+967 771 234 567',
      district: 'crater',
      bio: role === 'merchant' ? 'مالك ومؤسس مطاعم بحرية عريقة في ساحل صيرة.' : 'مهتم باستكشاف وحجز أفضل مطاعم ومقاهي عدن.',
      role,
      createdAt: new Date().toISOString()
    };
    setUser(profile);
    cacheUserProfile(profile);
    saveUserProfile(profile).catch(() => {});
  };

  const loginWithEmail = async (email: string, displayName?: string, role: 'user' | 'merchant' = 'user') => {
    const determinedRole = determineRole(email);
    const finalRole = determinedRole === 'admin' ? 'admin' : role;
    const profile: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName: displayName || email.split('@')[0],
      phoneNumber: '+967 770 123 456',
      district: 'crater',
      role: finalRole,
      createdAt: new Date().toISOString()
    };
    setUser(profile);
    cacheUserProfile(profile);
    saveUserProfile(profile).catch(() => {});
  };

  const registerUser = async (
    email: string,
    displayName: string,
    role: 'user' | 'merchant' = 'user',
    phone?: string,
    district?: string
  ) => {
    const profile: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      phoneNumber: phone || '+967 770 123 456',
      district: district || 'crater',
      role,
      createdAt: new Date().toISOString()
    };
    setUser(profile);
    cacheUserProfile(profile);
    saveUserProfile(profile).catch(() => {});
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setUser(updated);
    cacheUserProfile(updated);
    await saveUserProfile(updated);
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
        loginWithEmail,
        registerUser,
        updateProfile,
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
