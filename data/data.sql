BEGIN;

INSERT INTO "service" (price, duration, "name") VALUES
(15, 30, 'coupe'),
(20, 30, 'rasage'),
(10, 30, 'soin');

INSERT INTO "shop" (shop_name, opening_time, address_name, address_number, city, postal_code, avatar_shop, geo) VALUES
('BarbaBulle', 'du lundi au dimanche 7/7! de 9h à 19h', 'Place du Champ de Foire', 15, 'Arnac-la-Poste', '87160','https://i.pinimg.com/originals/ed/9f/00/ed9f00b1d16c3a8a02630e1c237c7f0a.jpg', 'POINT(46.266163 1.375604)'),
('Barbi Choux', 'lundi	Fermé\nmardi	09:30–19:30\nmercredi	09:30–19:30\njeudi	09:30–19:30\nvendredi	09:30–19:30\nsamedi	09:30–19:30\ndimanche	09:30–14:30', 'Place de lÉglise', 1, 'Mouais', '44590', 'https://le-de.cdn-website.com/1c7a0f4892624c47bcab835e7d0ca47b/dms3rep/multi/opt/5daed470720000fd99d16cc1_os-24517911-640w.png', 'POINT(47.696482 -1.643592)'),
('Séduc Tif', 'lundi	Fermé\nmardi au vendredi 09:30–19:30\nsamedi et dimanche fermé aussi', 'route de Tours', 40, 'Bourré', '41400','https://le-de.cdn-website.com/1c7a0f4892624c47bcab835e7d0ca47b/dms3rep/multi/opt/5daed470720000fd99d16cc1_os-24517911-640w.png','POINT(47.346051 1.222646)'),
('Hug barber shop','du lundi au dimanche 7/7! de 9h à 19h', 'Rue du Rocher', 30, 'Paris','75008', 'https://cdn-elle.ladmedia.fr/var/plain_site/storage/images/beaute/soins/tendances/barbier/barbier-paris-11e/56320187-1-fre-FR/Barbier-Paris-11e.jpg','POINT(48.876918 2.321546)'),
('Captain barber','du lundi au dimanche 7/7! de 9h à 19h', 'Rue de la Verrerie', 38, 'Paris','75004', 'https://idata.over-blog.com/3/69/00/73/Christophe/news/Image-143.png','POINT(48.857842 2.353511)'),
('Panther barber','du lundi au dimanche 7/7! de 9h à 19h', 'Rue du Fer À Moulin', 26, 'Paris','75005', 'https://images-na.ssl-images-amazon.com/images/I/51SFKYzSMdL._AC_.jpg','POINT(48.839147 2.353425)'),
('Wolverine beard','du lundi au dimanche 7/7! de 9h à 19h', 'Place André Malraux', 4, 'Paris','75001', 'https://www.ville-poissy.fr/images/articles/2018/20180213BarberShopInauguration/5L5A7973.jpg','POINT(48.863941 2.335315)'),
('Tout pour les fauves','du lundi au dimanche 7/7! de 9h à 19h', 'Rue Pasquier', 29, 'Paris','75008', 'https://barbersquad.fr/seeett01/wp-content/uploads/2019/04/barber-shop-trappes.jpg','POINT(48.873877 2.323728)'),
('SpiderBarbe ','du lundi au dimanche 7/7! de 9h à 19h', 'Rue Letellier', 9, 'Paris','75015', 'https://phrnleng.rosselcdn.net/sites/default/files/dpistyles_v2/ena_16_9_extra_big/2019/04/24/node_15755/1606721/public/2019/04/24/B9719360857Z.1_20190424151754_000%2BGNSDE4MT0.1-0.jpg?itok=nW0tVn4v1556111880','POINT(48.848750 2.294803)'),
('Je sappelle Groot barber','du lundi au dimanche 7/7! de 9h à 19h', 'Rue de Chaligny', 32, 'Paris','75012', 'https://www.mariannegarabed.fr/wp-content/uploads/2020/05/agencement-decoration-salon-coiffure-barbier-lyon-renovation-travaux-projet-marianne-garabed-01-1.jpg','POINT(48.848045 2.384224)'),
('Iron hair','du lundi au dimanche 7/7! de 9h à 19h', 'Boulevard de Charonne', 129, 'Paris','75011', 'https://imagizr.com/1200_628/cdn.meilleurcoiffeur.com/72/35/2608-shop-orig.JPG?v=1','POINT(48.857138 2.392464)'),
('Hercule Poil Haut','du lundi au dimanche 7/7! de 9h à 19h', 'Rue Frédérick Lemaître', 1, 'Paris','75020', 'https://scontent-cdt1-1.xx.fbcdn.net/v/t31.0-8/21950855_1952737015015495_4285650788657458485_o.jpg?_nc_cat=106&_nc_sid=6e5ad9&_nc_ohc=gpHgW-9tDqkAX_1_ekI&_nc_ht=scontent-cdt1-1.xx&oh=2405bab10c0b8779f37f3cbedf50ff05&oe=5FAC2471','POINT(48.873682 2.391520)'),
('Hulk Rasor','du lundi au dimanche 7/7! de 9h à 19h', 'Rue de Meaux', 93, 'Paris','75019', 'https://www.unboncoiffeur.fr/files/images/coiffeurs/photos/owners/2016/02/56cdaa829cb768.44888702-hgm-barber-shop.jpg','POINT(48.883052 2.376070)'),
('Deadpoil','du lundi au dimanche 7/7! de 9h à 19h', 'Rue du Chevaleret', 61, 'Paris','75013', 'https://www.unboncoiffeur.fr/files/images/coiffeurs/photos/owners/2016/02/56cdaa9a0b53c1.40938728-faade-barber.jpg','POINT(48.828103 2.376328)'),
('Kik Poil','du lundi au dimanche 7/7! de 9h à 19h', 'Rue de Paris', 99, 'Charenton-le-Pont','94220', 'https://www.toute-la-franchise.com/images/zoom/barber_men_sera_au_forum_franchise_lyon.jpg','POINT(48.822662 2.411496)'),
('LeBonPoil','du lundi au dimanche 7/7! de 9h à 19h', 'Avenue Chanzy', 29, 'Vitry-sur-Seine','94400', 'https://lhommeenbleu.fr/wp-content/uploads/2020/05/photo-coiffeurs-victor-barber-shop-source-facebook-mai-2020.jpg','POINT(48.797890 2.401211)'),
('Geek Barbu','du lundi au dimanche 7/7! de 9h à 19h', 'Rue Georges Enesco', 6, 'Créteil','94000', 'https://lhommeenbleu.fr/wp-content/uploads/2020/05/photo-coiffeurs-appartement-lheb-limoges-source-lhommeenbleu-mai-2020.jpeg','POINT(48.796403 2.446824)'),
('Coupe en Or','du lundi au dimanche 7/7! de 9h à 19h', 'Rue Rouget de Lisle', 17, 'Saint-Maur-des-Fossés','94100', 'https://www.mysalondecoiffure.com/img/cms/salon-de-barbier.jpg','POINT(48.800862 2.481519)'),
('Papier Feuille Coupe choux','du lundi au dimanche 7/7! de 9h à 19h', 'Rue Roger Salengro', 23, 'Noisy-le-Grand','93160', 'https://ledil.immo/wp-content/uploads/2019/08/b3636fe66284acb9039ae0034108b011.jpg','POINT(48.845074 2.543974)'),
('ALain-le-Malin','du lundi au dimanche 7/7! de 9h à 19h', 'Avenue des Cocotiers', 69, 'Lyon','42000', 'https://www.parisinfo.com/var/otcp/sites/images/node_43/node_51/node_77884/node_77888/salon-mus%C3%A9e-alain-ma%C3%AEtre-barbier-coiffeur-%7C-630x405-%7C-%C2%A9-dr/10938342-1-fre-FR/Salon-Mus%C3%A9e-Alain-Ma%C3%AEtre-Barbier-Coiffeur-%7C-630x405-%7C-%C2%A9-DR.jpg', 'POINT(45.756185 4.853101)');

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