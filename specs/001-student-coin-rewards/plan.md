# Implementation Plan: Student Club Coin Rewards System

**Branch**: `001-student-coin-rewards` | **Date**: 2026-01-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-student-coin-rewards/spec.md`

## Summary

Build a mobile-first web application for a student club virtual currency system. Students earn coins as rewards from administrators for club participation, can transfer coins to peers, and redeem them for rewards. The system uses Next.js for the full-stack application with Supabase providing PostgreSQL database and built-in authentication.

## Technical Context

**Language/Version**: TypeScript 5.x with Node.js 20 LTS
**Primary Dependencies**: Next.js 14 (App Router), Supabase JS Client, Tailwind CSS, React 18
**Storage**: Supabase (PostgreSQL) with Row Level Security
**Testing**: Vitest for unit tests, Playwright for E2E tests
**Target Platform**: Mobile web browsers (PWA-capable), responsive design (320px+)
**Project Type**: Web application (monorepo with Next.js full-stack)
**Performance Goals**: Balance visible in <2s, transfers complete in <5s, 500 concurrent users
**Constraints**: Mobile-first responsive design, offline-graceful (show cached data), real-time balance updates
**Scale/Scope**: Single club deployment, ~500 members, ~50 active rewards

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is not yet configured (template placeholders). For this greenfield project, we adopt the following principles:

| Principle | Status | Notes |
|-----------|--------|-------|
| Single Deployment | PASS | Single club, not multi-tenant as specified |
| Standard Auth | PASS | Using Supabase Auth (email/password) per assumptions |
| Data Integrity | PASS | PostgreSQL with transactions for balance operations |
| Mobile-First | PASS | Tailwind CSS with responsive utilities, 320px minimum |
| Security | PASS | Row Level Security, input validation, no negative balances |

**Gate Status**: PASS - No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-student-coin-rewards/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected routes
│   │   ├── layout.tsx       # Dashboard layout with nav
│   │   ├── page.tsx         # Home/balance view
│   │   ├── history/         # Transaction history
│   │   ├── transfer/        # Send coins
│   │   ├── rewards/         # Browse & redeem rewards
│   │   └── admin/           # Admin-only routes
│   │       ├── award/       # Award coins to students
│   │       ├── members/     # View all members
│   │       ├── rewards/     # Manage reward catalog
│   │       └── stats/       # Club statistics
│   ├── api/                 # API routes
│   │   ├── transactions/
│   │   ├── rewards/
│   │   └── admin/
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing/redirect
├── components/              # Shared UI components
│   ├── ui/                  # Base components (Button, Card, Input)
│   ├── forms/               # Form components
│   └── features/            # Feature-specific components
├── lib/                     # Utilities and clients
│   ├── supabase/            # Supabase client & helpers
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
├── types/                   # TypeScript type definitions
└── styles/                  # Global styles

tests/
├── unit/                    # Vitest unit tests
├── integration/             # API integration tests
└── e2e/                     # Playwright E2E tests

supabase/
├── migrations/              # Database migrations
└── seed.sql                 # Initial seed data
```

**Structure Decision**: Next.js App Router monorepo structure. The `(auth)` and `(dashboard)` route groups separate public and protected routes. Supabase handles database and authentication externally, with migrations tracked in the `supabase/` directory.

## Complexity Tracking

> No constitution violations - table not required.
