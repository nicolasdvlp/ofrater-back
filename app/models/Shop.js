const sequelize = require('../../config/database');
const { DataTypes, Model } = require('sequelize');

class Shop extends Model { }

Shop.init({

  shop_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  opening_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postal_code: {
    type: DataTypes.STRING, //TODO regex
    allowNull: false,
  },
  avatar_shop: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  geo: {
    type: DataTypes.GEOGRAPHY,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'shop'
});

module.exports = Shop;



// static async findNearest(lon48, lat2) {

//   let coordJoin = 'POINT(' + lon48 + ' ' + lat2 + ')';

//   const result = await db.query(
//     `SELECT 
//               shop.*, 
//               ST_X(shop.geo::geometry), 
//               ST_Y(shop.geo::geometry), 
//               ST_Distance(shop.geo, ST_GeographyFromText($1)) AS distance 
//               FROM shop ORDER BY distance ASC
//               LIMIT 12;`,
//     [coordJoin]);

//   return result.rows;
// }