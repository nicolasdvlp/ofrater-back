const sequelize = require('../../config/database');
const { DataTypes, Model } = require('sequelize');

class Appointment extends Model { }

Appointment.init({
  slot_start: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  slot_end: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  is_attended: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  // shop_id: {
  //   type: DataTypes.NUMBER,
  //   allowNull: false,
  // },
  // user_id: {
  //   type: DataTypes.NUMBER,
  //   allowNull: false,
  // },
  // service_id: {
  //   type: DataTypes.NUMBER,
  //   allowNull: false,
  // },
}, {
  sequelize,
  tableName: 'appointment'
});

module.exports = Appointment;

//   // route pro pour afficher les rendez vous du professionnel (pour l'agenda) TODO: Ajouter les infos des user ayant pris RDV
//   static async getAppointmentShop(dateStart, dateEnd = dateStart, shopId) {

//   const query = {
//     text: `SELECT ${this.name.toLowerCase()}.*, "user".first_name, "user".last_name, "user".phone_number, "user".mail, "user".avatar FROM ${this.name.toLowerCase()} FULL JOIN "user" ON appointment.user_id = "user".id WHERE DATE(slot_start) BETWEEN $1 AND $2 and shop_id = $3 ORDER BY slot_start ASC ;`,
//     values: [dateStart, dateEnd, shopId],
//   };

//   const result = await db.query(query);

//   return result.rows;

// }

//   // route /client/ to display available appointments for a given professional
//   static async getAppointmentsClient(dateStart, dateEnd = dateStart, shopId) {

//   const query = {
//     text: `select * from ${this.name.toLowerCase()} where DATE(slot_start) BETWEEN $1 AND $2 and shop_id = $3 and appointment.user_id IS NULL ORDER BY slot_start ASC;`,
//     values: [dateStart, dateEnd, shopId]
//   }
//   const result = await db.query(query);

//   const appointmentsArray = [];
//   for (const appointment of result.rows) {
//     appointmentsArray.push(new this(appointment));
//   }

//   return appointmentsArray;
// }

//   static async getUpcomingUserAppointment(userID) {

//   const query = {
//     text: `
//             SELECT appointment.*, shop.shop_name, shop.opening_time, shop.avatar_shop, shop.is_active, shop.address_name, shop.address_number, shop.city, shop.postal_code, service.price, service.duration, service.name FROM appointment FULL JOIN shop ON appointment.shop_id = shop.id FULL JOIN service ON appointment.service_id = service.id WHERE user_id = $1 AND appointment.slot_start > now() ORDER BY appointment.slot_start DESC ;`,
//     values: [userID],
//   };

//   const result = await db.query(query);

//   return result.rows;

// }

//   static async getHistoryUserAppointments(userID) {

//   const query = {
//     text: `SELECT appointment.*, shop.shop_name, shop.opening_time, shop.avatar_shop, shop.is_active, shop.address_name, shop.address_number, shop.city, shop.postal_code, service.price, service.duration, service.name FROM appointment FULL JOIN shop ON appointment.shop_id = shop.id FULL JOIN service ON appointment.service_id = service.id WHERE user_id = $1 AND appointment.slot_start < now() ORDER BY appointment.slot_start DESC ;`,
//     values: [userID],
//   };

//   const result = await db.query(query);

//   return result.rows;

// }

//   static async getAllHistoryUserAppointments(userID) {

//   const query = {
//     text: `SELECT appointment.*, shop.shop_name, shop.opening_time, shop.avatar_shop, shop.is_active, shop.address_name, shop.address_number, shop.city, shop.postal_code, service.price, service.duration, service.name FROM appointment FULL JOIN shop ON appointment.shop_id = shop.id FULL JOIN service ON appointment.service_id = service.id WHERE user_id = $1 ORDER BY appointment.slot_start DESC ;`,
//     values: [userID],
//   };

//   const result = await db.query(query);

//   return result.rows;

// }

//   static async alreadyHaveAppointmentInDatabase(dateAndTime, shopId) {

//   const query = {
//     text: `SELECT * FROM appointment WHERE slot_start = $1 AND shop_id = $2 ;`,
//     values: [dateAndTime, shopId],
//   };

//   const result = await db.query(query);

//   return result.rows[0];

// }

// }