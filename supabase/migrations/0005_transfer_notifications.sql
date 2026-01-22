-- Notification trigger for transfer transactions
CREATE OR REPLACE FUNCTION create_transfer_notification()
RETURNS TRIGGER AS $$
DECLARE
  sender_name TEXT;
BEGIN
  IF NEW.type = 'transfer' THEN
    -- Get sender's display name
    SELECT display_name INTO sender_name
    FROM users
    WHERE id = NEW.from_user_id;

    -- Notify recipient
    INSERT INTO notifications (user_id, type, message, related_transaction_id)
    VALUES (
      NEW.to_user_id,
      'transfer_received',
      'You received ' || NEW.amount || ' coins from ' || COALESCE(sender_name, 'Unknown'),
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS transfer_notification_trigger ON transactions;

-- Create trigger for transfer notifications
CREATE TRIGGER transfer_notification_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION create_transfer_notification();
