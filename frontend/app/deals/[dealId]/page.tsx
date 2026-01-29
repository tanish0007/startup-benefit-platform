/**
 * Deal Details Page
 * 
 * Single deal view with claim functionality.
 * Animated entrance and interactive elements.
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Deal } from '@/types';
import { getCategoryLabel, getDiscountDisplay, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchDeal();
  }, [params.dealId]);

  const fetchDeal = async () => {
    try {
      const response = await api.get(`/deals/${params.dealId}`);
      setDeal(response.data.data.deal);
    } catch (error) {
      toast.error('Deal not found');
      router.push('/deals');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to claim deals');
      router.push('/login');
      return;
    }

    if (deal?.isLocked && !user?.isVerified) {
      toast.error('This deal requires account verification');
      return;
    }

    setClaiming(true);
    try {
      await api.post('/claims', { dealId: deal?._id });
      toast.success('Deal claimed successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to claim deal';
      toast.error(message);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!deal) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header Image */}
            <div className="relative h-80 bg-gradient-to-r from-purple-600 to-pink-600">
              <Image
                src={deal.coverImage}
                alt={deal.title}
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Image
                      src={deal.partner.logo}
                      alt={deal.partner.name}
                      width={100}
                      height={100}
                      className="rounded-2xl mx-auto mb-4 shadow-2xl"
                    />
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl font-bold mb-2">{deal.title}</h1>
                  <p className="text-xl opacity-90">{deal.partner.name}</p>
                </div>
              </div>

              {deal.isLocked && (
                <div className="absolute top-6 right-6 bg-white text-purple-600 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                  Verified Users Only
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 sm:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Discount Badge */}
                  <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-xl">
                    {getDiscountDisplay(deal.discount)}
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About This Deal</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">{deal.description}</p>
                  </div>

                  {/* Features */}
                  {deal.features.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                      <ul className="space-y-3">
                        {deal.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <span className="text-green-500 text-xl">✓</span>
                            <span className="text-gray-700">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Terms */}
                  {deal.terms && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="font-bold mb-2">Terms & Conditions</h3>
                      <p className="text-sm text-gray-600">{deal.terms}</p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Claim Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {getDiscountDisplay(deal.discount)}
                      </div>
                      {deal.discount.originalPrice && (
                        <div className="text-gray-500 line-through">
                          {deal.discount.originalPrice}
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleClaim}
                      isLoading={claiming}
                      className="w-full mb-4"
                      size="lg"
                    >
                      {deal.isLocked && !user?.isVerified
                        ? 'Verification Required'
                        : 'Claim This Deal'}
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                      {deal.claimCount} people have claimed this deal
                    </div>
                  </div>

                  {/* Partner Info */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h3 className="font-bold mb-4">About {deal.partner.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{deal.partner.description}</p>
                    {deal.partner.website && (
                      <a
                        href={deal.partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>

                  {/* Deal Info */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">{getCategoryLabel(deal.category)}</span>
                    </div>
                    {deal.validUntil && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Until</span>
                        <span className="font-medium">{formatDate(deal.validUntil)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Access Level</span>
                      <span className="font-medium">
                        {deal.isLocked ? 'Verified Users' : 'All Users'}
                      </span>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="font-bold mb-2 text-blue-900">Eligibility</h3>
                    <p className="text-sm text-blue-800">{deal.eligibilityRequirements}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}