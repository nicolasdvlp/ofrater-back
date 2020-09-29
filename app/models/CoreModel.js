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

        if (result.rowCount===0) {
            throw new Error(`No match found with id "${idToFind}" for table "${this.name.toLowerCase()}".`);
        }

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

            text: `INSERT INTO "${this.constructor.name.toLowerCase()}" (${fields}) VALUES (${placeholders}) RETURNING "id"`,
                values: values,
            };

        const result = await db.query(query); 

        this.id = result.rows[0].id;

    }

    async update() {
    
        const _cleanPlaceholders = [];
        let incPlaceHolders = 1;
        const values = [];
        Object.keys(this).forEach((key) => {
            key = key.replace('_', '');
            if (key === "id") return false;
    
            _cleanPlaceholders.push(`"${key}" = $${incPlaceHolders}`);
            values.push(this[key]);
            incPlaceHolders++;
        });

        values.push(this.id);
        const placeholders = _cleanPlaceholders.join(', ');
    
        const query = {
          text: `
            UPDATE "${this.constructor.name.toLowerCase()}" SET 
            ${placeholders}
            WHERE "id" = $${incPlaceHolders}
          `,
          values: values,
        };
    
        const result = await db.query(query);
        
    }
    
    async delete() {
        // constructor représente la classe elle même auquel on accède depuis l'instance this --> this.constructor
        const query = {
            text: `DELETE FROM "${this.constructor.name.toLowerCase()}" WHERE id=$1`,
            values: [this.id],
        };
        const result = await db.query(query);

    }
    
    // /**
    //  * Insert or Update function to store in DB
    //  * @param {function} 
    //  */
    // async save(){
    
    //     console.log('le this avant traitemen', this);

    //     if(this.id){
    //         this.update();
    //         console.log('le this apres le update', this);
    //       }
    //       else {
    //         this.insert();
    //         console.log('le this apres le insert', this);

    //       }
    // }

}

module.exports = CoreModel;