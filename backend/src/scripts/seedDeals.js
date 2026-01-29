/**
 * Database Seeding Script
 * 
 * Populates database with sample deals for testing.
 * Run with: node src/scripts/seedDeals.js
 * 
 * Reasoning:
 * - Provides realistic data for development
 * - Mix of locked and unlocked deals
 * - Various categories represented
 * - Can be run multiple times (idempotent)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Deal = require('../models/Deal');

const sampleDeals = [
    {
        title: 'AWS Credits - $5,000 Free Tier',
        description: 'Get $5,000 in AWS credits for your startup. Perfect for hosting, databases, and cloud infrastructure. Credits valid for 12 months.',
        category: 'cloud_services',
        partner: {
            name: 'Amazon Web Services',
            logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400',
            website: 'https://aws.amazon.com',
            description: 'Leading cloud computing platform',
        },
        discount: {
            type: 'credits',
            value: '$5,000 credits',
            originalPrice: '$5,000',
        },
        isLocked: true,
        eligibilityRequirements: 'Must be a verified startup founder with a registered company less than 2 years old.',
        features: [
            'EC2 compute instances',
            'S3 storage buckets',
            'RDS database hosting',
            'Lambda serverless functions',
        ],
        terms: 'Credits must be used within 12 months. One-time offer per company.',
        validUntil: new Date('2026-12-31'),
        featured: true,
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    },
    {
        title: 'Notion Team Plan - 6 Months Free',
        description: 'Organize your startup with Notion. Get 6 months free on the Team plan. Perfect for documentation, wikis, and project management.',
        category: 'productivity',
        partner: {
            name: 'Notion',
            logo: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
            website: 'https://notion.so',
            description: 'All-in-one workspace',
        },
        discount: {
            type: 'free_trial',
            value: '6 months free',
            originalPrice: '$480',
        },
        isLocked: false,
        eligibilityRequirements: 'Available to all registered users',
        features: [
            'Unlimited team members',
            'Advanced permissions',
            'Version history',
            'Priority support',
        ],
        terms: 'Must be a new Notion customer. One per team.',
        featured: true,
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    },
    {
        title: 'Mailchimp - 50% Off First Year',
        description: 'Email marketing platform for startups. Build your audience and grow your business with powerful email campaigns.',
        category: 'marketing',
        partner: {
            name: 'Mailchimp',
            logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
            website: 'https://mailchimp.com',
            description: 'Email marketing platform',
        },
        discount: {
            type: 'percentage',
            value: '50% off',
            originalPrice: '$299/month',
        },
        isLocked: false,
        features: [
            'Unlimited emails',
            'Advanced segmentation',
            'A/B testing',
            'Automation workflows',
        ],
        coverImage: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800',
    },
    {
        title: 'Google Cloud Platform - $10,000 Credits',
        description: 'Massive cloud credits for infrastructure, AI/ML, and data analytics. Build and scale your applications on Google Cloud.',
        category: 'cloud_services',
        partner: {
            name: 'Google Cloud',
            logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400',
            website: 'https://cloud.google.com',
            description: 'Google Cloud Platform',
        },
        discount: {
            type: 'credits',
            value: '$10,000 credits',
            originalPrice: '$10,000',
        },
        isLocked: true,
        eligibilityRequirements: 'Requires verification and company registration. Startups must be less than 5 years old.',
        features: [
            'Compute Engine',
            'Cloud Storage',
            'BigQuery analytics',
            'AI/ML services',
        ],
        validUntil: new Date('2026-12-31'),
        featured: true,
        coverImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    },
    {
        title: 'Figma Professional - 3 Months Free',
        description: 'Design tool for teams. Collaborate in real-time on web and mobile designs.',
        category: 'design',
        partner: {
            name: 'Figma',
            logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
            website: 'https://figma.com',
            description: 'Collaborative design tool',
        },
        discount: {
            type: 'free_trial',
            value: '3 months free',
            originalPrice: '$135',
        },
        isLocked: false,
        features: [
            'Unlimited files',
            'Unlimited version history',
            'Team libraries',
            'Advanced prototyping',
        ],
        coverImage: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=800',
    },
    {
        title: 'Stripe Atlas - $100 Discount',
        description: 'Incorporate your startup in Delaware with Stripe Atlas. Get all the legal paperwork handled.',
        category: 'legal',
        partner: {
            name: 'Stripe',
            logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
            website: 'https://stripe.com/atlas',
            description: 'Payments infrastructure',
        },
        discount: {
            type: 'fixed',
            value: '$100 off',
            originalPrice: '$500',
        },
        isLocked: true,
        eligibilityRequirements: 'For founders looking to incorporate their startup',
        features: [
            'Delaware C-Corp formation',
            'IRS tax ID (EIN)',
            'Banking recommendations',
            'Legal templates',
        ],
        coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    },
    {
        title: 'Mixpanel - Free Growth Plan',
        description: 'Product analytics for tracking user behavior. Understand how users interact with your product.',
        category: 'analytics',
        partner: {
            name: 'Mixpanel',
            logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
            website: 'https://mixpanel.com',
            description: 'Product analytics platform',
        },
        discount: {
            type: 'free_trial',
            value: 'Free for 1 year',
            originalPrice: '$999',
        },
        isLocked: false,
        features: [
            '100M events/month',
            'Unlimited reports',
            'Data retention',
            'Email support',
        ],
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    },
    {
        title: 'Slack Business+ - 50% Off',
        description: 'Team communication platform. Keep your startup connected and productive.',
        category: 'communication',
        partner: {
            name: 'Slack',
            logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
            website: 'https://slack.com',
            description: 'Business communication platform',
        },
        discount: {
            type: 'percentage',
            value: '50% off first year',
            originalPrice: '$15/user/month',
        },
        isLocked: false,
        features: [
            'Unlimited message history',
            'Unlimited apps',
            'Guest accounts',
            '99.99% uptime SLA',
        ],
        coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
    },
    {
        title: 'MongoDB Atlas - $500 Credits',
        description: 'Cloud database service. Scale your application with MongoDB Atlas.',
        category: 'development',
        partner: {
            name: 'MongoDB',
            logo: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
            website: 'https://mongodb.com/atlas',
            description: 'Cloud database platform',
        },
        discount: {
            type: 'credits',
            value: '$500 credits',
            originalPrice: '$500',
        },
        isLocked: true,
        eligibilityRequirements: 'Verified startups only',
        features: [
            'Fully managed database',
            'Automatic scaling',
            'Built-in security',
            'Global clusters',
        ],
        coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    },
    {
        title: 'HubSpot CRM - Startup Bundle',
        description: 'Complete CRM platform for managing customer relationships, sales, and marketing.',
        category: 'marketing',
        partner: {
            name: 'HubSpot',
            logo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
            website: 'https://hubspot.com',
            description: 'Customer relationship management',
        },
        discount: {
            type: 'percentage',
            value: '90% off for 1 year',
            originalPrice: '$1,200',
        },
        isLocked: true,
        eligibilityRequirements: 'Startups less than 2 years old, less than $2M in funding',
        features: [
            'Contact management',
            'Email marketing',
            'Sales automation',
            'Reporting dashboard',
        ],
        validUntil: new Date('2026-06-30'),
        coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    },
];

const seedDeals = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing deals (optional - remove in production)
        await Deal.deleteMany({});
        console.log('Cleared existing deals');

        // Insert sample deals
        const deals = await Deal.insertMany(sampleDeals);
        console.log(`✅ Successfully seeded ${deals.length} deals`);

        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDeals();