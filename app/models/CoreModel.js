const db = require('../database');

class CoreModel {

    _id

    constructor(obj) {
        this._id = obj.id;
    }

    // ******
    // GETTER
    // ******
    get id() {
        return this._id;
    }

    // ******
    // SETTER
    // ******
    set id(value) {
        this._id = value;
    }

    static async findAll() {

        const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}"`);

        const list = [];
        for (const data of result.rows) {
            list.push(new this(data));
        }

        return list;

    }



}

module.exports = CoreModel;