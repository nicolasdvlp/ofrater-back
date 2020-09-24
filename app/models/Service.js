const coreModel = require('./coreModel');

class Service extends coreModel {

    _name;
    _price;
    _duration;

    constructor(obj) {
        super(obj);
        this._name = obj.name;
        this._price = obj.price;
        this._duration = obj.duration;
    }

    // ******
    // GETTER
    // ******
    get name() {
        return this._name;
    }

    get price() {
        return this._price;
    }

    get duration() {
        return this._duration;
    }

    // ******
    // SETTER
    // ******
    set name(value) {
        this._name = value;
    }

    set price(value) {
        this._price = value;
    }

    set duration(value) {
        this._duration = value
    }
}

module.exports = Service;

    