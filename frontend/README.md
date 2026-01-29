# Startup Benefits Platform - Frontend

Production-ready Next.js frontend with stunning animations and 3D elements.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP + Framer Motion
- **3D**: Three.js + React Three Fiber
- **State**: Zustand
- **HTTP**: Axios

### Project Structure
```
app/
├── (auth)/          # Auth pages (login, register)
├── deals/           # Deals listing and details
├── dashboard/       # User dashboard
├── page.tsx         # Landing page
└── layout.tsx       # Root layout

components/
├── layout/          # Navbar, Footer
├── ui/              # Reusable UI components
├── animations/      # Animation components
└── three/           # 3D components

lib/
├── api.ts           # API client
├── auth.ts          # Auth utilities
└── utils.ts         # Helper functions

store/
└── authStore.ts     # Global state
```

## ✨ Features

### Animations
- GSAP scroll-triggered animations
- Framer Motion page transitions
- Interactive hover effects
- Loading states with spinners
- Smooth page navigation

### 3D Elements
- Floating card scene on hero
- Interactive Three.js canvas
- Auto-rotating camera
- Mouse-responsive elements

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-optimized interactions
- Collapsible mobile menu

### Authentication Flow
1. User registers/logs in
2. JWT tokens stored in cookies
3. Auto-refresh on token expiry
4. Protected routes with middleware
5. Persistent session across tabs

### Deal Claiming Flow
1. Browse deals (public/locked)
2. View deal details
3. Claim deal (auth required)
4. Receive redemption code
5. View in dashboard

## 🎨 Design System

### Colors
- Primary: Purple (#a855f7)
- Secondary: Pink (#ec4899)
- Accent: Blue (#3b82f6)

### Typography
- Font: Inter
- Headings: Bold, gradient text
- Body: Regular, gray-700

### Components
- Buttons: 3 variants, 3 sizes
- Cards: Hover effects, shadows
- Inputs: Focus states, validation
- Modals: Animated entrance

## 🔐 Security

### Token Management
- Access token: 15 minutes (cookie)
- Refresh token: 7 days (cookie)
- Auto-refresh on 401
- Secure httpOnly cookies (production)

### Route Protection
- Auth check on protected routes
- Redirect to login if not authenticated
- Prevent logged-in users from auth pages

### API Security
- CORS enabled for allowed origins
- Request interceptors for auth
- Error handling with toast notifications

## 📱 Responsive Breakpoints
```css
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

## 🎯 Performance

### Optimizations
- Image optimization (Next.js Image)
- Code splitting (automatic)
- Lazy loading components
- Memoization with React hooks
- Efficient re-renders with Zustand

### Loading States
- Skeleton screens
- Spinners for async operations
- Optimistic UI updates
- Error boundaries

## 🧪 Testing Workflow

1. Register new account
2. Browse deals
3. Filter by category
4. View deal details
5. Claim deal
6. Check dashboard
7. Copy redemption code
8. Logout and login
9. Verify persistence

## 📦 Build for Production
```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Environment Variables
Set in deployment platform:
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🔧 Common Issues

### CORS Errors
- Ensure backend CORS allows frontend origin
- Check `CLIENT_URL` in backend `.env`

### Token Expiry
- Tokens auto-refresh
- Manual refresh if needed

### 3D Not Rendering
- Check WebGL support
- Clear browser cache

## 📝 Code Quality

### TypeScript
- Strict mode enabled
- Type-safe API calls
- Interface definitions

### Code Style
- Consistent formatting
- Component documentation
- Meaningful variable names

## 🎓 Learning Resources

- Next.js: https://nextjs.org/docs
- GSAP: https://gsap.com/docs
- Three.js: https://threejs.org/docs
- Tailwind: https://tailwindcss.com/docs