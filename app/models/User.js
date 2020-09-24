const db = require('../database');
const CoreModel = require('./CoreModel');

module.exports = class User extends CoreModel {
   
    _first_name;
    _last_name;
    _phone_number;
    _age;
    _mail;
    _password;
    _avatar;
    _role_id;

    constructor(obj) {
        
        super(obj);
        this._first_name = obj.first_name;
        this._last_name = obj.last_name;
        this._phone_number = obj.phone_number;
        this._age = obj.age;
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
    
    get age() {
        return this._age;
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

    set age(value) {
        this._age = value;
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

    /**
     * 
     */
    static async findAllPro() {
        const result = await db.query(`SELECT * FROM "user" WHERE role_id = $1;`, [1]);

        const proList = [];
        for (const professional of result.rows) {
            proList.push(new this(professional));
        }

        return proList;
    };

}