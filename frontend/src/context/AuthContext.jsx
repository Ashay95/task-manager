import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const STORAGE_USER = 'user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('token', nextToken);
    localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem(STORAGE_USER);
  }, []);

  const register = useCallback(
    async (payload) => {
      const res = await authApi.register(payload);
      if (res?.data?.token && res?.data?.user) {
        persistSession(res.data.token, res.data.user);
      }
      return res;
    },
    [persistSession]
  );

  const login = useCallback(
    async (payload) => {
      const res = await authApi.login(payload);
      if (res?.data?.token && res?.data?.user) {
        persistSession(res.data.token, res.data.user);
      }
      return res;
    },
    [persistSession]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'ADMIN',
      register,
      login,
      logout,
    }),
    [user, token, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
