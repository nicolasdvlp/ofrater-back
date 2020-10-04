const db = require('../database');
const CoreModel = require('./CoreModel');

class Appointment extends CoreModel {

    _slot_start;
    _slot_end;
    _is_attended;
    _shop_id;
    _user_id;
    _service_id;

    constructor(obj) {
        
        super(obj);
        this._slot_start = obj.slot_start;
        this._slot_end = obj.slot_end;
        this._is_attended = obj.is_attended===undefined?false:obj.is_attended;
        this._shop_id = obj.shop_id;
        this._user_id = obj.user_id;
        this._service_id = obj.service_id;

    }

    /**
     * GETTER
     */

    get slot_start() {
        return this._slot_start;
    }
    
    get slot_end() {
        return this._slot_end;
    }
    
    get is_attended() {
        return this._is_attended;
    }
    
    get shop_id() {
        return this._shop_id;
    }
    
    get user_id() {
        return this._user_id;
    }
    
    get service_id() {
        return this._service_id;
    }

    /**
     * SETTER
     */

    set slot_start(value) {
        this._slot_start = value;
    };

    set slot_end(value) {
        this._slot_end = value;
    };

    set is_attended(value) {
        this._is_attended = value;
    };

    set shop_id(value) {
        this._shop_id = value;
    };

    set user_id(value) {
        this._user_id = value;
    };

    set service_id(value) {
        this._service_id = value;
    };    

    static async getAppointmentShop(dateStart, dateEnd=dateStart, shopId) {

        const query = {
            text: `select * from appointment where DATE(slot_start) BETWEEN $1 AND $2 and shop_id = $3 ORDER BY slot_start ASC ;`,
                values: [dateStart, dateEnd, shopId],
            };

        const result = await db.query(query); 

        return result.rows;

    }

}

module.exports = Appointment;