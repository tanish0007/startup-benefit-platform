/**
 * Deal Card Skeleton
 * 
 * Loading skeleton for deal cards
 */

'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function DealCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
      {/* Image Skeleton */}
      <Skeleton height={192} />

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Partner Info */}
        <div className="flex items-center gap-3 mb-3">
          <Skeleton circle width={40} height={40} />
          <div className="flex-1">
            <Skeleton height={20} width="60%" />
            <Skeleton height={16} width="40%" />
          </div>
        </div>

        {/* Title */}
        <Skeleton height={24} width="90%" className="mb-2" />

        {/* Description */}
        <div className="flex-1 mb-4">
          <Skeleton count={3} height={16} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Skeleton height={40} width={120} />
          <Skeleton height={20} width={80} />
        </div>
      </div>
    </div>
  );
}