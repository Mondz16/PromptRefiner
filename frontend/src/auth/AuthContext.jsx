import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../lib/apiClient';

const AuthContext = createContext(null);

const STORAGE_KEY = 'promptrefiner_auth';

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { user: null, token: null };
    try {
      return JSON.parse(stored);
    } catch {
      return { user: null, token: null };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  const login = (token, user) => {
    setAuthState({ token, user });
  };

  const logout = () => {
    setAuthState({ token: null, user: null });
  };

  const value = {
    user: authState.user,
    token: authState.token,
    login,
    logout,
  };

  apiClient.setToken(authState.token);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

