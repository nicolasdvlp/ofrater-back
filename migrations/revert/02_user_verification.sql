-- Revert ofrater:02_user_verification from pg

BEGIN;

ALTER TABLE "user"
DROP COLUMN account_validation_crypto,
DROP COLUMN is_validated;

COMMIT;
