import { createContext, useState, useEffect, useCallback } from 'react';
import { auth, googleProvider } from '../config/firebase';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import * as api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check from localStorage for fast initial render
    const storedUser = localStorage.getItem('trustpaw_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('trustpaw_user');
      }
    }

    // 2. Real-time Firebase Auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser((currentUser) => {
          const updated = {
            ...(currentUser || {}),
            id: currentUser?.id || firebaseUser.uid,
            _id: currentUser?._id || firebaseUser.uid,
            name: currentUser?.name || firebaseUser.displayName || 'Pet Parent',
            email: currentUser?.email || firebaseUser.email,
            avatar: currentUser?.avatar || firebaseUser.photoURL,
            avatar_url: currentUser?.avatar_url || firebaseUser.photoURL,
            phone: currentUser?.phone || firebaseUser.phoneNumber || '',
            authProvider: 'google',
          };
          localStorage.setItem('trustpaw_user', JSON.stringify(updated));
          return updated;
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      // 1. Interactive Firebase Google Sign-In via popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // 2. Extract OAuth credential & ID tokens
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const googleIdToken = credential?.idToken;
      const firebaseIdToken = await firebaseUser.getIdToken();

      // 3. Synchronize with backend API session
      let backendUser = null;
      try {
        const res = await api.googleAuth(googleIdToken || firebaseIdToken);
        if (res?.user) {
          backendUser = res.user;
        }
      } catch (backendErr) {
        console.warn('Backend session sync notice:', backendErr.message || backendErr);
      }

      // 4. Construct unified user object
      const unifiedUser = {
        id: backendUser?.id || firebaseUser.uid,
        _id: backendUser?.id || firebaseUser.uid,
        name: backendUser?.name || firebaseUser.displayName || 'Pet Parent',
        email: backendUser?.email || firebaseUser.email,
        avatar: backendUser?.avatar_url || firebaseUser.photoURL,
        avatar_url: backendUser?.avatar_url || firebaseUser.photoURL,
        phone: backendUser?.phone || firebaseUser.phoneNumber || '',
        authProvider: 'google',
      };

      setUser(unifiedUser);
      localStorage.setItem('trustpaw_user', JSON.stringify(unifiedUser));
      return unifiedUser;
    } catch (err) {
      console.error('Firebase Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed before completion. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains). Please add localhost.');
      } else if (err.code === 'auth/popup-blocked') {
        throw new Error('Sign-in popup was blocked by browser. Please allow popups for TrustPaw.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        throw new Error('Only one sign-in popup can be opened at a time.');
      }
      throw new Error(err.message || 'Google authentication failed');
    }
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res?.user || res.data?.user) {
        const u = res.user || res.data?.user;
        setUser(u);
        localStorage.setItem('trustpaw_user', JSON.stringify(u));
        return u;
      }
    } catch {
      // Demo mode fallback
      const mockUser = {
        _id: 'demo_email_user_001',
        id: 'demo_email_user_001',
        name: email.split('@')[0],
        email,
        phone: '',
        avatar: null,
        avatar_url: null,
        authProvider: 'email',
      };
      setUser(mockUser);
      localStorage.setItem('trustpaw_user', JSON.stringify(mockUser));
      return mockUser;
    }
  }, []);

  const setUserData = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('trustpaw_user', JSON.stringify(userData));
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signOut notice:', err);
    }
    try {
      await api.logout();
    } catch (err) {
      console.warn('Backend logout notice:', err);
    }
    setUser(null);
    localStorage.removeItem('trustpaw_user');
  }, []);

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    setUserData,
    logout: logoutUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
