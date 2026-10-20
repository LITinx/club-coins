-- decrement_reward_quantity() referenced rewards.quantity_remaining, which does not exist,
-- so every redemption insert failed. Stock lives in rewards.inventory (NULL = unlimited).
-- The row lock taken by UPDATE also stops two people from redeeming the last item.
CREATE OR REPLACE FUNCTION decrement_reward_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'redemption' AND NEW.reward_id IS NOT NULL THEN
    UPDATE rewards
    SET inventory = inventory - 1, updated_at = now()
    WHERE id = NEW.reward_id AND inventory > 0;

    -- Nothing updated: fine for unlimited stock, an error when sold out
    IF NOT FOUND AND EXISTS (
      SELECT 1 FROM rewards WHERE id = NEW.reward_id AND inventory IS NOT NULL
    ) THEN
      RAISE EXCEPTION 'Reward out of stock';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The redeem and award routes stored English descriptions that show up in history
UPDATE transactions SET description = NULL
WHERE type = 'redemption' AND description LIKE 'Redeemed: %';

UPDATE transactions SET description = NULL
WHERE type = 'award' AND description = 'Awarded by admin';

-- Admins mark a redemption as handed out; NULL = still waiting
ALTER TABLE transactions ADD COLUMN fulfilled_at TIMESTAMPTZ;
