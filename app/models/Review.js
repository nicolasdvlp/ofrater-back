const db = require('../database');
const CoreModel = require('./CoreModel');

class Review extends CoreModel {

    _rate;
    _description;

    constructor(obj) {
        super(obj);
        this._rate = obj.rate;
        this._description = obj._description;
    }

    // ******
    // GETTER
    // ******
    get rate() {
        return this.rate;
    }

    get _description() {
        return this._description;
    }

    // ******
    // SETTER
    // ******
    set rate(value) {
        this._rate = value;
    }

    set description(value) {
        this._description = value;
    }
}

module.exports = Review;