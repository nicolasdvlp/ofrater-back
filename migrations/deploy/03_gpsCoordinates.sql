-- Deploy ofrater:gpsCoordinates to pg

BEGIN;

ALTER TABLE "appointment"
    ADD COLUMN latitude INT ;
    ADD COLUMN longitude INT ;


COMMIT;
