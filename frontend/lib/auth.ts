/**
 * Authentication Utilities
 * 
 * Helper functions for authentication management.
 * Handles token storage, retrieval, and user session.
 */

import Cookies from 'js-cookie';
import { User } from '@/types';

export const setTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('accessToken', accessToken, { expires: 1 / 96 }); // 15 minutes
  Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get('accessToken');
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get('refreshToken');
};

export const removeTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const setUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

export const logout = () => {
  removeTokens();
  removeUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};