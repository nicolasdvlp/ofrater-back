const sequelize = require('../../config/database');
const { DataTypes, Model } = require('sequelize');

class Review extends Model { }

Review.init({
  rate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'review'
});

module.exports = Review;