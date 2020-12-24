const db = require('../database');
const CoreModel = require('./CoreModel');

class Service extends CoreModel {

    name;
    price;
    duration;

    constructor(obj) {
        super(obj);
        this._name = obj.name;
        this.price = obj.price;
        this.duration = obj.duration;
    }

    // ******
    // GETTER
    // ******
    get name() {
        return this.name;
    }

    get price() {
        return this.price;
    }

    get duration() {
        return this.duration;
    }

    // ******
    // SETTER
    // ******
    set name(value) {
        this._name = value;
    }

    set price(value) {
        this._price = value;
    }

    set duration(value) {
        this._duration = value
    }

    static async getShopServices(shopId) {

        const query = {
            text: `SELECT service.* FROM service JOIN shop_has_service ON shop_has_service.service_id = service.id  WHERE shop_has_service.shop_id = $1;`,
            values: [shopId],
        };

        const result = await db.query(query);

        return result.rows;
    }
}

module.exports = Service;