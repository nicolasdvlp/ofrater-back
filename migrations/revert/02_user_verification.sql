-- Revert ofrater:02_user_verification from pg

BEGIN;

ALTER TABLE "user"
DROP COLUMN crypto,
DROP COLUMN is_verified;

COMMIT;
