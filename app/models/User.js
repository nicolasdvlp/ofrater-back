const db = require('../database');
const CoreModel = require('./CoreModel');

module.exports = class User extends CoreModel {
   
    _first_name;
    _last_name;
    _phone_number;
    _birth;
    _mail;
    _password;
    _avatar;
    _role_id;

    constructor(obj) {
        
        super(obj);
        this._first_name = obj.first_name;
        this._last_name = obj.last_name;
        this._phone_number = obj.phone_number;
        this._birth = obj.birth;
        this._mail = obj.mail;
        this._password = obj.password;
        this._avatar = obj.avatar;
        this._role_id = obj.role_id;

    };


    /**
     * GETTER
     */

    get first_name() {
        return this._first_name;
    }
    
    get last_name() {
        return this._last_name;
    }
    
    get phone_number() {
        return this._phone_number;
    }
    
    get birth() {
        return this._birth;
    }
    
    get mail() {
        return this._mail;
    }
    
    get password() {
        return this._password;
    }
    
    get avatar() {
        return this._avatar;
    }
    
    get role_id() {
        return this._role_id;
    }
    
    /**
     * SETTER
     */

    set first_name(value) {
        this._first_name = value;
    };

    set last_name(value) {
        this._last_name = value;
    };

    set phone_number(value) {
        this._phone_number = value;
    };

    set birth(value) {
        this._birth = value;
    };

    set mail(value) {
        this._mail = value;
    };

    set password(value) {
        this._password = value;
    };

    set avatar(value) {
        this._avatar = value;
    };

    set role_id(value) {
        this._role_id = value;
    };

    static async findAllPro() {
        const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}" WHERE role_id = $1;`, [1]);

        const proList = [];
        for (const professional of result.rows) {
            proList.push(new this(professional));
        }

        return proList;
    };

    static async findProById(proId) {
        const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}" WHERE role_id = $1 AND id = $2;`, [2, proId]);

        return result.rows[0];
    }

    static async findByMail(mail) {

        const result = await db.query(`select * from "${this.name.toLowerCase()}" where mail=$1;`, [mail]);

        if (result.rowCount===0) {
            throw new Error(`No match found with mail "${mail}" for table "${this.name.toLowerCase()}".`);
        }

        return result.rows[0];
    };

    async ownShop(shopInstance) {

        const query = {
            text: `INSERT INTO "user_owns_shop" (user_id, shop_id) VALUES ($1, $2) RETURNING "id"`,
                values: [this.id, shopInstance.id],
            };

        const result = await db.query(query); 

    };
}