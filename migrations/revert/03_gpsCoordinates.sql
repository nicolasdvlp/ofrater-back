-- Revert ofrater:gpsCoordinates from pg

BEGIN;

ALTER TABLE "shop"
    DROP COLUMN geo;

DROP EXTENSION postgis;


COMMIT;
