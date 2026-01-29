/**
 * General Utilities
 * 
 * Helper functions used throughout the application.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const categoryLabels: Record<string, string> = {
  cloud_services: 'Cloud Services',
  marketing: 'Marketing',
  analytics: 'Analytics',
  productivity: 'Productivity',
  development: 'Development',
  design: 'Design',
  communication: 'Communication',
  finance: 'Finance',
  legal: 'Legal',
  other: 'Other',
};

export const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category;
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const getDiscountDisplay = (discount: {
  type: string;
  value: string;
}): string => {
  switch (discount.type) {
    case 'percentage':
      return discount.value;
    case 'fixed':
      return discount.value;
    case 'credits':
      return discount.value;
    case 'free_trial':
      return discount.value;
    default:
      return discount.value;
  }
};