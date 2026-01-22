-- Trigger function to update balances when a transaction is inserted
CREATE OR REPLACE FUNCTION update_balances_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Deduct from sender (if exists - null for awards)
  IF NEW.from_user_id IS NOT NULL THEN
    UPDATE users
    SET balance = balance - NEW.amount, updated_at = now()
    WHERE id = NEW.from_user_id;

    -- Verify balance didn't go negative (shouldn't happen due to app-level checks)
    IF (SELECT balance FROM users WHERE id = NEW.from_user_id) < 0 THEN
      RAISE EXCEPTION 'Insufficient balance for transaction';
    END IF;
  END IF;

  -- Add to recipient (for award and transfer, not for redemption where user spends)
  IF NEW.type IN ('award', 'transfer') THEN
    UPDATE users
    SET balance = balance + NEW.amount, updated_at = now()
    WHERE id = NEW.to_user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for balance updates
CREATE TRIGGER trigger_update_balances
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_balances_on_transaction();

-- Trigger function to decrement reward quantity on redemption
CREATE OR REPLACE FUNCTION decrement_reward_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'redemption' AND NEW.reward_id IS NOT NULL THEN
    UPDATE rewards
    SET quantity_remaining = quantity_remaining - 1, updated_at = now()
    WHERE id = NEW.reward_id AND quantity_remaining > 0;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Reward not available or out of stock';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reward quantity decrement
CREATE TRIGGER trigger_decrement_reward
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION decrement_reward_quantity();

-- Function to create user profile after auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
