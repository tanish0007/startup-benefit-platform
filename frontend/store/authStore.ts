/**
 * Authentication Store
 * 
 * Global state management for authentication using Zustand.
 * Manages user state and authentication status.
 */

import { create } from 'zustand';
import { User } from '@/types';
import { getUser, setUser as saveUser, removeUser } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    if (user) {
      saveUser(user);
    }
    set({ user, isAuthenticated: !!user });
  },

  clearUser: () => {
    removeUser();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = getUser();
    set({ user, isAuthenticated: !!user });
  },
}));