# Startup Benefits Platform 🚀

A comprehensive web platform connecting early-stage startups with exclusive SaaS deals and partnerships. Built with Next.js 15, Express.js, MongoDB, and TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Startup Benefits Platform helps early-stage startups save thousands of dollars by providing:

- **100+ Exclusive Deals** on premium SaaS tools
- **$500K+ in Potential Savings** across cloud services, marketing tools, and productivity software
- **Verified Access System** for premium locked deals
- **Easy Claim Process** with instant redemption codes
- **Category-Based Discovery** for finding relevant tools

Perfect for indie hackers, startup founders, and early-stage teams looking to reduce operational costs while accessing enterprise-grade tools.

## ✨ Features

### For Users
- 🔐 **Secure Authentication** - JWT-based auth with refresh tokens
- 🎫 **Deal Discovery** - Browse and filter 100+ exclusive deals
- 🏷️ **Category Organization** - Cloud, Marketing, Analytics, Development, Design, and more
- ⭐ **Featured Deals** - Highlighted premium partnerships
- 🔒 **Locked Deals** - Exclusive offers for verified accounts
- 📊 **Personal Dashboard** - Track claimed deals and redemption codes
- 🎯 **Claim Management** - Instant redemption codes with clear instructions
- 📱 **Responsive Design** - Seamless experience across all devices

### For Developers
- 🏗️ **Clean Architecture** - Separation of concerns with MVC pattern
- 🔄 **Real-time Updates** - Optimistic UI updates
- 🎨 **Modern UI** - Tailwind CSS with custom animations
- 🚀 **Performance** - Optimized bundle size and lazy loading
- 🧪 **Type Safety** - Full TypeScript coverage
- 📦 **Modular Components** - Reusable UI components
- 🎭 **Advanced Animations** - Framer Motion + GSAP

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: 
  - Framer Motion (component animations)
  - GSAP (scroll animations)
- **Forms**: React Hook Form
- **Date Handling**: date-fns
- **UI Components**: Custom components with shadcn/ui inspiration

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: express-validator
- **Security**: 
  - helmet (security headers)
  - cors (CORS configuration)
  - bcryptjs (password hashing)
  - express-rate-limit (rate limiting)

### DevOps
- **Package Manager**: npm/yarn/pnpm
- **Environment**: dotenv
- **Process Management**: PM2 (recommended for production)

## 📁 Project Structure

```
startup-benefits-platform/
├── backend/
│   ├── config/
│   │   └── database.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── dealController.js     # Deal management
│   │   └── claimController.js    # Claim processing
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── validation.js         # Input validation
│   │   └── errorHandler.js       # Global error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Deal.js               # Deal schema
│   │   └── Claim.js              # Claim schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── dealRoutes.js         # Deal endpoints
│   │   └── claimRoutes.js        # Claim endpoints
│   ├── utils/
│   │   ├── errors.js             # Custom error classes
│   │   ├── jwt.js                # Token utilities
│   │   └── response.js           # Response formatting
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   └── .env.example              # Environment template
│
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/            # Login page
│   │   │   └── register/         # Registration page
│   │   ├── deals/
│   │   │   ├── page.tsx          # Deals listing
│   │   │   └── [dealId]/         # Deal details
│   │   ├── dashboard/            # User dashboard
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Navigation bar
│   │   │   ├── Footer.tsx        # Footer
│   │   │   └── AuthInitializer.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx        # Button component
│   │   │   ├── Input.tsx         # Input component
│   │   │   ├── Card.tsx          # Card component
│   │   │   ├── DealCard.tsx      # Deal card
│   │   └── └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   ├── auth.ts               # Auth utilities
│   │   └── utils.ts              # Helper functions
│   ├── store/
│   │   └── authStore.ts          # Zustand store
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   └── public/                   # Static assets
│
├── README.md                     # This file
├── API_DOCUMENTATION.md          # API docs
└── package.json                  # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB 4.4 or higher (local or Atlas)
- npm/yarn/pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/startup-benefits-platform.git
   cd startup-benefits-platform
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**

   **Backend** (`backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000

   # Database
   MONGODB_URI=mongodb://localhost:27017/startup-benefits

   # JWT Secrets (Change in production!)
   JWT_ACCESS_SECRET=your_super_secret_access_token_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_token_key

   # JWT Expiration
   JWT_ACCESS_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d

   # Client URL
   CLIENT_URL=http://localhost:3000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **Frontend** (`frontend/.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**

   Local MongoDB:
   ```bash
   mongod
   ```

   Or use MongoDB Atlas (update `MONGODB_URI` in backend `.env`)

6. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

   Server will run on `http://localhost:5000`

7. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

   App will run on `http://localhost:3000`

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

## ⚙️ Configuration

### Backend Configuration

**Database Connection** (`backend/config/database.js`):
- Connection pooling (10 max, 5 min)
- 30s server selection timeout
- 75s socket timeout
- Automatic reconnection handling
- Graceful shutdown

**Security Settings** (`backend/app.js`):
- Helmet.js for security headers
- CORS enabled for frontend origin
- Rate limiting (100 requests per 15 minutes)
- Body size limits (10MB)

**JWT Configuration**:
- Access Token: 15 minutes expiration
- Refresh Token: 7 days expiration
- Stored in HTTP-only cookies (frontend)

### Frontend Configuration

**API Client** (`frontend/lib/api.ts`):
- Automatic token injection
- Token refresh on 401 errors
- Centralized error handling
- 10s request timeout

**Authentication Flow**:
1. User logs in → receives tokens
2. Tokens stored in cookies
3. Access token auto-injected in requests
4. Refresh token used to get new access token
5. Logout clears all tokens

## 💻 Development

### Backend Development

**Run development server with auto-reload**:
```bash
cd backend
npm run dev
```

**Available Scripts**:
- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm test` - Run tests (when implemented)

**Code Structure Guidelines**:
- Controllers: Business logic
- Models: Database schemas
- Middleware: Request processing
- Routes: API endpoint definitions
- Utils: Helper functions

### Frontend Development

**Run development server**:
```bash
cd frontend
npm run dev
```

**Available Scripts**:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint check

**Component Guidelines**:
- Use TypeScript for all components
- Follow atomic design principles
- Implement proper error boundaries
- Use Suspense for data fetching
- Optimize with React.memo where needed

### Database Seeding (Optional)

Create a seed script to populate initial deals:

```javascript
// backend/scripts/seed.js
const mongoose = require('mongoose');
const Deal = require('../models/Deal');
require('dotenv').config();

const seedDeals = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const deals = [
    {
      title: "AWS Activate Credits",
      description: "Get $100,000 in AWS credits for your startup",
      category: "cloud_services",
      partner: {
        name: "Amazon Web Services",
        logo: "https://logo.url",
        website: "https://aws.amazon.com"
      },
      discount: {
        type: "credits",
        value: "$100,000 credits"
      },
      isLocked: true,
      features: ["EC2", "S3", "Lambda", "RDS"],
      // ... more fields
    },
    // Add more deals
  ];

  await Deal.insertMany(deals);
  console.log('Database seeded!');
  process.exit(0);
};

seedDeals();
```

Run with: `node backend/scripts/seed.js`

## 🚢 Deployment

### Backend Deployment (Production)

1. **Environment Setup**:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_production_mongodb_uri
   JWT_ACCESS_SECRET=strong_random_secret_here
   JWT_REFRESH_SECRET=another_strong_random_secret
   CLIENT_URL=https://yourdomain.com
   ```

2. **Using PM2**:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js --name startup-benefits-api
   pm2 save
   pm2 startup
   ```

3. **Deploy to Cloud Platforms**:

   **Heroku**:
   ```bash
   heroku create startup-benefits-api
   git subtree push --prefix backend heroku main
   ```

   **DigitalOcean/AWS/GCP**:
   - Use Docker containers
   - Set up reverse proxy (Nginx)
   - Configure SSL certificates
   - Set environment variables

### Frontend Deployment

1. **Build for Production**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel** (Recommended):
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Deploy to Netlify**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

4. **Environment Variables**:
   Set `NEXT_PUBLIC_API_URL` to your production API URL

### Database Deployment

**MongoDB Atlas** (Recommended):
1. Create cluster at https://cloud.mongodb.com
2. Set up database user
3. Whitelist IP addresses
4. Copy connection string to `MONGODB_URI`

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API reference including:
- Authentication endpoints
- Deal management
- Claim processing
- Request/response examples
- Error codes

## 🧪 Testing

### Backend Tests (To Implement)

```bash
cd backend
npm test
```

**Suggested Test Structure**:
- Unit tests for controllers
- Integration tests for API endpoints
- Database tests for models
- Authentication flow tests

**Recommended Tools**:
- Jest (test runner)
- Supertest (HTTP testing)
- MongoDB Memory Server (test database)

### Frontend Tests (To Implement)

```bash
cd frontend
npm test
```

**Suggested Test Structure**:
- Component tests (React Testing Library)
- Integration tests (Cypress)
- E2E tests (Playwright)

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens for authentication
- ✅ HTTP-only cookies for token storage
- ✅ CORS configured for specific origin
- ✅ Rate limiting on API endpoints
- ✅ Input validation on all endpoints
- ✅ Security headers with Helmet.js
- ✅ MongoDB injection prevention
- ⚠️ Use HTTPS in production
- ⚠️ Rotate JWT secrets regularly
- ⚠️ Implement CSP headers
- ⚠️ Add request logging

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Failed**:
- Ensure MongoDB is running
- Check connection string format
- Verify network access (if using Atlas)

**CORS Errors**:
- Verify `CLIENT_URL` in backend `.env`
- Check frontend API URL configuration
- Ensure proper origin in CORS settings

**Token Refresh Not Working**:
- Check cookie settings (httpOnly, secure)
- Verify refresh token expiration
- Check API interceptor configuration

**Build Errors**:
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Contribution Guidelines**:
- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- All open-source contributors

## 📧 Support

For support, email support@startupdeals.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Admin panel for deal management
- [ ] Email verification system
- [ ] Advanced search with Algolia
- [ ] Deal recommendations based on user profile
- [ ] Partner dashboard
- [ ] Referral program
- [ ] Mobile apps (React Native)
- [ ] Analytics dashboard
- [ ] Automated deal expiration notifications
- [ ] Integration with CRM platforms

---

**Built with ❤️ for the startup community**