-- Notification trigger for award transactions
CREATE OR REPLACE FUNCTION create_award_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'award' THEN
    INSERT INTO notifications (user_id, type, message, related_transaction_id)
    VALUES (
      NEW.to_user_id,
      'award',
      'You received ' || NEW.amount || ' coins!',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS award_notification_trigger ON transactions;

-- Create trigger for award notifications
CREATE TRIGGER award_notification_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION create_award_notification();
