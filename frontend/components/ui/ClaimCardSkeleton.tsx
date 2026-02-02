/**
 * Claim Card Skeleton
 * 
 * Loading skeleton for claimed deals on dashboard
 */

'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ClaimCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Image Skeleton */}
          <Skeleton width={192} height={128} className="rounded-lg shrink-0" />

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <Skeleton height={28} width="80%" className="mb-1" />
                <Skeleton height={20} width="50%" />
              </div>
              <Skeleton height={28} width={80} />
            </div>

            <Skeleton count={2} height={20} className="mb-4" />

            {/* Code Section */}
            <Skeleton height={80} className="mb-4" />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <Skeleton height={20} width={150} />
              <Skeleton height={32} width={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}