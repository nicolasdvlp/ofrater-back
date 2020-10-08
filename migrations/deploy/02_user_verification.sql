-- Deploy ofrater:02_user_verification to pg

BEGIN;

ALTER TABLE "user"
ADD COLUMN is_verified boolean DEFAULT false,
ADD COLUMN crypto text;

COMMIT;
