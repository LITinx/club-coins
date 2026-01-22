# Tasks: Student Club Coin Rewards System

**Input**: Design documents from `/specs/001-student-coin-rewards/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-schema.yaml

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## User Story Mapping

| Story | Title | Priority | Primary Entities |
|-------|-------|----------|------------------|
| US6 | User Registration and Authentication | P1 | User |
| US2 | Student Views Balance and Transaction History | P1 | User, Transaction |
| US1 | Student Receives Coins as Reward | P1 | Transaction, Notification |
| US3 | Student Transfers Coins to Another Student | P2 | Transaction, Notification |
| US4 | Student Redeems Coins for Rewards | P2 | Reward, Transaction |
| US5 | Admin Manages Reward Catalog | P3 | Reward |
| US7 | Admin Views Club-Wide Statistics | P3 | Transaction, User |

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js 14 project with TypeScript, Tailwind CSS, and App Router in project root
- [x] T002 Install core dependencies: @supabase/supabase-js, @supabase/ssr, zod in package.json
- [x] T003 [P] Install dev dependencies: vitest, @playwright/test, @vitejs/plugin-react in package.json
- [x] T004 [P] Configure ESLint and Prettier for TypeScript in .eslintrc.json and .prettierrc
- [x] T005 [P] Create environment files .env.local and .env.example with Supabase config placeholders
- [x] T006 Initialize Supabase project structure with supabase init command
- [x] T007 Create TypeScript types for database entities in src/types/database.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create initial database migration with enums and all tables in supabase/migrations/0001_initial_schema.sql
- [x] T009 Add database triggers for balance updates in supabase/migrations/0002_triggers.sql
- [x] T010 Add Row Level Security policies in supabase/migrations/0003_rls_policies.sql
- [x] T011 Create seed data with sample rewards in supabase/seed.sql
- [x] T012 [P] Create Supabase browser client in src/lib/supabase/client.ts
- [x] T013 [P] Create Supabase server client in src/lib/supabase/server.ts
- [x] T014 [P] Create Supabase admin client (service role) in src/lib/supabase/admin.ts
- [x] T015 Implement authentication middleware in src/middleware.ts
- [x] T016 [P] Create base UI components: Button in src/components/ui/button.tsx
- [x] T017 [P] Create base UI components: Card in src/components/ui/card.tsx
- [x] T018 [P] Create base UI components: Input in src/components/ui/input.tsx
- [x] T019 [P] Create validation schemas with Zod in src/lib/validations/index.ts
- [x] T020 Create root layout with providers in src/app/layout.tsx
- [x] T021 Create landing page with redirect logic in src/app/page.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 6 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable students to register and log in to access the app

**Independent Test**: Register a new account and successfully log in to see dashboard

### Implementation for User Story 6

- [x] T022 [P] [US6] Create auth layout in src/app/(auth)/layout.tsx
- [x] T023 [P] [US6] Create login page UI in src/app/(auth)/login/page.tsx
- [x] T024 [P] [US6] Create register page UI in src/app/(auth)/register/page.tsx
- [x] T025 [US6] Implement login form component with Supabase auth in src/components/forms/login-form.tsx
- [x] T026 [US6] Implement register form component with user creation in src/components/forms/register-form.tsx
- [x] T027 [US6] Create auth callback route for email confirmation in src/app/auth/callback/route.ts
- [x] T028 [US6] Add form validation for email/password in src/lib/validations/auth.ts
- [x] T029 [US6] Implement logout functionality in src/lib/supabase/auth.ts

**Checkpoint**: Users can register, log in, and log out

---

## Phase 4: User Story 2 - Student Views Balance and Transaction History (Priority: P1)

**Goal**: Students can see their coin balance and transaction history

**Independent Test**: Log in as student and view balance prominently displayed with transaction list

### Implementation for User Story 2

- [ ] T030 [P] [US2] Create dashboard layout with navigation in src/app/(dashboard)/layout.tsx
- [ ] T031 [P] [US2] Create useUser hook for current user data in src/lib/hooks/use-user.ts
- [ ] T032 [US2] Create dashboard home page showing balance in src/app/(dashboard)/page.tsx
- [ ] T033 [US2] Create BalanceCard component in src/components/features/balance-card.tsx
- [ ] T034 [P] [US2] Create transaction history page in src/app/(dashboard)/history/page.tsx
- [ ] T035 [P] [US2] Create TransactionList component in src/components/features/transaction-list.tsx
- [ ] T036 [US2] Create TransactionItem component in src/components/features/transaction-item.tsx
- [ ] T037 [US2] Implement GET /api/user/me route in src/app/api/user/me/route.ts
- [ ] T038 [US2] Implement GET /api/transactions route in src/app/api/transactions/route.ts
- [ ] T039 [US2] Add pagination component in src/components/ui/pagination.tsx
- [ ] T040 [US2] Add empty state for no transactions in src/components/features/empty-history.tsx

**Checkpoint**: Students can view balance and browse transaction history

---

## Phase 5: User Story 1 - Student Receives Coins as Reward (Priority: P1)

**Goal**: Admins can award coins to students, students see updated balance and notifications

**Independent Test**: Admin awards 50 coins to student, student's balance updates and notification appears

### Implementation for User Story 1

- [ ] T041 [P] [US1] Create admin layout with navigation in src/app/(dashboard)/admin/layout.tsx
- [ ] T042 [P] [US1] Create admin members list page in src/app/(dashboard)/admin/members/page.tsx
- [ ] T043 [US1] Create MemberList component in src/components/features/admin/member-list.tsx
- [ ] T044 [US1] Create award coins page in src/app/(dashboard)/admin/award/page.tsx
- [ ] T045 [US1] Create AwardCoinsForm component in src/components/forms/award-coins-form.tsx
- [ ] T046 [US1] Implement GET /api/admin/members route in src/app/api/admin/members/route.ts
- [ ] T047 [US1] Implement POST /api/admin/members/[id]/award route in src/app/api/admin/members/[id]/award/route.ts
- [ ] T048 [US1] Add admin role check middleware in src/lib/middleware/admin-check.ts
- [ ] T049 [P] [US1] Create notification bell component in src/components/features/notification-bell.tsx
- [ ] T050 [P] [US1] Create notifications dropdown in src/components/features/notifications-dropdown.tsx
- [ ] T051 [US1] Implement GET /api/notifications route in src/app/api/notifications/route.ts
- [ ] T052 [US1] Implement GET /api/notifications/unread-count route in src/app/api/notifications/unread-count/route.ts
- [ ] T053 [US1] Implement POST /api/notifications/[id]/read route in src/app/api/notifications/[id]/read/route.ts
- [ ] T054 [US1] Add database trigger for award notifications in supabase/migrations/0004_notification_triggers.sql
- [ ] T055 [US1] Add validation for positive amounts in award form in src/lib/validations/transactions.ts

**Checkpoint**: Admin can award coins, student receives notification and sees updated balance

---

## Phase 6: User Story 3 - Student Transfers Coins to Another Student (Priority: P2)

**Goal**: Students can send coins to other students with balance checks

**Independent Test**: Student with 100 coins transfers 30 to another, both balances update correctly

### Implementation for User Story 3

- [ ] T056 [P] [US3] Create transfer page in src/app/(dashboard)/transfer/page.tsx
- [ ] T057 [US3] Create TransferForm component in src/components/forms/transfer-form.tsx
- [ ] T058 [US3] Create UserSearch component for recipient selection in src/components/features/user-search.tsx
- [ ] T059 [US3] Implement GET /api/users/search route in src/app/api/users/search/route.ts
- [ ] T060 [US3] Implement POST /api/transactions/transfer route in src/app/api/transactions/transfer/route.ts
- [ ] T061 [US3] Add balance check validation in transfer endpoint in src/app/api/transactions/transfer/route.ts
- [ ] T062 [US3] Add self-transfer prevention in transfer endpoint in src/app/api/transactions/transfer/route.ts
- [ ] T063 [US3] Add transfer notification triggers in supabase/migrations/0005_transfer_notifications.sql
- [ ] T064 [US3] Create transfer confirmation modal in src/components/features/transfer-confirm-modal.tsx
- [ ] T065 [US3] Add useBalance hook with real-time subscription in src/lib/hooks/use-balance.ts

**Checkpoint**: Students can transfer coins with proper validation and notifications

---

## Phase 7: User Story 4 - Student Redeems Coins for Rewards (Priority: P2)

**Goal**: Students can browse rewards catalog and redeem items with sufficient balance

**Independent Test**: Student with 100 coins redeems 75-coin reward, balance shows 25

### Implementation for User Story 4

- [ ] T066 [P] [US4] Create rewards catalog page in src/app/(dashboard)/rewards/page.tsx
- [ ] T067 [US4] Create RewardCard component in src/components/features/reward-card.tsx
- [ ] T068 [US4] Create RewardGrid component in src/components/features/reward-grid.tsx
- [ ] T069 [US4] Implement GET /api/rewards route in src/app/api/rewards/route.ts
- [ ] T070 [US4] Create reward detail modal in src/components/features/reward-detail-modal.tsx
- [ ] T071 [US4] Implement POST /api/rewards/[id]/redeem route in src/app/api/rewards/[id]/redeem/route.ts
- [ ] T072 [US4] Add balance and inventory check in redeem endpoint in src/app/api/rewards/[id]/redeem/route.ts
- [ ] T073 [US4] Add redemption notification trigger in supabase/migrations/0006_redemption_notifications.sql
- [ ] T074 [US4] Create redemption success page in src/app/(dashboard)/rewards/success/page.tsx
- [ ] T075 [US4] Add out-of-stock indicator to RewardCard in src/components/features/reward-card.tsx

**Checkpoint**: Students can browse and redeem rewards with proper validation

---

## Phase 8: User Story 5 - Admin Manages Reward Catalog (Priority: P3)

**Goal**: Admins can create, edit, and deactivate rewards

**Independent Test**: Admin creates new reward, it appears in student catalog

### Implementation for User Story 5

- [ ] T076 [P] [US5] Create admin rewards page in src/app/(dashboard)/admin/rewards/page.tsx
- [ ] T077 [US5] Create AdminRewardList component in src/components/features/admin/admin-reward-list.tsx
- [ ] T078 [US5] Create reward form page (create/edit) in src/app/(dashboard)/admin/rewards/[id]/page.tsx
- [ ] T079 [US5] Create RewardForm component in src/components/forms/reward-form.tsx
- [ ] T080 [US5] Implement GET /api/admin/rewards route in src/app/api/admin/rewards/route.ts
- [ ] T081 [US5] Implement POST /api/admin/rewards route in src/app/api/admin/rewards/route.ts
- [ ] T082 [US5] Implement PATCH /api/admin/rewards/[id] route in src/app/api/admin/rewards/[id]/route.ts
- [ ] T083 [US5] Add reward validation schema in src/lib/validations/rewards.ts
- [ ] T084 [US5] Add toggle active/inactive functionality in AdminRewardList component

**Checkpoint**: Admins can fully manage the reward catalog

---

## Phase 9: User Story 7 - Admin Views Club-Wide Statistics (Priority: P3)

**Goal**: Admins can view total coins distributed, redeemed, and member activity

**Independent Test**: Admin views stats dashboard showing accurate totals

### Implementation for User Story 7

- [ ] T085 [P] [US7] Create admin stats page in src/app/(dashboard)/admin/stats/page.tsx
- [ ] T086 [US7] Create StatsCard component in src/components/features/admin/stats-card.tsx
- [ ] T087 [US7] Create StatsGrid component in src/components/features/admin/stats-grid.tsx
- [ ] T088 [US7] Implement GET /api/admin/stats route in src/app/api/admin/stats/route.ts
- [ ] T089 [US7] Create RecentActivityList component in src/components/features/admin/recent-activity.tsx
- [ ] T090 [US7] Implement GET /api/admin/transactions route in src/app/api/admin/transactions/route.ts
- [ ] T091 [US7] Add member status management (active/inactive) in src/app/api/admin/members/[id]/status/route.ts

**Checkpoint**: Admins can view comprehensive club statistics

---

## Phase 10: Mobile UI Support

**Purpose**: Enhance UI for mobile devices (320px+) with touch-friendly interactions

### Setup & Infrastructure

- [x] T092 Add mobile-specific CSS utilities (safe-area-inset, touch-action) in src/styles/globals.css
- [x] T093 [P] Update tailwind.config.ts with custom xs breakpoint (320px) for small phones

### Navigation & Layout (NAV)

- [x] T094 [NAV] Add hamburger menu for admin link access on mobile in src/app/dashboard/layout.tsx
- [x] T095 [P] [NAV] Make admin sub-navigation horizontally scrollable on mobile in src/app/dashboard/admin/layout.tsx
- [x] T096 [P] [NAV] Add active state highlighting to mobile bottom navigation in src/app/dashboard/layout.tsx
- [x] T097 [NAV] Hide user info in header on small screens, consolidate in profile menu in src/app/dashboard/layout.tsx

### Lists & Data Display (LIST)

- [x] T098 [LIST] Refactor member-list.tsx to card-based layout on mobile in src/components/features/admin/member-list.tsx
- [x] T099 [P] [LIST] Add responsive transaction-item.tsx with collapsed details on mobile in src/components/features/transaction-item.tsx
- [x] T100 [P] [LIST] Make admin-reward-list.tsx responsive with card layout on mobile in src/components/features/admin/admin-reward-list.tsx

### Forms & Inputs (FORM)

- [x] T101 [FORM] Increase touch targets for all form inputs (min 44px height) in src/components/ui/input.tsx
- [x] T102 [P] [FORM] Add proper input types (tel for amounts, email for email) in src/components/forms/transfer-form.tsx
- [x] T103 [P] [FORM] Make user-search.tsx dropdown full-width on mobile with larger tap targets in src/components/features/user-search.tsx
- [x] T104 [P] [FORM] Update award-coins-form.tsx select to be mobile-friendly in src/components/forms/award-coins-form.tsx
- [x] T105 [FORM] Add numeric keypad trigger (inputmode="numeric") for coin amount inputs across all forms

### Modals & Overlays (MODAL)

- [x] T106 [MODAL] Convert transfer-confirm-modal.tsx to full-screen on mobile in src/components/features/transfer-confirm-modal.tsx
- [x] T107 [P] [MODAL] Convert reward-detail-modal.tsx to full-screen sheet on mobile in src/components/features/reward-detail-modal.tsx
- [x] T108 [P] [MODAL] Make notifications-dropdown.tsx full-width on mobile in src/components/features/notifications-dropdown.tsx
- [x] T109 [MODAL] Add slide-up animation for mobile modals and handle iOS keyboard viewport issues

### Cards & Components (CARD)

- [x] T110 [P] [CARD] Adjust balance-card.tsx button layout to stack vertically on mobile in src/components/features/balance-card.tsx
- [x] T111 [P] [CARD] Make reward-card.tsx text truncate properly on narrow screens in src/components/features/reward-card.tsx
- [x] T112 [P] [CARD] Update stats-card.tsx for smaller screens in src/components/features/admin/stats-card.tsx
- [x] T113 [CARD] Ensure pagination.tsx is touch-friendly with larger buttons in src/components/ui/pagination.tsx

**Checkpoint**: All UI should be usable on 320px screens without horizontal overflow

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [ ] T114 [P] Add loading skeletons optimized for mobile layout in src/components/ui/skeleton.tsx
- [ ] T115 [P] Add error boundary component in src/components/error-boundary.tsx
- [ ] T116 [P] Update toast.tsx positioning for mobile (above bottom nav) in src/components/ui/toast.tsx
- [ ] T117 [P] Add PWA manifest and service worker config in public/manifest.json
- [ ] T118 Add viewport meta tag adjustments for notched devices in src/app/layout.tsx
- [ ] T119 [P] Create 404 page in src/app/not-found.tsx
- [ ] T120 [P] Create error page in src/app/error.tsx
- [ ] T121 Test all pages at 320px, 375px, and 414px widths and fix any overflow issues
- [ ] T122 Final code cleanup and unused import removal

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 6 (Phase 3)**: Depends on Foundational - Auth is needed for all other stories
- **User Story 2 (Phase 4)**: Depends on US6 (needs authenticated user)
- **User Story 1 (Phase 5)**: Depends on US6 (needs admin auth) and US2 (uses balance display)
- **User Story 3 (Phase 6)**: Depends on US2 (needs balance display and transaction list)
- **User Story 4 (Phase 7)**: Depends on US2 (needs balance display)
- **User Story 5 (Phase 8)**: Depends on US4 (reward catalog exists to manage)
- **User Story 7 (Phase 9)**: Depends on US1 (needs transaction data to report)
- **Mobile UI (Phase 10)**: Can start after Foundational (Phase 2) - independent of user stories
- **Polish (Phase 11)**: Depends on all desired user stories and Mobile UI being complete

### User Story Dependencies

```text
                    ┌──────────────────┐
                    │  Foundational    │
                    │    (Phase 2)     │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  US6: Auth (P1)  │
                    │    (Phase 3)     │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼─────┐  ┌─────▼──────┐  ┌───▼────────┐
     │ US2: Balance │  │ US1: Award │  │   US4:     │
     │    (P1)      │  │    (P1)    │  │  Redeem    │
     │  (Phase 4)   │  │  (Phase 5) │  │   (P2)     │
     └──────┬───────┘  └────────────┘  │ (Phase 7)  │
            │                          └─────┬──────┘
     ┌──────▼───────┐                        │
     │ US3: Transfer│               ┌────────▼─────────┐
     │    (P2)      │               │ US5: Manage      │
     │  (Phase 6)   │               │ Rewards (P3)     │
     └──────────────┘               │   (Phase 8)      │
                                    └──────────────────┘

     US7: Stats (P3, Phase 9) - Can start after US1 completes

     Mobile UI (Phase 10) - Can run in parallel with user story phases
```

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- T012, T013, T014 (Supabase clients) can run in parallel
- T016, T017, T018 (UI components) can run in parallel
- Within each user story phase, tasks marked [P] can run in parallel
- With multiple developers, US2, US1, and US4 can be worked on in parallel after US6 completes

---

## Parallel Example: Foundational Phase

```bash
# Launch Supabase clients in parallel:
Task: "Create Supabase browser client in src/lib/supabase/client.ts"
Task: "Create Supabase server client in src/lib/supabase/server.ts"
Task: "Create Supabase admin client in src/lib/supabase/admin.ts"

# Launch UI components in parallel:
Task: "Create Button component in src/components/ui/button.tsx"
Task: "Create Card component in src/components/ui/card.tsx"
Task: "Create Input component in src/components/ui/input.tsx"
```

## Parallel Example: User Story 1

```bash
# Launch in parallel after admin layout is ready:
Task: "Create notification bell component in src/components/features/notification-bell.tsx"
Task: "Create notifications dropdown in src/components/features/notifications-dropdown.tsx"
```

## Parallel Example: Mobile UI (Phase 10)

```bash
# Launch NAV tasks in parallel:
Task: "Make admin sub-navigation horizontally scrollable on mobile in src/app/dashboard/admin/layout.tsx"
Task: "Add active state highlighting to mobile bottom navigation in src/app/dashboard/layout.tsx"

# Launch LIST tasks in parallel:
Task: "Add responsive transaction-item.tsx with collapsed details on mobile"
Task: "Make admin-reward-list.tsx responsive with card layout on mobile"

# Launch FORM tasks in parallel:
Task: "Add proper input types in src/components/forms/transfer-form.tsx"
Task: "Make user-search.tsx dropdown full-width on mobile"
Task: "Update award-coins-form.tsx select to be mobile-friendly"

# Launch MODAL tasks in parallel:
Task: "Convert reward-detail-modal.tsx to full-screen sheet on mobile"
Task: "Make notifications-dropdown.tsx full-width on mobile"

# Launch CARD tasks in parallel:
Task: "Adjust balance-card.tsx button layout to stack vertically on mobile"
Task: "Make reward-card.tsx text truncate properly on narrow screens"
Task: "Update stats-card.tsx for smaller screens"
```

---

## Implementation Strategy

### MVP First (User Stories 6 + 2 + 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 6 (Authentication)
4. Complete Phase 4: User Story 2 (Balance & History)
5. Complete Phase 5: User Story 1 (Award Coins)
6. **STOP and VALIDATE**: Test core flow: register → login → view balance → admin awards coins → student sees notification
7. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

1. **MVP (Phases 1-5)**: Auth + Balance + Admin Awards = Core reward system
2. **Add US3 (Phase 6)**: Peer transfers = Social engagement
3. **Add US4 (Phase 7)**: Redemptions = Tangible value for coins
4. **Add US5 (Phase 8)**: Reward management = Admin self-service
5. **Add US7 (Phase 9)**: Statistics = Club oversight
6. **Polish (Phase 10)**: Production readiness

### Parallel Team Strategy

With multiple developers after Phase 2:
- Developer A: User Story 6 → User Story 2 → User Story 3
- Developer B: (wait for US6) → User Story 1 → User Story 7
- Developer C: (wait for US6) → User Story 4 → User Story 5

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are relative to project root
- Supabase migrations should be applied in order (0001, 0002, etc.)
