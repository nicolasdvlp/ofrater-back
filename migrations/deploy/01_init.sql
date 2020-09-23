-- Deploy ofrater:01_init to pg

BEGIN;

-- XXX Add DDLs here.

COMMIT;


-- SERVICE ( id, price, duration, name )
-- SHOP ( id, shop_name, opening_time, avatar_shop, isActive, address_name, address_number, city, postal_code)
-- ROLE ( id, name )
-- CATEGORY ( id, name )
-- USER ( id, first_name, last_name, age, mail, password, avatar, #role_id )
-- APPOINTMENT ( id, slot_start, slot_end, isAttended, price, #shop_id, #user_id, #service_id )
--  
-- REVIEW ( id, rate, description, #user_id, #shop_id )
-- SHOP_HAS_SERVICE ( id, #shop_id, #service_id ) 
-- USER_OWNS_SHOP( id, #shop_id, #user_id )
-- SHOP_HAS_CATEGORY(id, #shop_id, #category_id)
