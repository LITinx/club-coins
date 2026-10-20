-- Students could write to these tables directly with the public anon key: mint coins with a
-- self-addressed 'award', set their own balance or role, or create fake users and notifications.
-- Every write goes through API routes with the service role (bypasses RLS) or through
-- SECURITY DEFINER triggers, so none of these client-facing write rules are needed.

-- Any user could insert any transaction, e.g. an award to themselves
DROP POLICY IF EXISTS "Authenticated users can create transactions" ON transactions;

-- Had no role restriction. Profiles are created by the SECURITY DEFINER signup trigger.
DROP POLICY IF EXISTS "Service role can insert users" ON users;

-- Anyone could notify anyone. Notifications are created by SECURITY DEFINER triggers.
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- "Users can update own profile" allowed every column, including balance and role.
-- Keep the policy, but only display_name may change.
REVOKE UPDATE ON users FROM anon, authenticated;
GRANT UPDATE (display_name) ON users TO authenticated;
