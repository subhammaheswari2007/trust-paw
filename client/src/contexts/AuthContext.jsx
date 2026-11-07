import { createContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('trustpaw_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('trustpaw_user');
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const mockUser = {
        _id: 'demo_google_user_001',
        name: 'Priya Sharma',
        email: 'priya.sharma@gmail.com',
        phone: '+919876543210',
        avatar: null,
        authProvider: 'google',
      };
      try {
        const res = await api.googleAuth('demo_google_token');
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('trustpaw_user', JSON.stringify(res.data.user));
          return res.data.user;
        }
      } catch {
        // Demo mode fallback
      }
      setUser(mockUser);
      localStorage.setItem('trustpaw_user', JSON.stringify(mockUser));
      return mockUser;
    } catch (err) {
      console.error('Google auth error:', err);
      throw err;
    }
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('trustpaw_user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch {
      // Demo mode fallback
      const mockUser = {
        _id: 'demo_email_user_001',
        name: email.split('@')[0],
        email,
        phone: '',
        avatar: null,
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
      await api.logout();
    } catch {
      // ignore
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
