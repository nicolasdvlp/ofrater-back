-- Revert ofrater:01_init from pg

BEGIN;

DROP TABLE shop_has_category;
DROP TABLE user_owns_shop;
DROP TABLE shop_has_service;
DROP TABLE review;
DROP TABLE appointment;
DROP TABLE "user";
DROP TABLE category;
DROP TABLE "role";
DROP TABLE shop;
DROP TABLE "service";
DROP DOMAIN star_eval;
DROP DOMAIN pfloat;
DROP DOMAIN phone;
DROP DOMAIN email_address;
DROP DOMAIN postal_code_fr;

COMMIT;
