BEGIN;

INSERT INTO "service" (price, duration, "name") VALUES
(15, 30, 'coupe'),
(20, 30, 'rasage'),
(10, 30, 'soin');

INSERT INTO "shop" (shop_name, opening_time, address_name, address_number, city, postal_code) VALUES
('BarbaBulle', 'du lundi au dimanche 7/7! de 9h à 19h', 'Place du Champ de Foire', 15, 'Arnac-la-Poste', '87160'),
('Barbi Choux', 'lundi	Fermé\nmardi	09:30–19:30\nmercredi	09:30–19:30\njeudi	09:30–19:30\nvendredi	09:30–19:30\nsamedi	09:30–19:30\ndimanche	09:30–14:30', 'Place de l''Église', 1, 'Mouais', '44590'),
('Séduc'' Tif', 'lundi	Fermé\nmardi au vendredi 09:30–19:30\nsamedi et dimanche fermé aussi', 'route de Tours', 40, 'Bourré', '41400');

INSERT INTO "role" ("name") VALUES
('client'),
('professionnel');

INSERT INTO "category" ("name") VALUES
('barbier'),
('coiffeur');

INSERT INTO "user" (first_name, last_name, phone_number, birth, mail, "password", avatar, role_id) VALUES 
('Lucien', 'Bramard', '0634121212', '1983-08-01', 'lucien.bramard@gmail.com', 'azerty123', 'url_avatar', 1),
('Etienne', 'Mousse', '0624320118', '1980-05-03', 'emousseBG@gmail.com', 'youpi123', 'url_avatar', 1),
('Fox', 'Mulder', '0602000000', '1998-02-15', 'fmulder@gmail.com', '*D9k+fA.77W', 'url_avatar', 1),
('Bob', 'L''éponge', '0798150836', '2001-01-09', 'bleponge@gmail.com', 'coincoin', 'url_avatar', 1),
('Dana', 'Scully', '0675000000', '1970-12-25', 'dscully@gmail.com', '=34Udz*%i2.X', 'url_avatar', 2),
('Joel', 'Noyeux', '0836656565', '1985-11-10', 'joyeuxnoel@gmail.com', 'christmas', 'url_avatar', 2),
('Anne', 'O''nyme', '0675000000', '1965-11-19', 'agathachristie@gmail.com', '=34Udz*%i2.X', 'url_avatar', 2);
    
INSERT INTO "appointment" (slot_start, slot_end, shop_id, user_id, service_id) VALUES
('2020-10-19 08:30:00', '2020-10-19 08:59:59', 1, NULL, NULL),
('2020-10-19 09:00:00', '2020-10-19 09:29:59', 1, NULL, NULL),
('2020-10-19 09:30:00', '2020-10-19 09:59:59', 1, 3, 2),
('2020-10-19 10:00:00', '2020-10-19 10:29:59', 1, NULL, NULL),
('2020-10-19 08:30:00', '2020-10-19 08:59:59', 2, NULL, NULL),
('2020-10-19 09:00:00', '2020-10-19 09:29:59', 2, 2, 3),
('2020-10-19 09:30:00', '2020-10-19 09:59:59', 2, NULL, NULL),
('2020-10-19 08:30:00', '2020-10-19 08:59:59', 3, NULL, NULL),
('2020-10-19 09:00:00', '2020-10-19 09:29:59', 3, NULL, NULL),
('2020-10-19 09:30:00', '2020-10-19 09:59:59', 3, NULL, NULL),
('2020-10-19 10:00:00', '2020-10-19 10:29:59', 3, 1, 1);

INSERT INTO review (rate, "description", user_id, shop_id) VALUES
('1', 'A évité absolument ! Ma coupe et rater! C nulle !', 2, 2),
('4', 'Je recommande, tout s''est très bien passé!', 5, 1),
('5', 'super !', 3, 1);

INSERT INTO shop_has_service (shop_id, service_id) VALUES 
(1, 3),
(1, 2),
(2, 1),
(2, 2),
(3, 2);

INSERT INTO user_owns_shop (shop_id, user_id) VALUES
(1, 7),
(3, 5),
(2, 4);

INSERT INTO shop_has_category (shop_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 2);

COMMIT;