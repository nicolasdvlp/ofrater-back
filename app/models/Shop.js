const db = require('../database');
const CoreModel = require('./CoreModel');

class Shop extends CoreModel {

    _shop_name;
    _opening_time;
    _address_name;
    _address_number;
    _city;
    _postal_code;
    _avatar_shop;
    _latitude
    _longitude

    constructor(obj) {
        super(obj);
        this._shop_name = obj.shop_name;
        this._opening_time = obj.opening_time;
        this._address_name = obj.address_name;
        this._address_number = obj.address_number;
        this._city = obj.city;
        this._postal_code = obj.postal_code;
        this._avatar_shop = obj.avatar_shop;
        this._latitude = obj.latitude;
        this._longitude = obj.longitude;
    

    }

    // *******
    // GETTERS
    // *******
    get shop_name() {
        return this._shop_name;
    }

    get opening_time() {
        return this._opening_time;
    }

    get address_name() {
        return this._address_name;
    }

    get address_number() {
        return this._address_number;
    }

    get city() {
        return this._city;
    }

    get postal_code() {
        return this._postal_code;
    }

    get avatar_shop() {
        return this._avatar_shop;
    }

    get latitude() {
        return this._latitude;
    }

    get longitude() {
        return this._longitude;
    }

    // *******
    // SETTERS
    // *******
    set shop_name(value) {
        this._shop_name = value;
    }

    set opening_time(value) {
        this._opening_time = value;
    }

    set address_name(value) {
        this._address_name = value;
    }

    set address_number(value) {
        this._address_number = value;
    }

    set city(value) {
        this._city = value;
    }

    set postal_code(value) {
        this._postal_code = value;
    }

    set avatar_shop(value) {
        this._avatar_shop = value;
    }

    set latitude(value) {
        this._latitude = value;
    }

    set longitude(value) {
        this._longitude = value;
    }

    // Méthode pour la page d'accueil qui retourne uniquement les CP et les villes pour la recherche "prédictive"
    static async findCityOrZip(cityOrZip) {

        const result = await db.query(`SELECT city, postal_code FROM shop WHERE LOWER(city) LIKE LOWER($1) OR postal_code LIKE $2;`, [`%${cityOrZip}%`, `%${cityOrZip}%`]);

        if (result.rowCount===0) {
            throw new Error(`No match found with City or Zip code  "${cityOrZip}".`);
        }

        const shopList = [];
        for (const shop of result.rows) {
            shopList.push(new this(shop));
        }

        return shopList;
    }

    static async findShopByCity(cityOrZip) {

        const result = await db.query(`SELECT * FROM shop WHERE LOWER(city) LIKE LOWER($1) OR postal_code LIKE $2;`, [`%${cityOrZip}%`, `%${cityOrZip}%`]);

        if (result.rowCount===0) {
            throw new Error(`No match found with City or Zip code  "${cityOrZip}".`);
        }

        const shopList = [];
        for (const shop of result.rows) {
            shopList.push(new this(shop));
        }

        return shopList;
    }
}

module.exports = Shop;