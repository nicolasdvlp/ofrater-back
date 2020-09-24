class coreModel {

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
}

module.exports = coreModel;