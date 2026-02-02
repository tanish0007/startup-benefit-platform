# API Documentation

Complete API reference for the Startup Benefits Platform backend.

**Base URL**: `http://localhost:5000/api` (development)  
**Production URL**: `https://api.yourdomain.com/api`

## Table of Contents

- [Authentication](#authentication)
- [Endpoints Overview](#endpoints-overview)
- [Authentication Endpoints](#authentication-endpoints)
- [Deal Endpoints](#deal-endpoints)
- [Claim Endpoints](#claim-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Best Practices](#best-practices)

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication with a dual-token system:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Authentication Flow

1. User logs in or registers → receives both tokens
2. Access token included in `Authorization` header for protected routes
3. When access token expires → use refresh token to get new tokens
4. Logout → refresh token is invalidated

### Using Tokens

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Endpoints Overview

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| **Authentication** |
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| POST | `/auth/refresh` | No | Refresh access token |
| GET | `/auth/profile` | Yes | Get current user profile |
| POST | `/auth/logout` | Yes | Logout user |
| **Deals** |
| GET | `/deals` | Optional | Get all deals (filtered) |
| GET | `/deals/:dealId` | Optional | Get single deal |
| GET | `/deals/featured` | Optional | Get featured deals |
| GET | `/deals/popular` | Optional | Get popular deals |
| GET | `/deals/categories` | No | Get categories with counts |
| **Claims** |
| POST | `/claims` | Yes | Claim a deal |
| GET | `/claims` | Yes | Get user's claims |
| GET | `/claims/stats` | Yes | Get claim statistics |
| GET | `/claims/:claimId` | Yes | Get single claim |

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@startup.com",
  "password": "securepassword123",
  "company": "Startup Inc.",
  "role": "founder"
}
```

**Request Fields**:
- `name` (required): User's full name (2-50 characters)
- `email` (required): Valid email address
- `password` (required): Password (minimum 6 characters)
- `company` (optional): Company name (max 100 characters)
- `role` (optional): One of: `founder`, `team_member`, `indie_hacker` (default: `indie_hacker`)

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@startup.com",
      "company": "Startup Inc.",
      "role": "founder",
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**:

409 Conflict - Email already exists:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

400 Bad Request - Validation error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

### Login User

Authenticate an existing user.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@startup.com",
  "password": "securepassword123"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@startup.com",
      "company": "Startup Inc.",
      "role": "founder",
      "isVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Refresh Access Token

Get a new access token using a refresh token.

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

---

### Get User Profile

Get the authenticated user's profile.

**Endpoint**: `GET /api/auth/profile`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@startup.com",
      "company": "Startup Inc.",
      "role": "founder",
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### Logout User

Invalidate the refresh token (logout).

**Endpoint**: `POST /api/auth/logout`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null
}
```

---

## Deal Endpoints

### Get All Deals

Retrieve a paginated list of deals with optional filters.

**Endpoint**: `GET /api/deals`

**Query Parameters**:
- `category` (optional): Filter by category
  - Values: `cloud_services`, `marketing`, `analytics`, `productivity`, `development`, `design`, `communication`, `finance`, `legal`, `other`
- `isLocked` (optional): Filter by lock status (`true` or `false`)
- `search` (optional): Search query (max 100 characters)
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 12, min: 1, max: 100)
- `sort` (optional): Sort field (default: `-createdAt`)

**Example Request**:
```
GET /api/deals?category=cloud_services&page=1&limit=12&isLocked=false
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Deals retrieved successfully",
  "data": {
    "deals": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "title": "AWS Activate Credits",
        "description": "Get $100,000 in AWS credits for your startup infrastructure...",
        "category": "cloud_services",
        "partner": {
          "name": "Amazon Web Services",
          "logo": "https://example.com/aws-logo.png",
          "website": "https://aws.amazon.com",
          "description": "Leading cloud platform provider"
        },
        "discount": {
          "type": "credits",
          "value": "$100,000 credits",
          "originalPrice": "$100,000"
        },
        "isLocked": true,
        "eligibilityRequirements": "Must be part of a recognized startup program",
        "features": [
          "EC2 instances",
          "S3 storage",
          "Lambda functions",
          "RDS databases"
        ],
        "terms": "Valid for 2 years from activation",
        "validUntil": "2025-12-31T23:59:59.000Z",
        "claimCount": 1247,
        "maxClaims": null,
        "isActive": true,
        "featured": true,
        "coverImage": "https://example.com/aws-cover.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
      // ... more deals
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 108,
      "pages": 9
    }
  }
}
```

---

### Get Single Deal

Retrieve details of a specific deal.

**Endpoint**: `GET /api/deals/:dealId`

**URL Parameters**:
- `dealId`: MongoDB ObjectId of the deal

**Example Request**:
```
GET /api/deals/65a1b2c3d4e5f6g7h8i9j0k2
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Deal retrieved successfully",
  "data": {
    "deal": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "title": "AWS Activate Credits",
      "description": "Get $100,000 in AWS credits...",
      "category": "cloud_services",
      "partner": { /* ... */ },
      "discount": { /* ... */ },
      "isLocked": true,
      "features": [ /* ... */ ],
      // ... all deal fields
    }
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Deal not found"
}
```

---

### Get Featured Deals

Retrieve featured deals.

**Endpoint**: `GET /api/deals/featured`

**Query Parameters**:
- `limit` (optional): Number of deals to return (default: 6)

**Example Request**:
```
GET /api/deals/featured?limit=6
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Featured deals retrieved successfully",
  "data": {
    "deals": [
      { /* deal object */ },
      { /* deal object */ }
    ]
  }
}
```

---

### Get Popular Deals

Retrieve deals sorted by claim count.

**Endpoint**: `GET /api/deals/popular`

**Query Parameters**:
- `limit` (optional): Number of deals to return (default: 6)

**Example Request**:
```
GET /api/deals/popular?limit=6
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Popular deals retrieved successfully",
  "data": {
    "deals": [
      { /* deal object */ },
      { /* deal object */ }
    ]
  }
}
```

---

### Get Categories

Retrieve all categories with deal counts.

**Endpoint**: `GET /api/deals/categories`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "category": "cloud_services",
        "count": 28
      },
      {
        "category": "marketing",
        "count": 22
      },
      {
        "category": "productivity",
        "count": 18
      }
      // ... more categories
    ]
  }
}
```

---

## Claim Endpoints

### Claim a Deal

Claim a specific deal (requires authentication).

**Endpoint**: `POST /api/claims`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body**:
```json
{
  "dealId": "65a1b2c3d4e5f6g7h8i9j0k2"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Deal claimed successfully",
  "data": {
    "claim": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "user": "65a1b2c3d4e5f6g7h8i9j0k1",
      "deal": {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
        "title": "AWS Activate Credits",
        // ... full deal object
      },
      "status": "approved",
      "redemptionCode": "AWS-XKJF-9823-PLMN",
      "redemptionInstructions": "Visit https://aws.amazon.com and use your redemption code at checkout.",
      "claimedAt": "2024-01-15T10:30:00.000Z",
      "approvedAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses**:

404 Not Found - Deal doesn't exist:
```json
{
  "success": false,
  "message": "Deal not found"
}
```

403 Forbidden - Verification required:
```json
{
  "success": false,
  "message": "This deal requires account verification. Please verify your account to claim this deal."
}
```

409 Conflict - Already claimed:
```json
{
  "success": false,
  "message": "You have already claimed this deal"
}
```

400 Bad Request - Deal expired:
```json
{
  "success": false,
  "message": "Deal has expired"
}
```

---

### Get User's Claims

Retrieve all claims for the authenticated user.

**Endpoint**: `GET /api/claims`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `status` (optional): Filter by status (`pending`, `approved`, `rejected`, `expired`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request**:
```
GET /api/claims?status=approved&page=1&limit=10
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Claims retrieved successfully",
  "data": {
    "claims": [
      {
        "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
        "user": "65a1b2c3d4e5f6g7h8i9j0k1",
        "deal": {
          "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
          "title": "AWS Activate Credits",
          "partner": { /* ... */ },
          // ... full deal object
        },
        "status": "approved",
        "redemptionCode": "AWS-XKJF-9823-PLMN",
        "redemptionInstructions": "Visit https://aws.amazon.com...",
        "claimedAt": "2024-01-15T10:30:00.000Z",
        "approvedAt": "2024-01-15T10:30:00.000Z"
      }
      // ... more claims
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### Get Single Claim

Retrieve details of a specific claim.

**Endpoint**: `GET /api/claims/:claimId`

**Headers**:
```
Authorization: Bearer <access_token>
```

**URL Parameters**:
- `claimId`: MongoDB ObjectId of the claim

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Claim retrieved successfully",
  "data": {
    "claim": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "user": "65a1b2c3d4e5f6g7h8i9j0k1",
      "deal": { /* full deal object */ },
      "status": "approved",
      "redemptionCode": "AWS-XKJF-9823-PLMN",
      "redemptionInstructions": "Visit https://aws.amazon.com...",
      "claimedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses**:

404 Not Found:
```json
{
  "success": false,
  "message": "Claim not found"
}
```

403 Forbidden - Not the claim owner:
```json
{
  "success": false,
  "message": "Access denied"
}
```

---

### Get Claim Statistics

Get aggregated statistics for user's claims.

**Endpoint**: `GET /api/claims/stats`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "stats": {
      "total": 15,
      "pending": 2,
      "approved": 11,
      "rejected": 1,
      "expired": 1
    }
  }
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

With validation errors:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate email) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Messages

**Authentication Errors**:
- `"No token provided"` - Missing Authorization header
- `"Invalid token"` - Malformed or invalid JWT
- `"Token expired"` - Access token has expired
- `"Invalid refresh token"` - Refresh token is invalid or expired
- `"User not found"` - User account no longer exists

**Validation Errors**:
- `"Email already registered"` - Email is taken
- `"Invalid email or password"` - Login failed
- `"Validation failed"` - Input validation errors
- `"Deal ID is required"` - Missing required field

**Authorization Errors**:
- `"Access denied"` - User lacks permission
- `"This deal requires account verification"` - Unverified user trying to claim locked deal

**Resource Errors**:
- `"Deal not found"` - Deal doesn't exist or is inactive
- `"Claim not found"` - Claim doesn't exist
- `"Route {url} not found"` - Invalid endpoint

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per 15 minutes per IP address
- **Scope**: All `/api/*` endpoints
- **Headers**: 
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

**Rate Limit Exceeded Response** (429):
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### Rate Limit Configuration

Configured in `backend/app.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

---

## Best Practices

### 1. Token Management

**Store tokens securely**:
- Use HTTP-only cookies for web applications
- Use secure storage (Keychain/Keystore) for mobile apps
- Never store tokens in localStorage if XSS is a concern

**Refresh token flow**:
```javascript
// Example: Automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      const refreshToken = getRefreshToken();
      const response = await api.post('/auth/refresh', { refreshToken });
      
      const { accessToken } = response.data.data;
      setAccessToken(accessToken);
      
      error.config.headers.Authorization = `Bearer ${accessToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 2. Error Handling

**Always handle errors**:
```javascript
try {
  const response = await api.post('/claims', { dealId });
  // Handle success
} catch (error) {
  if (error.response?.status === 409) {
    // Already claimed
  } else if (error.response?.status === 403) {
    // Verification required
  } else {
    // Generic error
  }
}
```

### 3. Pagination

**Always paginate large datasets**:
```javascript
// Good
GET /api/deals?page=1&limit=12

// Bad (could return thousands of records)
GET /api/deals
```

### 4. Filtering

**Use query parameters for filtering**:
```javascript
// Filter by category
GET /api/deals?category=cloud_services

// Multiple filters
GET /api/deals?category=marketing&isLocked=false&search=email

// Combine with pagination
GET /api/deals?category=analytics&page=2&limit=20
```

### 5. Search

**Use the search parameter for text search**:
```javascript
GET /api/deals?search=AWS credits
```

The search uses MongoDB text index on `title` and `description` fields.

### 6. Validation

**Client-side validation before sending**:
```javascript
// Validate before sending request
if (!email || !password) {
  return; // Show error to user
}

// Then send request
await api.post('/auth/login', { email, password });
```

---

## Code Examples

### Complete Authentication Flow

```javascript
// 1. Register
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Store tokens
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    
    // Store user
    setUser(user);
    
    return user;
  } catch (error) {
    throw error;
  }
};

// 2. Login
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data.data;
    
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
    
    return user;
  } catch (error) {
    throw error;
  }
};

// 3. Logout
const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    removeAccessToken();
    removeRefreshToken();
    removeUser();
  }
};
```

### Fetching and Filtering Deals

```javascript
// Fetch all deals with filters
const fetchDeals = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.isLocked !== undefined) params.append('isLocked', filters.isLocked);
    if (filters.search) params.append('search', filters.search);
    params.append('page', filters.page || 1);
    params.append('limit', filters.limit || 12);
    
    const response = await api.get(`/deals?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Usage
const { deals, pagination } = await fetchDeals({
  category: 'cloud_services',
  isLocked: false,
  page: 1,
  limit: 12
});
```

### Claiming a Deal

```javascript
const claimDeal = async (dealId) => {
  try {
    const response = await api.post('/claims', { dealId });
    const { claim } = response.data.data;
    
    console.log('Redemption Code:', claim.redemptionCode);
    console.log('Instructions:', claim.redemptionInstructions);
    
    return claim;
  } catch (error) {
    if (error.response?.status === 403) {
      // Show verification required message
    } else if (error.response?.status === 409) {
      // Already claimed
    }
    throw error;
  }
};
```

---

## Testing the API

### Using cURL

**Register a user**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@startup.com",
    "password": "password123",
    "company": "Startup Inc."
  }'
```

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@startup.com",
    "password": "password123"
  }'
```

**Get deals** (with auth):
```bash
curl -X GET http://localhost:5000/api/deals \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Claim a deal**:
```bash
curl -X POST http://localhost:5000/api/claims \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dealId": "65a1b2c3d4e5f6g7h8i9j0k2"
  }'
```

### Using Postman

1. Import the API endpoints
2. Set up environment variables:
   - `BASE_URL`: `http://localhost:5000/api`
   - `ACCESS_TOKEN`: Your access token
3. Use `{{BASE_URL}}` and `{{ACCESS_TOKEN}}` in requests

---

## Support

For API support:
- **Email**: api-support@startupdeals.com
- **GitHub Issues**: https://github.com/yourusername/startup-benefits-platform/issues
- **Documentation**: https://docs.startupdeals.com

---

**Last Updated**: February 2, 2026  
**API Version**: 1.0.0