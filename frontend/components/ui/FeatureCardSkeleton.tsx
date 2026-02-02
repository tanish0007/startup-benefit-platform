/**
 * Feature Card Skeleton
 * 
 * Loading skeleton for feature cards on landing page
 */

'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function FeatureCardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <Skeleton circle width={60} height={60} className="mb-4" />
      <Skeleton height={28} width="70%" className="mb-3" />
      <Skeleton count={2} height={20} />
    </div>
  );
}