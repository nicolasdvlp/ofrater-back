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

    static async findById(idToFind) {
        const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}" WHERE id = $1;`, [idToFind]);

        return new this(result.rows[0]);
    }

    async insert() {


        const _cleanFields = [];
        const _cleanPlaceholders = [];
        const values = [];
        let placeHolderInc = 1;
    
        Object.keys(this).forEach((key) => {
            key = key.replace('_', '');

            if (key === "id") return false;
        
            _cleanFields.push(`"${key}"`);
            _cleanPlaceholders.push(`$${placeHolderInc}`);
            values.push(this[key]);
            placeHolderInc++;
                
        });

        const fields = _cleanFields.join(', ');
        const placeholders = _cleanPlaceholders.join(', ');

        const query = {
            text: `
                INSERT INTO "${this.constructor.name.toLowerCase()}"
                (${fields}) 
                VALUES (${placeholders}) 
                RETURNING "id"
                `,
                values: values,
            };


        const result = await db.query(query); 
        console.log(result);
        this.data = result.rows[0];

    }


}

module.exports = CoreModel;