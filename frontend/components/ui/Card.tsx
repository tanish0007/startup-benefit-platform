'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  hover?: boolean;
}

export default function Card({ className, hover = true, children, ...props }: CardProps) {
  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.3 }}
        className={cn(
          'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}