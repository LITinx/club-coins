-- Volunteers can award coins to students (via the award API route) and are left out of the rating.
-- Their database access is the same as a student's: every admin RLS policy checks role = 'admin'.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'volunteer';
