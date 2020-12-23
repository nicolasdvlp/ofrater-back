const db = require('../database');
const CoreModel = require('./CoreModel');

module.exports = class User extends CoreModel {
   
    first_name;
    last_name;
    phone_number;
    birth;
    mail;
    password;
    avatar;
    role_id;
    is_validated;
    account_validation_crypto;

    constructor(obj) {
        
        super(obj);
        this.first_name = obj.first_name;
        this.last_name = obj.last_name;
        this.phone_number = obj.phone_number;
        this.birth = obj.birth;
        this.mail = obj.mail;
        this.password = obj.password;
        this.avatar = obj.avatar;
        this.role_id = obj.role_id;
        this.is_validated = obj.is_validated;
        this.account_validation_crypto = obj.account_validation_crypto;

    };


    /**
     * GETTER
     */

    get first_name() {
        return this.first_name;
    }
    
    get last_name() {
        return this.last_name;
    }
    
    get phone_number() {
        return this.phone_number;
    }
    
    get birth() {
        return this.birth;
    }
    
    get mail() {
        return this.mail;
    }
    
    get password() {
        return this.password;
    }
    
    get avatar() {
        return this.avatar;
    }
    
    get role_id() {
        return this.role_id;
    }

    get is_validated() {
        return this.is_validated;
    }

    get account_validation_crypto() {
        return this.account_validation_crypto;
    }
    
    /**
     * SETTER
     */

    set first_name(value) {
        this.first_name = value;
    };

    set last_name(value) {
        this.last_name = value;
    };

    set phone_number(value) {
        this.phone_number = value;
    };

    set birth(value) {
        this.birth = value;
    };

    set mail(value) {
        this.mail = value;
    };

    set password(value) {
        this.password = value;
    };

    set avatar(value) {
        this.avatar = value;
    };

    set role_id(value) {
        this.role_id = value;
    };

    set is_validated(value) {
        this.is_validated = value;
    };

    set account_validation_crypto(value) {
        this.account_validation_crypto = value;
    };

    static async findAllPro() {
        const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}" WHERE role_id = $1;`, [1]);

        const proList = [];
        for (const professional of result.rows) {
            proList.push(new this(professional));
        }

        return proList;
    };

    static async findByMail(mail) {

        const result = await db.query(`select * from "${this.name.toLowerCase()}" where mail=$1;`, [mail]);

        return result.rows[0];
    };

    static async findByAccountValidationCrypto(account_validation_crypto) {

        const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}" where account_validation_crypto = $1;`, [account_validation_crypto]);
        return new this(result.rows[0]);
    }

    async ownShop(shopInstance) {

        const query = {
            text: `INSERT INTO "user_owns_shop" (user_id, shop_id) VALUES ($1, $2) RETURNING "id"`,
                values: [this.id, shopInstance.id],
            };

        const result = await db.query(query); 

        return result.rowCount;

    };
}