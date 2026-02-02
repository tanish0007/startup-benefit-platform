'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ClaimCardSkeleton from '@/components/ui/ClaimCardSkeleton';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { isAuthenticated } from '@/lib/auth';
import api from '@/lib/api';
import { Claim, ClaimStats } from '@/types';
import { formatRelativeTime, getCategoryLabel } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<ClaimStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [claimsRes, statsRes] = await Promise.all([
        api.get('/claims'),
        api.get('/claims/stats'),
      ]);

      setClaims(claimsRes.data.data.claims);
      setStats(statsRes.data.data.stats);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.name || <Skeleton width={150} />}</span>
            </h1>
            <p className="text-gray-600">
              Manage your claimed deals and track your savings
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <Skeleton height={40} width={60} className="mb-2" />
                  <Skeleton height={20} width={80} />
                </div>
              ))
            ) : stats ? (
              <>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
                  <div className="text-gray-600 text-sm">Total Claims</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-gray-600 text-sm">Approved</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-gray-600 text-sm">Pending</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-gray-600 text-sm">Rejected</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold text-gray-600">{stats.expired}</div>
                  <div className="text-gray-600 text-sm">Expired</div>
                </div>
              </>
            ) : null}
          </motion.div>

          {/* Account Status */}
          {!user?.isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-2">Account Not Verified</h3>
                  <p className="text-yellow-800 mb-4">
                    Verify your account to unlock exclusive deals and premium benefits.
                  </p>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Verify Account
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Claimed Deals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Claimed Deals</h2>
              <Link href="/deals">
                <Button variant="outline">Browse More Deals</Button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ClaimCardSkeleton key={index} />
                ))}
              </div>
            ) : claims.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No claims yet</h3>
                <p className="text-gray-600 mb-6">
                  Start claiming exclusive deals to see them here
                </p>
                <Link href="/deals">
                  <Button>Browse Deals</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {claims.map((claim) => {
                  const deal = typeof claim.deal === 'object' ? claim.deal : null;
                  if (!deal) return null;

                  return (
                    <motion.div
                      key={claim._id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Deal Image */}
                          <div className="relative w-full sm:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={deal.coverImage}
                              alt={deal.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Deal Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {deal.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {deal.partner.name} • {getCategoryLabel(deal.category)}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  statusColors[claim.status]
                                }`}
                              >
                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                              </span>
                            </div>

                            <p className="text-gray-700 mb-4 line-clamp-2">{deal.description}</p>

                            {claim.status === 'approved' && claim.redemptionCode && (
                              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-xs text-purple-600 font-semibold mb-1">
                                      REDEMPTION CODE
                                    </div>
                                    <div className="text-lg font-mono font-bold text-purple-900">
                                      {claim.redemptionCode}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      navigator.clipboard.writeText(claim.redemptionCode!);
                                      toast.success('Code copied!');
                                    }}
                                  >
                                    Copy
                                  </Button>
                                </div>
                                {claim.redemptionInstructions && (
                                  <p className="text-xs text-purple-700 mt-2">
                                    {claim.redemptionInstructions}
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>Claimed {formatRelativeTime(claim.claimedAt)}</span>
                              <Link href={`/deals/${deal._id}`}>
                                <Button variant="ghost" size="sm">
                                  View Deal →
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}