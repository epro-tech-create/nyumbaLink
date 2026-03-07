'use client';

/**
 * Auth context - user, login, register, logout
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { auth as authApi, User } from '@/services/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; phone?: string; role?: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('nyumbalink_token') : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      localStorage.removeItem('nyumbalink_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, token } = await authApi.login(email, password);
    localStorage.setItem('nyumbalink_token', token);
    setUser(u);
  }, []);

  const register = useCallback(
    async (data: { email: string; password: string; full_name: string; phone?: string; role?: string }) => {
      const { user: u, token } = await authApi.register(data);
      localStorage.setItem('nyumbalink_token', token);
      setUser(u);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('nyumbalink_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
