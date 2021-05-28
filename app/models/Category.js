const db = require('../../config/database');
const CoreModel = require('./CoreModel');

class Category extends CoreModel {

  name;

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
}

module.exports = Category;