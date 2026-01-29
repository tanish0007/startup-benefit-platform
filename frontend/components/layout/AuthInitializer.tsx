/**
 * Auth Initializer
 * 
 * Client-side component that initializes auth state on mount.
 * Loads user from localStorage and hydrates the auth store.
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}