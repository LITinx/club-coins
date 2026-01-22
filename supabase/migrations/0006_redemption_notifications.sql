-- Notification trigger for redemption transactions
CREATE OR REPLACE FUNCTION create_redemption_notification()
RETURNS TRIGGER AS $$
DECLARE
  reward_name TEXT;
BEGIN
  IF NEW.type = 'redemption' THEN
    -- Get reward name
    SELECT name INTO reward_name
    FROM rewards
    WHERE id = NEW.reward_id;

    -- Notify user of successful redemption
    INSERT INTO notifications (user_id, type, message, related_transaction_id)
    VALUES (
      NEW.from_user_id,
      'redemption',
      'You redeemed: ' || COALESCE(reward_name, 'Reward') || ' for ' || NEW.amount || ' coins',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS redemption_notification_trigger ON transactions;

-- Create trigger for redemption notifications
CREATE TRIGGER redemption_notification_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION create_redemption_notification();
