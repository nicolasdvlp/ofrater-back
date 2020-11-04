-- Deploy ofrater:02_user_verification to pg

BEGIN;

ALTER TABLE "user"
ADD COLUMN is_validated boolean,
ADD COLUMN account_validation_crypto text;

ALTER TABLE "user" ALTER COLUMN is_validated SET DEFAULT false;

COMMIT;
