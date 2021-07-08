-- Deploy ofrater:gpsCoordinates to pg

BEGIN;

CREATE EXTENSION postgis;

ALTER TABLE "shop"
    ADD COLUMN geo GEOGRAPHY(Point);

COMMIT;
