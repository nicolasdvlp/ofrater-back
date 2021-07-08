const sequelize = require('../../config/database');
const { DataTypes, Model } = require('sequelize');

class Service extends Model { }

Service.init({

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,//TODO contrainte ? positive
    allowNull: false,
    defaultValue: 'ro'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'service'
})

module.exports = Service;

//   static async getShopServices(shopId) {

//   const query = {
//     text: `SELECT service.* FROM service JOIN shop_has_service ON shop_has_service.service_id = service.id  WHERE shop_has_service.shop_id = $1;`,
//     values: [shopId],
//   };

//   const result = await db.query(query);

//   return result.rows;
// }
// }