/**
 * Card Component
 * 
 * Reusable card container with hover effects.
 */

'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ className, hover = true, children, ...props }: CardProps) {
  const Component = hover ? motion.div : 'div';

  return (
    <Component
      {...(hover && {
        whileHover: { y: -5, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' },
        transition: { duration: 0.3 },
      })}
      className={cn(
        'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}