/**
 * TypeScript Type Definitions
 * 
 * Centralized type definitions for the entire application.
 * Ensures type safety across components and API calls.
 */

export interface User {
  _id: string;
  name: string;
  email: string;
  company?: string;
  role: 'founder' | 'team_member' | 'indie_hacker';
  isVerified: boolean;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Deal {
  _id: string;
  title: string;
  description: string;
  category: DealCategory;
  partner: {
    name: string;
    logo: string;
    website: string;
    description?: string;
  };
  discount: {
    type: 'percentage' | 'fixed' | 'credits' | 'free_trial';
    value: string;
    originalPrice?: string;
  };
  isLocked: boolean;
  eligibilityRequirements: string;
  features: string[];
  terms?: string;
  validUntil?: string;
  claimCount: number;
  maxClaims?: number;
  isActive: boolean;
  featured: boolean;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export type DealCategory =
  | 'cloud_services'
  | 'marketing'
  | 'analytics'
  | 'productivity'
  | 'development'
  | 'design'
  | 'communication'
  | 'finance'
  | 'legal'
  | 'other';

export interface Claim {
  _id: string;
  user: string | User;
  deal: string | Deal;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  redemptionCode?: string;
  redemptionInstructions?: string;
  notes?: string;
  claimedAt: string;
  approvedAt?: string;
  expiresAt?: string;
  usedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<{ items: T[] }> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  company?: string;
  role?: 'founder' | 'team_member' | 'indie_hacker';
}

export interface ClaimStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  expired: number;
}