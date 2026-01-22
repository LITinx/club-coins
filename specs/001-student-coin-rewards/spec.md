# Feature Specification: Student Club Coin Rewards System

**Feature Branch**: `001-student-coin-rewards`
**Created**: 2026-01-21
**Status**: Draft
**Input**: User description: "Create a web app for phones, the idea is to share between each other some coin, so this application is kinda virtual bank and the goal of application is giving as a reward coins in student club which they can use after to buy stuff and etc"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Receives Coins as Reward (Priority: P1)

A student club administrator awards virtual coins to a student member for participation in club activities, achievements, or contributions. The student receives a notification and sees their updated balance.

**Why this priority**: This is the core value proposition - without the ability to award coins, the entire system has no purpose. This enables the fundamental reward mechanism.

**Independent Test**: Can be fully tested by having an admin award coins to a student and verifying the student's balance increases and they receive notification.

**Acceptance Scenarios**:

1. **Given** a student member with 0 coins, **When** an admin awards them 50 coins for "Helped organize event", **Then** the student's balance shows 50 coins and they receive a notification with the reason.
2. **Given** a student member with 100 coins, **When** an admin awards them 25 coins, **Then** the student's balance shows 125 coins.
3. **Given** an admin attempting to award coins, **When** they enter a negative amount, **Then** the system rejects the transaction with an error message.

---

### User Story 2 - Student Views Balance and Transaction History (Priority: P1)

A student opens the app to check their current coin balance and view a history of how they earned or spent their coins.

**Why this priority**: Students need visibility into their coins to understand their rewards and plan spending. Essential for user engagement.

**Independent Test**: Can be fully tested by a student logging in and viewing their balance and transaction list.

**Acceptance Scenarios**:

1. **Given** a student with previous transactions, **When** they open the app, **Then** they see their current balance prominently displayed.
2. **Given** a student with transaction history, **When** they view their history, **Then** they see a chronological list showing date, amount, type (earned/spent), and description.
3. **Given** a new student with no transactions, **When** they view their history, **Then** they see an empty state message.

---

### User Story 3 - Student Transfers Coins to Another Student (Priority: P2)

A student sends some of their coins to another student member, enabling peer-to-peer sharing within the club.

**Why this priority**: Peer-to-peer transfers add social engagement and flexibility, but the system functions without this feature.

**Independent Test**: Can be fully tested by one student sending coins to another and both balances updating correctly.

**Acceptance Scenarios**:

1. **Given** a student with 100 coins, **When** they transfer 30 coins to another student, **Then** their balance shows 70 coins and the recipient's balance increases by 30 coins.
2. **Given** a student with 50 coins, **When** they attempt to transfer 75 coins, **Then** the system prevents the transfer with an "insufficient balance" message.
3. **Given** a student transferring coins, **When** the transfer completes, **Then** both parties receive notifications about the transaction.

---

### User Story 4 - Student Redeems Coins for Rewards (Priority: P2)

A student browses available rewards in the club's reward catalog and redeems their coins for items like merchandise, event tickets, or privileges.

**Why this priority**: Redemption gives coins tangible value, but the system can function as a tracking/recognition tool without an active reward catalog.

**Independent Test**: Can be fully tested by a student selecting a reward, confirming redemption, and receiving confirmation while balance decreases.

**Acceptance Scenarios**:

1. **Given** a student with 100 coins and a reward costing 75 coins, **When** they redeem the reward, **Then** their balance shows 25 coins and they receive a confirmation with redemption details.
2. **Given** a student with 50 coins and a reward costing 100 coins, **When** they attempt to redeem, **Then** the system shows they have insufficient coins.
3. **Given** a reward with limited quantity (5 available), **When** the last one is redeemed, **Then** the reward shows as "Out of Stock" for other students.

---

### User Story 5 - Admin Manages Reward Catalog (Priority: P3)

A club administrator creates, updates, and removes rewards from the catalog that students can redeem.

**Why this priority**: Required for redemption to work long-term, but initial setup can use seeded data.

**Independent Test**: Can be fully tested by an admin adding a new reward and verifying it appears in the student-facing catalog.

**Acceptance Scenarios**:

1. **Given** an admin logged in, **When** they create a reward with name, description, cost, and quantity, **Then** the reward appears in the catalog.
2. **Given** an existing reward, **When** an admin updates its coin cost, **Then** students see the updated cost.
3. **Given** a reward that's been redeemed, **When** an admin marks it inactive, **Then** it no longer appears for students but historical redemptions remain visible.

---

### User Story 6 - User Registration and Authentication (Priority: P1)

A new student registers for the app with their credentials and can subsequently log in to access their account.

**Why this priority**: Users must authenticate to have personal accounts and balances. Foundation for all other features.

**Independent Test**: Can be fully tested by registering a new account and successfully logging in.

**Acceptance Scenarios**:

1. **Given** a new student, **When** they register with email and password, **Then** they receive a confirmation and can log in.
2. **Given** a registered student, **When** they enter correct credentials, **Then** they access their dashboard showing their balance.
3. **Given** a user entering wrong credentials, **When** they attempt login, **Then** they see an error message without revealing which credential was wrong.

---

### User Story 7 - Admin Views Club-Wide Statistics (Priority: P3)

A club administrator views overall statistics including total coins in circulation, number of active members, and recent activity.

**Why this priority**: Useful for club management but not essential for core functionality.

**Independent Test**: Can be fully tested by an admin logging in and viewing the statistics dashboard.

**Acceptance Scenarios**:

1. **Given** an admin logged in, **When** they view statistics, **Then** they see total coins distributed, total coins redeemed, and active member count.
2. **Given** club activity over the past week, **When** an admin views recent activity, **Then** they see a summary of awards, transfers, and redemptions.

---

### Edge Cases

- What happens when a user tries to transfer coins to themselves? System should prevent self-transfers with a clear error message.
- How does the system handle concurrent transactions affecting the same balance? System should ensure balance consistency and prevent overdrafts.
- What happens if a user attempts to redeem a reward while another user claims the last one? System should handle race conditions gracefully and inform the user the reward is no longer available.
- What if an admin accidentally awards too many coins? Admins should be able to reverse/adjust transactions within a reasonable timeframe.
- What happens when a student leaves the club? Account is deactivated (frozen) with coins preserved. Can be reactivated if student returns. Transaction history is retained for audit purposes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow students to register accounts with email and password
- **FR-002**: System MUST authenticate users before accessing any account features
- **FR-003**: System MUST display user's current coin balance on their dashboard
- **FR-004**: System MUST maintain a complete transaction history for each user
- **FR-005**: System MUST allow administrators to award coins to students with a reason/description
- **FR-006**: System MUST allow students to transfer coins to other registered students
- **FR-007**: System MUST prevent transactions that would result in negative balances
- **FR-008**: System MUST send notifications for coin receipts (awards and transfers)
- **FR-009**: System MUST allow students to browse available rewards
- **FR-010**: System MUST allow students to redeem coins for available rewards
- **FR-011**: System MUST track reward inventory and prevent over-redemption
- **FR-012**: System MUST allow administrators to manage (create, edit, deactivate) rewards
- **FR-013**: System MUST provide administrators with club-wide statistics
- **FR-014**: System MUST be accessible via mobile web browsers (responsive design)
- **FR-015**: System MUST support role-based access (student vs administrator)
- **FR-016**: System MUST allow administrators to view all members and their balances
- **FR-017**: System MUST log all transactions with timestamps for audit purposes

### Key Entities

- **User**: Represents a club member with profile information, role (student/admin), and coin balance
- **Transaction**: Records any coin movement including type (award, transfer, redemption), amount, parties involved, timestamp, and description
- **Reward**: An item or privilege that students can redeem, with name, description, coin cost, available quantity, and active status
- **Redemption**: Links a user to a reward they've claimed, with status and timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete registration and first login in under 3 minutes
- **SC-002**: Students can view their balance within 2 seconds of opening the app
- **SC-003**: Coin transfer between students completes in under 5 seconds with confirmation
- **SC-004**: System supports at least 500 concurrent users without noticeable slowdown
- **SC-005**: 90% of first-time users can successfully check their balance without assistance
- **SC-006**: 85% of users can successfully complete a peer transfer on their first attempt
- **SC-007**: Administrators can award coins to a student in under 30 seconds
- **SC-008**: All transactions are accurately recorded with no discrepancies in balance calculations
- **SC-009**: System maintains 99.5% uptime during club operating hours
- **SC-010**: Mobile interface is usable on screens as small as 320px wide

## Assumptions

- Single club/organization deployment (not multi-tenant)
- Club has existing member roster that can be used for initial user setup or self-registration
- Internet connectivity required (no offline mode)
- Standard email/password authentication is acceptable (no SSO requirement)
- Rewards are physical items or privileges fulfilled outside the app (no digital delivery)
- Club administrators are trusted users who can award any amount of coins
- Currency is called "coins" (can be renamed in UI without system changes)
