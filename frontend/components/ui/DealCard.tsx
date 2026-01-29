/**
 * Deal Card Component
 * 
 * Reusable card for displaying deal information.
 * Includes hover animations and lock indicator.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Deal } from '@/types';
import { getCategoryLabel, getDiscountDisplay } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  return (
    <Link href={`/deals/${deal._id}`}>
      <motion.div
        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
        className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <Image
            src={deal.coverImage}
            alt={deal.title}
            fill
            className="object-cover"
          />
          {deal.isLocked && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              🔒 Verified Only
            </div>
          )}
          {deal.featured && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Partner Info */}
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={deal.partner.logo}
              alt={deal.partner.name}
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <div className="font-semibold text-gray-900">{deal.partner.name}</div>
              <div className="text-xs text-gray-500">
                {getCategoryLabel(deal.category)}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {deal.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
            {deal.description}
          </p>

          {/* Discount Badge */}
          <div className="flex items-center justify-between">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-bold">
              {getDiscountDisplay(deal.discount)}
            </div>
            <div className="text-sm text-gray-500">
              {deal.claimCount} claimed
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}