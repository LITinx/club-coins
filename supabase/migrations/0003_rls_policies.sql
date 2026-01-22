-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- All authenticated users can read all user profiles
-- (needed for transfers, member lists, etc.)
CREATE POLICY "Authenticated users can read profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own display_name
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can insert users (for the trigger)
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- =============================================
-- TRANSACTIONS TABLE POLICIES
-- =============================================

-- Users can read their own transactions (sent or received)
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  USING (
    from_user_id = auth.uid() OR to_user_id = auth.uid()
  );

-- Admins can read all transactions
CREATE POLICY "Admins can read all transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can create transactions (with app-level validation)
CREATE POLICY "Authenticated users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- REWARDS TABLE POLICIES
-- =============================================

-- Everyone can read active rewards
CREATE POLICY "Everyone can read active rewards"
  ON rewards FOR SELECT
  USING (is_active = true);

-- Admins can read all rewards (including inactive)
CREATE POLICY "Admins can read all rewards"
  ON rewards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can create rewards
CREATE POLICY "Admins can create rewards"
  ON rewards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update rewards
CREATE POLICY "Admins can update rewards"
  ON rewards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- NOTIFICATIONS TABLE POLICIES
-- =============================================

-- Users can only read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- System can create notifications (via triggers or service role)
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());
