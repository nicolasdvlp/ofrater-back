const db = require('../database');
const CoreModel = require('./CoreModel');

class Service extends CoreModel {

    name;
    price;
    duration;

    constructor(obj) {
        super(obj);
        this._name = obj.name;
        this._price = obj.price;
        this._duration = obj.duration;
    }

    // ******
    // GETTER
    // ******
    get name() {
        return this._name;
    }

    get price() {
        return this._price;
    }

    get duration() {
        return this._duration;
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