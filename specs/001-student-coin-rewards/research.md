# Research: Student Club Coin Rewards System

**Date**: 2026-01-21
**Branch**: `001-student-coin-rewards`

## Technology Decisions

### 1. Full-Stack Framework: Next.js 14 with App Router

**Decision**: Use Next.js 14 with App Router for the full-stack application

**Rationale**:
- Single codebase for frontend and API routes simplifies deployment
- App Router provides React Server Components for better performance
- Built-in API routes eliminate need for separate backend
- Excellent TypeScript support out of the box
- Strong ecosystem for authentication and database integration
- Vercel deployment provides easy scaling

**Alternatives Considered**:
- Separate React + Express: More complex deployment, additional CORS handling
- Remix: Excellent but smaller ecosystem, less Supabase integration documentation
- SvelteKit: Great performance but team may be more familiar with React

### 2. Database & Authentication: Supabase

**Decision**: Use Supabase for PostgreSQL database and authentication

**Rationale**:
- PostgreSQL provides ACID compliance essential for financial transactions
- Built-in Row Level Security (RLS) simplifies authorization logic
- Supabase Auth handles email/password with minimal code
- Real-time subscriptions enable live balance updates
- Generous free tier suitable for student club scale
- Auto-generated TypeScript types from database schema

**Alternatives Considered**:
- Firebase: NoSQL not ideal for relational data like transactions
- PlanetScale: MySQL-based, less rich auth integration
- Self-hosted PostgreSQL: More operational overhead

### 3. Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for styling

**Rationale**:
- Mobile-first responsive utilities built-in
- Rapid prototyping with utility classes
- Small production bundle with purging
- Excellent documentation and community
- shadcn/ui provides accessible component primitives

**Alternatives Considered**:
- CSS Modules: More verbose for responsive design
- Styled Components: Runtime overhead, less ideal for Server Components
- Chakra UI: Heavier bundle size

### 4. Testing Strategy

**Decision**: Vitest for unit tests, Playwright for E2E

**Rationale**:
- Vitest is fast, ESM-native, and compatible with Vite (Next.js compatible)
- Playwright provides reliable cross-browser E2E testing
- Both have excellent TypeScript support

**Alternatives Considered**:
- Jest: Slower, more configuration needed
- Cypress: Good but Playwright has better performance and reliability

## Technical Research

### Supabase Best Practices for Financial Data

**Balance Management**:
- Store balance as computed value OR as cached column with triggers
- **Chosen approach**: Cached `balance` column on `users` table updated via database triggers
- Prevents expensive recalculation on every read
- Triggers ensure consistency even if application crashes mid-transaction

**Transaction Safety**:
- All balance-affecting operations use database transactions
- Optimistic locking with version numbers for concurrent access
- Row Level Security ensures users only see their own data

**Schema Design**:
```sql
-- Use integer for coins (no fractional coins)
-- Use CHECK constraints to prevent negative balances
-- Use triggers to maintain balance cache
```

### Next.js App Router Patterns

**Route Groups**:
- `(auth)` group for login/register (public routes)
- `(dashboard)` group for authenticated routes
- Middleware handles redirect logic

**Server Actions vs API Routes**:
- Use Server Actions for form submissions (simpler)
- Use API Routes for complex operations needing explicit control
- Transactions (award, transfer, redeem) use Server Actions with database transactions

**Authentication Flow**:
- Supabase client-side for login/register forms
- Server-side session validation via cookies
- Middleware protects dashboard routes

### Mobile-First Considerations

**PWA Capability**:
- Add `next-pwa` for service worker and offline support
- Cache static assets and user's own balance
- Show stale data with "updating..." indicator when offline

**Touch Interactions**:
- Minimum 44x44px touch targets
- Swipe gestures for transaction history (optional enhancement)
- Pull-to-refresh for balance updates

**Performance**:
- Lazy load non-critical components
- Use `loading.tsx` for route transitions
- Optimize images with `next/image`

### Notification Strategy

**Decision**: In-app notifications with optional email

**Rationale**:
- Push notifications require complex setup (service workers, permissions)
- In-app notification center is simpler and works reliably
- Email notifications for important events (rewards, large transfers)

**Implementation**:
- `notifications` table in database
- Real-time subscription for logged-in users
- Unread count badge in header
- Email via Supabase Edge Functions (later enhancement)

## Security Considerations

### Row Level Security Policies

```text
Users: Can read own profile, admins can read all
Transactions: Can read own, admins can read all, only system can write
Rewards: All can read active, admins can write
Redemptions: Can read own, only system can create
```

### Input Validation

- All amounts validated as positive integers
- Maximum transfer/award limits (configurable)
- Rate limiting on transaction endpoints
- CSRF protection via Supabase's token handling

### Admin Protection

- Admin role checked server-side, never trust client
- Admin actions logged with actor ID
- Separate admin routes with additional middleware check

## Unknowns Resolved

| Original Unknown | Resolution |
|-----------------|------------|
| Authentication method | Supabase Auth with email/password |
| Real-time updates | Supabase Realtime subscriptions |
| Notification delivery | In-app notifications table with real-time |
| Offline handling | PWA with cached balance, graceful degradation |
| Transaction safety | Database transactions with triggers |

## Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^14.0.0 | Full-stack framework |
| react | ^18.0.0 | UI library |
| @supabase/supabase-js | ^2.0.0 | Database & auth client |
| @supabase/ssr | ^0.1.0 | Server-side Supabase |
| tailwindcss | ^3.4.0 | Styling |
| typescript | ^5.0.0 | Type safety |
| vitest | ^1.0.0 | Unit testing |
| @playwright/test | ^1.40.0 | E2E testing |
| zod | ^3.22.0 | Runtime validation |
