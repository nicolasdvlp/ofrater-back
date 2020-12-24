const db = require('../database');
const CoreModel = require('./CoreModel');

class Role extends CoreModel {

    name

    constructor(obj) {
        super(obj);
        this.name = obj.name;
    }

    // ******
    // GETTER
    // ******
    get name() {
        return this.name;
    }

    // ******
    // SETTER
    // ******
    set name(value) {
        this.name = value;
    }

    static async findShopCategories(shopId) {

        const result = await db.query(`SELECT category.id, category.name FROM category JOIN shop_has_category ON shop_has_category.category_id = category.id WHERE shop_has_category.shop_id = $1;`, [shopId]);

        if (result.rowCount === 0) {
            throw new Error(`No match found for Categories'shop with shop is  "${shopId}".`);
        }

        const categoriesList = [];
        for (const categ of result.rows) {
            categoriesList.push(new this(categ));
        }

        return categoriesList;
    }
}

module.exports = Role;