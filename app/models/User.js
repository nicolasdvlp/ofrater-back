const sequelize = require('../../config/database');
const { DataTypes, Model } = require('sequelize');

class User extends Model { }

User.init({

  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING, //TODO
    allowNull: false,
  },
  birth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  mail: {
    type: DataTypes.STRING, //TODO
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.TEXT, //TODO
    allowNull: true,
  },
  // role_id: {
  //   type: DataTypes.,
  //   allowNull: false,
  //   defaultValue: 'yo'
  // },
  is_validated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  account_validation_crypto: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'user'
})

module.exports = User

  // static async findAllPro() {
  //   const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}" WHERE role_id = $1;`, [1]);

  //   const proList = [];
  //   for (const professional of result.rows) {
  //     proList.push(new this(professional));
  //   }

  //   return proList;
  // };

  // static async findByMail(mail) {

  //   const result = await db.query(`select * from "${this.name.toLowerCase()}" where mail=$1;`, [mail]);

  //   return result.rows[0];
  // };

  // static async findByAccountValidationCrypto(account_validation_crypto) {

  //   const result = await db.query(`SELECT * FROM "${this.name.toLowerCase()}" where account_validation_crypto = $1;`, [account_validation_crypto]);
  //   return new this(result.rows[0]);
  // }

  // async ownShop(shopInstance) {

  //   const query = {
  //     text: `INSERT INTO "user_owns_shop" (user_id, shop_id) VALUES ($1, $2) RETURNING "id"`,
  //     values: [this.id, shopInstance.id],
  //   };

  //   const result = await db.query(query);

  //   return result.rowCount;

  // };