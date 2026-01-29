# Startup Benefits Platform - Backend

Production-ready backend API for the Startup Benefits & Partnerships Platform.

## Architecture Overview

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh Tokens)
- **Security**: Helmet, CORS, Rate Limiting

### Project Structure
```
src/
├── config/          # Database configuration
├── models/          # Mongoose schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth, validation, error handling
├── utils/           # Helpers (JWT, errors, responses)
├── scripts/         # Database seeding
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Setup Steps

1. **Clone and Install**
```bash
git clone <your-repo-url>
cd startup-benefits-backend
npm install
```

2. **Environment Configuration**
Create `.env` file in root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/startup-benefits
JWT_ACCESS_SECRET=your_super_secret_access_token_key
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

4. **Seed Database**
```bash
npm run seed
```

5. **Start Server**
```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Deals
- `GET /api/deals` - Get all deals (with filters)
- `GET /api/deals/:dealId` - Get single deal
- `GET /api/deals/featured` - Get featured deals
- `GET /api/deals/popular` - Get popular deals
- `GET /api/deals/categories` - Get categories

### Claims
- `POST /api/claims` - Claim a deal (protected)
- `GET /api/claims` - Get user's claims (protected)
- `GET /api/claims/:claimId` - Get single claim (protected)
- `GET /api/claims/stats` - Get claim statistics (protected)

## 🔐 Authentication Flow

### Registration/Login
1. User submits credentials
2. Server validates input
3. For registration: hash password, create user
4. For login: verify password
5. Generate access token (15min) and refresh token (7 days)
6. Store refresh token in database
7. Return both tokens to client

### Protected Routes
1. Client sends access token in Authorization header: `Bearer <token>`
2. Middleware verifies token
3. User object attached to request
4. Route handler processes request

### Token Refresh
1. Client sends refresh token
2. Server verifies refresh token
3. Generate new access and refresh tokens
4. Update refresh token in database
5. Return new tokens

## 🎯 Deal Claiming Flow

### Prerequisites Check
1. User must be authenticated
2. Deal must exist and be active
3. Deal must be claimable (not expired, under max claims)

### Authorization
- **Unlocked deals**: Any authenticated user can claim
- **Locked deals**: Only verified users can claim

### Claim Process
1. Verify user hasn't already claimed this deal
2. Create claim record with status (approved/pending)
3. Generate redemption code
4. Increment deal's claim count
5. Return claim with redemption details

### Duplicate Prevention
- Compound unique index on `(user, deal)`
- Database enforces one claim per user per deal

## 🔒 Security Features

### Password Security
- Bcrypt hashing with salt rounds: 12
- Passwords never returned in queries
- Stored hashed in database

### JWT Security
- Separate secrets for access and refresh tokens
- Short-lived access tokens (15 minutes)
- Refresh tokens stored in database for invalidation
- Token type verification

### API Security
- Helmet for security headers
- CORS configuration for allowed origins
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- MongoDB injection prevention via Mongoose

### Error Handling
- Never leak sensitive error details
- Custom error classes for specific scenarios
- Proper HTTP status codes
- Production vs development error verbosity

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  company: String,
  role: Enum,
  isVerified: Boolean,
  refreshToken: String
}
```

### Deal
```javascript
{
  title: String,
  description: String,
  category: Enum (indexed),
  partner: { name, logo, website, description },
  discount: { type, value, originalPrice },
  isLocked: Boolean (indexed),
  features: [String],
  claimCount: Number,
  isActive: Boolean,
  featured: Boolean
}
```

### Claim
```javascript
{
  user: ObjectId (ref: User),
  deal: ObjectId (ref: Deal),
  status: Enum (pending/approved/rejected),
  redemptionCode: String,
  claimedAt: Date,
  approvedAt: Date
}
// Unique compound index: (user, deal)
```

## 🧪 Testing the API

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "company": "Acme Inc",
    "role": "founder"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Deals
```bash
curl http://localhost:5000/api/deals
```

### Claim Deal (with auth)
```bash
curl -X POST http://localhost:5000/api/claims \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"dealId": "DEAL_ID_HERE"}'
```

## ⚠️ Known Limitations

1. **No Email Verification**: Users marked as verified manually
2. **Auto-Approval**: Claims auto-approved (should have admin approval)
3. **No File Uploads**: Verification documents not implemented
4. **Basic Rate Limiting**: Could be more sophisticated
5. **No Caching**: Redis caching would improve performance
6. **No Logging**: Production needs structured logging
7. **No Tests**: Unit and integration tests needed

## 🚀 Production Readiness Improvements

1. **Email Service**: SendGrid/AWS SES for verification emails
2. **File Storage**: AWS S3 for document uploads
3. **Caching Layer**: Redis for frequently accessed data
4. **Logging**: Winston/Morgan for structured logs
5. **Monitoring**: Sentry for error tracking
6. **Testing**: Jest for unit/integration tests
7. **Documentation**: Swagger/OpenAPI for API docs
8. **CI/CD**: GitHub Actions for automated testing
9. **Database**: Connection pooling optimization
10. **Security**: Additional security headers, CSRF protection

## 📝 Environment Variables

All sensitive configuration in `.env`:
- Database connection string
- JWT secrets (use strong random strings)
- API rate limits
- CORS allowed origins
- Token expiration times

## 🤝 Development Workflow

1. Create feature branch
2. Write code with proper error handling
3. Test endpoints manually
4. Commit with meaningful messages
5. Open pull request
6. Code review
7. Merge to main

## 📄 License

MIT