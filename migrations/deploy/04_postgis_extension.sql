-- Deploy ofrater:04_postgis_extension to pg

BEGIN;

CREATE EXTENSION postgis;

COMMIT;
