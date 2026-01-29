/**
 * Landing Page
 * 
 * Main entry point with hero section, features, and CTA.
 * Includes 3D elements and extensive GSAP animations.
 */

'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingCards from '@/components/three/FloatingCards';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useGSAP(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      });
    }

    // Features animation
    if (featuresRef.current) {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }

    // Stats animation
    if (statsRef.current) {
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      });
    }

    // CTA animation
    if (ctaRef.current) {
      gsap.from('.cta-content', {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }, []);

  const features = [
    {
      icon: '☁️',
      title: 'Cloud Credits',
      description: 'Get thousands in AWS, GCP, and Azure credits for your infrastructure.',
    },
    {
      icon: '📈',
      title: 'Marketing Tools',
      description: 'Access premium marketing platforms at a fraction of the cost.',
    },
    {
      icon: '🎨',
      title: 'Design Software',
      description: 'Professional design tools for your brand and product.',
    },
    {
      icon: '💬',
      title: 'Communication',
      description: 'Team collaboration tools to keep everyone connected.',
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Understand your users with powerful analytics platforms.',
    },
    {
      icon: '⚡',
      title: 'Developer Tools',
      description: 'Build faster with premium development and deployment tools.',
    },
  ];

  const stats = [
    { value: '100+', label: 'Exclusive Deals' },
    { value: '$500K+', label: 'Value in Savings' },
    { value: '50+', label: 'Partner Brands' },
    { value: '10K+', label: 'Startups Helped' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <FloatingCards />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold">
                🚀 Exclusive for Startups
              </span>
            </motion.div>

            <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Premium SaaS Tools
              <br />
              <span className="gradient-text">At Startup Prices</span>
            </h1>

            <p className="hero-subtitle text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Access exclusive deals on cloud services, marketing tools, and productivity software. Save thousands while building your startup.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/deals">
                <Button size="lg" className="text-lg px-8 py-4">
                  Browse Deals
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-sm text-gray-600">Trusted by 10,000+ startups</div>
              <div className="text-sm text-gray-600">•</div>
              <div className="text-sm text-gray-600">$500K+ in savings</div>
              <div className="text-sm text-gray-600">•</div>
              <div className="text-sm text-gray-600">50+ partners</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-item text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything Your Startup Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access premium tools and services across all categories at exclusive startup pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, Fast, Exclusive
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get access to premium tools in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account in seconds. No credit card required.
              </p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Browse Deals</h3>
              <p className="text-gray-600">
                Explore exclusive deals across all categories. Filter and search to find what you need.
              </p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Claim & Save</h3>
              <p className="text-gray-600">
                Claim your deals and start saving thousands on premium tools.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cta-content text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Save Thousands?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of startups already saving on premium tools.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Get Started Now - It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}