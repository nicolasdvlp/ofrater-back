const coreModel = require('./coreModel');

class Role extends coreModel {

    _name

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

module.exports = Role;