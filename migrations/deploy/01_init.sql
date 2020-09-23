-- Deploy ofrater:01_init to pg

BEGIN;

-- ****************
--      DOMAINS
-- ****************
CREATE DOMAIN postal_code_fr AS text
    CHECK(
        VALUE ~ '^0[1-9]\d{3}$' -- codes postaux commençant par 0
        OR VALUE ~ '^[1-8]\d{4}$' -- codes postaux ne commençant pas par 9
        OR VALUE ~ '^9[0-6]\d{3}$' -- codes postaux commençant par 9 en métropole
        OR VALUE ~ '^9[78][12478]\d{2}$' -- codes postaux des DOM-TOM
    );

CREATE DOMAIN email_address AS text
    CHECK (
        VALUE ~ '^[^@\s]+@([^@\s]+\.)+[^@\s]+$'
    );

CREATE DOMAIN pfloat AS float
CHECK (VALUE > 0);

CREATE DOMAIN star_eval AS text
CHECK (VALUE ~ '^[1-5]{1}$');

-- ****************
--      TABLES
-- ****************
CREATE TABLE "service" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    price pfloat NOT NULL,
    duration int NOT NULL,
    "name" text NOT NULL
);

CREATE TABLE "shop" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shop_name text NOT NULL,
    opening_time text NOT NULL,
    avatar_shop text, 
    isActive boolean NOT NULL, 
    address_name text NOT NULL,
    address_number int NOT NULL, 
    city text NOT NULL,
    postal_code postal_code_fr NOT NULL
);

CREATE TABLE "role" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL
);

CREATE TABLE "category" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL
);


CREATE TABLE "user" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    age int NOT NULL,
    mail email_address NOT NULL,
    "password" text NOT NULL,
    avatar text,
    role_id int NOT NULL REFERENCES role(id)  
);

CREATE TABLE "appointment" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slot_start TIMESTAMPTZ NOT NULL,
    slot_end TIMESTAMPTZ NOT NULL,
    isAttended boolean,
    price float,
    shop_id int REFERENCES shop(id),
    user_id int REFERENCES "user"(id),
    service_id int REFERENCES "service"(id)
);

CREATE TABLE "review" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    rate star_eval NOT NULL,
    "description" text,
    user_id int REFERENCES "user"(id),
    shop_id int REFERENCES shop(id)
);

CREATE TABLE "shop_has_service" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shop_id int REFERENCES shop(id),
    service_id int REFERENCES "service"(id)
);

CREATE TABLE "user_owns_shop" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shop_id int REFERENCES shop(id),
    user_id int REFERENCES "user"(id)
);

CREATE TABLE "shop_has_category" (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    shop_id int REFERENCES shop(id),
    category_id int REFERENCES category(id)
);

COMMIT;

-- avatar
-- id
-- url
-- "type" text DEFAULT "custom"
--     -oshopavatar
--     -custom



-- |1|"/avatar/ofrat1.jpg"|"oshopavatar"| --barbichette
-- |2|"/avatar/pro/ofrat2.jpg"|"oshopavatar"| --cheveux
-- |3|"/avatar/pro/ofrat3.jpg"|"oshopavatar"| -- barbe
-- |4|"/photo/pro/shop1.jpg"|"custom"|
-- |5|"/photo/pro/shop2.jpg"|"custom"|
-- |6|"/photo/pro/shop3.jpg"|"custom"|
-- |7|"photo/pro/shop4.jpg"|"custom"|
-- |8|"/avatar/pro/ofrat2.jpg"|"oshopavatar"| --cheveux