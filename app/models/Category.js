const db = require('../database');
const CoreModel = require('./CoreModel');

class Category extends CoreModel {

    _name;

    constructor(obj) {
        super(obj);
        this._name = obj.name;
    }

    // ******
    // GETTER
    // ******
    get name() {
        return this._name;
    }

    // ******
    // SETTER
    // ******
    set name(value) {
        this._name = value;
    }
}

module.exports = Category;