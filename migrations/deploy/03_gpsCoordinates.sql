-- Deploy ofrater:gpsCoordinates to pg

BEGIN;

ALTER TABLE "shop"
    ADD COLUMN latitude NUMERIC(7),
    ADD COLUMN longitude NUMERIC(7);

COMMIT;
