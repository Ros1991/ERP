import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../models/auth/User.model';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (user: any, token: string, refreshToken: string | undefined, rememberMe: boolean) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setToken: (token: string) => void;
}

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Custom storage that uses cookies when rememberMe is true
const customStorage = {
  getItem: (name: string) => {
    const cookieValue = getCookie(name);
    if (cookieValue) {
      return cookieValue;
    }
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    const parsed = JSON.parse(value);
    if (parsed.state?.rememberMe) {
      setCookie(name, value, 30); // 30 days
    } else {
      deleteCookie(name);
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    deleteCookie(name);
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      rememberMe: false,

      login: (user, token, refreshToken, rememberMe = false) => {
        console.log('Login called with:', { user, token: !!token, rememberMe });
        set({
          user,
          token,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          rememberMe,
        });
      },

      logout: () => {
        const { rememberMe } = get();
        if (rememberMe) {
          deleteCookie('auth-storage');
        }
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          rememberMe: false,
        });
      },

      updateUser: (user) => {
        set({ user });
      },

      setToken: (token) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
    }
  )
);

// Helper function to get the current token
export const getAuthToken = () => {
  return useAuthStore.getState().token;
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated;
};
