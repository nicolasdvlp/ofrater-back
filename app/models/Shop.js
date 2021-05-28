const db = require('../../config/database');
const CoreModel = require('./CoreModel');

class Shop extends CoreModel {

  shop_name;
  opening_time;
  address_name;
  address_number;
  city;
  postal_code;
  avatar_shop;
  geo;

  constructor(obj) {
    super(obj);
    this.shop_name = obj.shop_name;
    this.opening_time = obj.opening_time;
    this.address_name = obj.address_name;
    this.address_number = obj.address_number;
    this.city = obj.city;
    this.postal_code = obj.postal_code;
    this.avatar_shop = obj.avatar_shop;
    this.geo = obj.geo;
  }

  // *******
  // GETTERS
  // *******
  get shop_name() { return this.shop_name; }

  get opening_time() { return this.opening_time; }

  get address_name() { return this.address_name; }

  get address_number() { return this.address_number; }

  get city() { return this.city; }

  get postal_code() { return this.postal_code; }

  get avatar_shop() { return this.avatar_shop; }

  get geo() { return this.geo; }

  // *******
  // SETTERS
  // *******
  set shop_name(value) { this.shop_name = value; }

  set opening_time(value) { this.opening_time = value; }

  set address_name(value) { this.address_name = value; }

  set address_number(value) { this.address_number = value; }

  set city(value) { this.city = value; }

  set postal_code(value) { this.postal_code = value; }

  set avatar_shop(value) { this.avatar_shop = value; }

  set geo(value) { this.geo = value; }

  // Méthode pour la page d'accueil qui retourne uniquement les CP et les villes pour la recherche "prédictive"
  static async findCityOrZip(cityOrZip) {

    const result = await db.query(`SELECT city, postal_code FROM shop WHERE LOWER(city) LIKE LOWER($1) OR postal_code LIKE $2;`, [`%${cityOrZip}%`, `%${cityOrZip}%`]);

    if (result.rowCount === 0) {
      throw new Error(`No match found with City or Zip code  "${cityOrZip}".`);
    }

    const shopList = [];
    for (const shop of result.rows) {
      shopList.push(new this(shop));
    }

    return shopList;
  }

  static async findNearest(lon48, lat2) {

    let coordJoin = 'POINT(' + lon48 + ' ' + lat2 + ')';

    const result = await db.query(
      `SELECT 
                shop.*, 
                ST_X(shop.geo::geometry), 
                ST_Y(shop.geo::geometry), 
                ST_Distance(shop.geo, ST_GeographyFromText($1)) AS distance 
                FROM shop ORDER BY distance ASC
                LIMIT 12;`,
      [coordJoin]);

    return result.rows;
  }

  static async ownedByUser(UserID) {

    const result = await db.query(
      `select shop.* from shop JOIN "user_owns_shop" ON user_owns_shop.shop_id = shop.id JOIN "user" ON "user_owns_shop".user_id = "user".id where user_owns_shop.user_id = $1 ;`,
      [UserID]);

    return result.rows;
  }

  static async findShopByCity(city) {

    let _values = [];

    let indD = 2;
    let indM = 1 + city.length
    let indF = 2 + city.length

    let str1 = '';
    let str2 = '';

    city.forEach(element => {
      _values.push(element.cp);
    });
    city.forEach(element => {
      _values.push(element.city);
    });

    for (let index = 1; index < city.length; index++) {
      str1 += ` OR postal_code = $${indD}`
      str2 += ` OR LOWER(city) LIKE LOWER($${indF})`
      indD += 1;
      indF += 1;
    }

    const values = _values.map(key => `%${key}%`);

    const result = await db.query(`SELECT DISTINCT * FROM shop WHERE postal_code = $1${str1} OR LOWER(city) LIKE LOWER($${indM})${str2};`, values);

    const shopList = [];
    for (const shop of result.rows) {
      shopList.push(new this(shop));
    }

    return shopList;
  }
}

module.exports = Shop;