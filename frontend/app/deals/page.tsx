/**
 * Deals Listing Page
 * 
 * Browse all deals with filters, search, and pagination.
 * GSAP scroll animations for cards.
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DealCard from '@/components/ui/DealCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { Deal } from '@/types';
import { getCategoryLabel } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function DealsPage() {
  const searchParams = useSearchParams();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    isLocked: searchParams.get('isLocked') || '',
    search: searchParams.get('search') || '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dealsRef = useRef<HTMLDivElement>(null);

  const categories = [
    'cloud_services',
    'marketing',
    'analytics',
    'productivity',
    'development',
    'design',
    'communication',
    'finance',
    'legal',
    'other',
  ];

  useGSAP(() => {
    if (dealsRef.current && deals.length > 0) {
      gsap.from('.deal-card-item', {
        scrollTrigger: {
          trigger: dealsRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }
  }, [deals]);

  useEffect(() => {
    fetchDeals();
  }, [filters, page]);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.isLocked) params.append('isLocked', filters.isLocked);
      if (filters.search) params.append('search', filters.search);
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await api.get(`/deals?${params.toString()}`);
      setDeals(response.data.data.deals);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', isLocked: '', search: '' });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Browse <span className="gradient-text">Exclusive Deals</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover premium SaaS tools at startup prices. Save thousands on the tools you need.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search deals..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
              />

              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {getCategoryLabel(cat)}
                  </option>
                ))}
              </select>

              {/* Access Level Filter */}
              <select
                value={filters.isLocked}
                onChange={(e) => handleFilterChange('isLocked', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
              >
                <option value="">All Deals</option>
                <option value="false">Public Deals</option>
                <option value="true">Verified Only</option>
              </select>
            </div>

            {(filters.category || filters.isLocked || filters.search) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>

          {/* Deals Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : deals.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <>
              <div ref={dealsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {deals.map((deal) => (
                  <div key={deal._id} className="deal-card-item">
                    <DealCard deal={deal} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          p === page
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}