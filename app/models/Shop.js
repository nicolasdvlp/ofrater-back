const coreModel = require('./coreModel');

class Shop extends coreModel {

    _shop_name;
    _opening_time;
    _address_name;
    _address_number;
    _city;
    _postal_code;

    constructor(obj) {
        super(obj);
        this._shop_name = obj.shop_name;
        this._opening_time = obj.opening_time;
        this._address_name = obj.address_name;
        this._address_number = obj.address_number;
        this._city = obj.city;
        this._postal_code = obj.postal_code;
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
}

module.exports = Shop;