-- Seed data for Student Club Coin Rewards System
-- Run this after migrations to populate initial data

-- Sample rewards for the club
INSERT INTO rewards (name, description, coin_cost, inventory, is_active) VALUES
  ('Coffee Voucher', 'One free coffee at the campus cafe', 50, 100, true),
  ('Club T-Shirt', 'Official club branded t-shirt (sizes S-XL available)', 200, 50, true),
  ('Event Priority Access', 'Skip the line at the next club event', 75, 20, true),
  ('Mentorship Session', '1-hour mentorship session with a senior club member', 150, 10, true),
  ('Study Room Booking', 'Priority booking for club study rooms (1 day)', 25, 200, true),
  ('Movie Night Ticket', 'Free ticket to monthly club movie night', 30, 50, true),
  ('Lunch with President', 'Have lunch with the club president', 500, 5, true),
  ('Workshop Pass', 'Free pass to any club workshop', 100, 30, true),
  ('Sticker Pack', 'Pack of 5 club stickers', 15, NULL, true),
  ('Water Bottle', 'Club branded reusable water bottle', 80, 40, true);

-- Note: Admin users should be created through the app registration
-- and then promoted via direct database update:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@yourclub.com';
