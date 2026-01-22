# Data Model: Student Club Coin Rewards System

**Date**: 2026-01-21
**Branch**: `001-student-coin-rewards`

## Entity Relationship Diagram

```text
┌─────────────────────┐       ┌─────────────────────────┐
│       users         │       │      transactions       │
├─────────────────────┤       ├─────────────────────────┤
│ id (PK, UUID)       │──┐    │ id (PK, UUID)           │
│ email (unique)      │  │    │ type (enum)             │
│ display_name        │  │    │ amount (int)            │
│ role (enum)         │  ├───<│ from_user_id (FK)       │
│ balance (int)       │  ├───<│ to_user_id (FK)         │
│ status (enum)       │  │    │ reward_id (FK, nullable)│
│ created_at          │  │    │ description             │
│ updated_at          │  │    │ created_at              │
└─────────────────────┘  │    └─────────────────────────┘
                         │
┌─────────────────────┐  │    ┌─────────────────────────┐
│       rewards       │  │    │     notifications       │
├─────────────────────┤  │    ├─────────────────────────┤
│ id (PK, UUID)       │──│───>│ id (PK, UUID)           │
│ name                │  └───<│ user_id (FK)            │
│ description         │       │ type (enum)             │
│ cost (int)          │       │ title                   │
│ quantity (int)      │       │ message                 │
│ quantity_remaining  │       │ read (boolean)          │
│ image_url (nullable)│       │ data (jsonb)            │
│ is_active (boolean) │       │ created_at              │
│ created_at          │       └─────────────────────────┘
│ updated_at          │
└─────────────────────┘
```

## Entities

### 1. Users

Extends Supabase Auth users with application-specific data.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, FK to auth.users | Links to Supabase Auth |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| display_name | VARCHAR(100) | NOT NULL | Display name shown in app |
| role | ENUM | NOT NULL, DEFAULT 'student' | 'student' or 'admin' |
| balance | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 | Current coin balance |
| status | ENUM | NOT NULL, DEFAULT 'active' | 'active' or 'inactive' |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Account creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last profile update |

**Indexes**:
- `idx_users_email` on `email`
- `idx_users_role` on `role`
- `idx_users_status` on `status`

**Business Rules**:
- Balance cannot go negative (enforced by CHECK constraint)
- Only admins can change user roles
- Inactive users cannot log in or transact

### 2. Transactions

Immutable audit log of all coin movements.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique transaction ID |
| type | ENUM | NOT NULL | 'award', 'transfer', 'redemption' |
| amount | INTEGER | NOT NULL, CHECK > 0 | Positive coin amount |
| from_user_id | UUID | FK to users, nullable | Source user (null for awards) |
| to_user_id | UUID | FK to users, NOT NULL | Recipient user |
| reward_id | UUID | FK to rewards, nullable | Only for redemptions |
| description | VARCHAR(500) | nullable | Reason/note for transaction |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Transaction timestamp |

**Indexes**:
- `idx_transactions_from_user` on `from_user_id`
- `idx_transactions_to_user` on `to_user_id`
- `idx_transactions_type` on `type`
- `idx_transactions_created_at` on `created_at DESC`

**Business Rules**:
- Transactions are immutable (no UPDATE/DELETE)
- Awards: from_user_id is NULL, to_user_id receives coins
- Transfers: from_user_id sends to to_user_id
- Redemptions: from_user_id spends (to_user_id = from_user_id), reward_id required

### 3. Rewards

Catalog of items students can redeem.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique reward ID |
| name | VARCHAR(200) | NOT NULL | Reward name |
| description | TEXT | nullable | Detailed description |
| cost | INTEGER | NOT NULL, CHECK > 0 | Cost in coins |
| quantity | INTEGER | NOT NULL, CHECK >= 0 | Initial stock count |
| quantity_remaining | INTEGER | NOT NULL, CHECK >= 0 | Current available stock |
| image_url | VARCHAR(500) | nullable | Optional image URL |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Whether visible to students |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update time |

**Indexes**:
- `idx_rewards_is_active` on `is_active`
- `idx_rewards_cost` on `cost`

**Business Rules**:
- quantity_remaining cannot exceed quantity
- Inactive rewards don't appear in catalog but historical redemptions remain
- Only admins can create/edit rewards

### 4. Notifications

In-app notifications for users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique notification ID |
| user_id | UUID | FK to users, NOT NULL | Recipient user |
| type | ENUM | NOT NULL | 'award', 'transfer_received', 'transfer_sent', 'redemption' |
| title | VARCHAR(200) | NOT NULL | Short notification title |
| message | TEXT | NOT NULL | Notification body |
| read | BOOLEAN | NOT NULL, DEFAULT false | Read status |
| data | JSONB | nullable | Additional structured data |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Notification time |

**Indexes**:
- `idx_notifications_user_read` on `(user_id, read)`
- `idx_notifications_user_created` on `(user_id, created_at DESC)`

**Business Rules**:
- Notifications created automatically via triggers/functions
- Users can only see/modify their own notifications

## Enums

```sql
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE transaction_type AS ENUM ('award', 'transfer', 'redemption');
CREATE TYPE notification_type AS ENUM ('award', 'transfer_received', 'transfer_sent', 'redemption');
```

## Database Functions & Triggers

### Balance Update Trigger

Automatically updates user balance when transactions are inserted.

```sql
-- Trigger function to update balances
CREATE OR REPLACE FUNCTION update_balances_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Deduct from sender (if exists)
  IF NEW.from_user_id IS NOT NULL THEN
    UPDATE users
    SET balance = balance - NEW.amount, updated_at = now()
    WHERE id = NEW.from_user_id;
  END IF;

  -- Add to recipient (for non-redemption transactions)
  IF NEW.type != 'redemption' THEN
    UPDATE users
    SET balance = balance + NEW.amount, updated_at = now()
    WHERE id = NEW.to_user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Reward Quantity Trigger

Decrements reward quantity on redemption.

```sql
CREATE OR REPLACE FUNCTION decrement_reward_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'redemption' AND NEW.reward_id IS NOT NULL THEN
    UPDATE rewards
    SET quantity_remaining = quantity_remaining - 1, updated_at = now()
    WHERE id = NEW.reward_id AND quantity_remaining > 0;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Reward not available';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Notification Trigger

Creates notifications on transactions.

```sql
CREATE OR REPLACE FUNCTION create_transaction_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification based on transaction type
  -- Implementation details in migration files
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security Policies

### Users Table

```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON users FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users can update their own display_name
CREATE POLICY "Users can update own name"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### Transactions Table

```sql
-- Users can read their own transactions
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  USING (
    from_user_id = auth.uid() OR to_user_id = auth.uid()
  );

-- Admins can read all transactions
CREATE POLICY "Admins can read all transactions"
  ON transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Insert via authenticated functions only
CREATE POLICY "Insert via service role"
  ON transactions FOR INSERT
  WITH CHECK (true); -- Controlled by function security
```

### Rewards Table

```sql
-- Everyone can read active rewards
CREATE POLICY "Read active rewards"
  ON rewards FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Only admins can modify rewards
CREATE POLICY "Admins manage rewards"
  ON rewards FOR ALL
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));
```

### Notifications Table

```sql
-- Users can only access their own notifications
CREATE POLICY "Users own notifications"
  ON notifications FOR ALL
  USING (user_id = auth.uid());
```

## State Transitions

### User Status

```text
[active] ──(deactivate by admin)──> [inactive]
[inactive] ──(reactivate by admin)──> [active]
```

### Reward Lifecycle

```text
[created, is_active=true] ──(deactivate)──> [is_active=false]
[is_active=false] ──(reactivate)──> [is_active=true]
[quantity_remaining > 0] ──(redemption)──> [quantity_remaining - 1]
[quantity_remaining = 0] ──> [Out of Stock, still visible if active]
```

## Validation Rules

| Entity | Field | Validation |
|--------|-------|------------|
| User | email | Valid email format |
| User | display_name | 1-100 characters |
| User | balance | >= 0 |
| Transaction | amount | > 0, <= sender's balance (for transfers) |
| Reward | name | 1-200 characters |
| Reward | cost | > 0 |
| Reward | quantity | >= 0 |
