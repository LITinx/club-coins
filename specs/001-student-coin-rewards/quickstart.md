# Quickstart: Student Club Coin Rewards System

**Date**: 2026-01-21
**Branch**: `001-student-coin-rewards`

## Prerequisites

- Node.js 20 LTS or later
- npm or pnpm
- Supabase account (free tier works)
- Git

## Initial Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (~2 minutes)
3. Note down the following from Settings > API:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public key
   - Service Role key (keep secret!)

### 2. Initialize Next.js Project

```bash
# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr zod

# Install dev dependencies
npm install -D vitest @vitejs/plugin-react @playwright/test
```

### 3. Environment Setup

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_NAME="Club Coins"
```

Create `.env.example` (commit this):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_NAME="Club Coins"
```

### 4. Database Setup

Install Supabase CLI:

```bash
npm install -D supabase
npx supabase init
npx supabase link --project-ref your-project-ref
```

Create initial migration (`supabase/migrations/0001_initial_schema.sql`):

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE transaction_type AS ENUM ('award', 'transfer', 'redemption');
CREATE TYPE notification_type AS ENUM ('award', 'transfer_received', 'transfer_sent', 'redemption');

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type transaction_type NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),
  reward_id UUID,
  description VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL CHECK (cost > 0),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  quantity_remaining INTEGER NOT NULL CHECK (quantity_remaining >= 0),
  image_url VARCHAR(500),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key for reward_id after rewards table exists
ALTER TABLE transactions
  ADD CONSTRAINT fk_reward
  FOREIGN KEY (reward_id) REFERENCES rewards(id);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_transactions_from_user ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user ON transactions(to_user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_rewards_is_active ON rewards(is_active);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic setup)
-- Users
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Transactions
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

CREATE POLICY "Admins can read all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Rewards
CREATE POLICY "Anyone can read active rewards" ON rewards
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can read all rewards" ON rewards
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage rewards" ON rewards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Notifications
CREATE POLICY "Users own notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());
```

Apply migration:

```bash
npx supabase db push
```

### 5. Supabase Client Setup

Create `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Create `src/lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### 6. Middleware Setup

Create `src/middleware.ts`:

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users from auth pages
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm run test        # Unit tests with Vitest
npm run test:e2e    # E2E tests with Playwright

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Database commands
npx supabase db push           # Apply migrations
npx supabase db reset          # Reset local database
npx supabase gen types typescript --local > src/types/database.ts
```

## Testing Setup

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Seed Data (Optional)

Create `supabase/seed.sql`:

```sql
-- Create admin user (run after auth user is created via UI)
-- UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

-- Sample rewards
INSERT INTO rewards (name, description, cost, quantity, quantity_remaining) VALUES
  ('Coffee Voucher', 'One free coffee at the campus cafe', 50, 100, 100),
  ('Club T-Shirt', 'Official club branded t-shirt', 200, 50, 50),
  ('Event Priority Access', 'Skip the line at the next club event', 75, 20, 20),
  ('Mentorship Session', '1-hour session with a senior member', 150, 10, 10);
```

## Next Steps

1. Create authentication pages (login, register)
2. Build the dashboard layout with navigation
3. Implement balance display and transaction history
4. Add coin transfer functionality
5. Build reward catalog and redemption flow
6. Create admin pages for awarding coins and managing rewards
7. Add notifications system
8. Set up PWA capabilities for mobile experience
