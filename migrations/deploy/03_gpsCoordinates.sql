-- Deploy ofrater:gpsCoordinates to pg

BEGIN;

ALTER TABLE "shop"
    ADD COLUMN latitude decimal,
    ADD COLUMN longitude decimal;

COMMIT;
