const db = require('../database');
const CoreModel = require('./CoreModel');

class Review extends CoreModel {

    rate;
    description;

    constructor(obj) {
        super(obj);
        this.rate = obj.rate;
        this.description = obj._description;
    }

    // ******
    // GETTER
    // ******
    get rate() {
        return this.rate;
    }

    get _description() {
        return this.description;
    }

    // ******
    // SETTER
    // ******
    set rate(value) {
        this.rate = value;
    }

    set description(value) {
        this.description = value;
    }
}

module.exports = Review;