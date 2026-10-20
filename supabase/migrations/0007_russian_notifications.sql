-- Russian notification messages (replaces the English text from 0004-0006).
-- "Монет: N" wording avoids Russian plural forms (1 монета / 2 монеты / 5 монет).

CREATE OR REPLACE FUNCTION create_award_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'award' THEN
    INSERT INTO notifications (user_id, type, message, related_transaction_id)
    VALUES (
      NEW.to_user_id,
      'award',
      'Вам начислено монет: ' || NEW.amount,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_transfer_notification()
RETURNS TRIGGER AS $$
DECLARE
  sender_name TEXT;
BEGIN
  IF NEW.type = 'transfer' THEN
    SELECT display_name INTO sender_name
    FROM users
    WHERE id = NEW.from_user_id;

    INSERT INTO notifications (user_id, type, message, related_transaction_id)
    VALUES (
      NEW.to_user_id,
      'transfer_received',
      'Получено монет: ' || NEW.amount || ' от ' || COALESCE(sender_name, 'неизвестного отправителя'),
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_redemption_notification()
RETURNS TRIGGER AS $$
DECLARE
  reward_name TEXT;
BEGIN
  IF NEW.type = 'redemption' THEN
    SELECT name INTO reward_name
    FROM rewards
    WHERE id = NEW.reward_id;

    INSERT INTO notifications (user_id, type, message, related_transaction_id)
    VALUES (
      NEW.from_user_id,
      'redemption',
      'Вы обменяли «' || COALESCE(reward_name, 'награду') || '». Списано монет: ' || NEW.amount,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Translate notifications that were already stored in English
UPDATE notifications
SET message = regexp_replace(message, '^You received (\d+) coins!$', 'Вам начислено монет: \1')
WHERE message ~ '^You received \d+ coins!$';

UPDATE notifications
SET message = regexp_replace(message, '^You received (\d+) coins from (.*)$', 'Получено монет: \1 от \2')
WHERE message ~ '^You received \d+ coins from ';

UPDATE notifications
SET message = regexp_replace(message, '^You redeemed: (.*) for (\d+) coins$', 'Вы обменяли «\1». Списано монет: \2')
WHERE message ~ '^You redeemed: .* for \d+ coins$';
