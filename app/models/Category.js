const sequelize = require('../../config/database');
const { DataTypes, Model } = require('sequelize');

class Category extends Model { }

Category.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'category'
});

module.exports = Category;