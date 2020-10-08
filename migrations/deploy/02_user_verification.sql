-- Deploy ofrater:02_user_verification to pg

BEGIN;

ALTER TABLE "user"
ADD COLUMN is_validated boolean DEFAULT false,
ADD COLUMN account_validation_crypto text;

COMMIT;
