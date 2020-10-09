-- Revert ofrater:gpsCoordinates from pg

BEGIN;

ALTER TABLE "shop"
    DROP COLUMN latitude,
    DROP COLUMN longitude;

COMMIT;
