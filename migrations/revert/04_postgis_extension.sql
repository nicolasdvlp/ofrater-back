-- Revert ofrater:04_postgis_extension from pg

BEGIN;

DROP EXTENSION postgis;

COMMIT;
