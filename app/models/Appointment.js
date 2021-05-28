const db = require('../database');
const CoreModel = require('./CoreModel');

class Appointment extends CoreModel {

  slot_start;
  slot_end;
  is_attended;
  shop_id;
  user_id;
  service_id;

  constructor(obj) {

    super(obj);
    this.slot_start = obj.slot_start;
    this.slot_end = obj.slot_end;
    this.is_attended = obj.is_attended;
    this.shop_id = obj.shop_id;
    this.user_id = obj.user_id;
    this.service_id = obj.service_id;

  }

  /**
   * GETTER
   */

  get slot_start() {
    return this.slot_start;
  }

  get slot_end() {
    return this.slot_end;
  }

  get is_attended() {
    return this.is_attended;
  }

  get shop_id() {
    return this.shop_id;
  }

  get user_id() {
    return this.user_id;
  }

  get service_id() {
    return this.service_id;
  }

  /**
   * SETTER
   */

  set slot_start(value) {
    this.slot_start = value;
  };

  set slot_end(value) {
    this.slot_end = value;
  };

  set is_attended(value) {
    this.is_attended = value;
  };

  set shop_id(value) {
    this.shop_id = value;
  };

  set user_id(value) {
    this.user_id = value;
  };

  set service_id(value) {
    this.service_id = value;
  };

  // route pro pour afficher les rendez vous du professionnel (pour l'agenda) TODO: Ajouter les infos des user ayant pris RDV
  static async getAppointmentShop(dateStart, dateEnd = dateStart, shopId) {

    const query = {
      text: `SELECT ${this.name.toLowerCase()}.*, "user".first_name, "user".last_name, "user".phone_number, "user".mail, "user".avatar FROM ${this.name.toLowerCase()} FULL JOIN "user" ON appointment.user_id = "user".id WHERE DATE(slot_start) BETWEEN $1 AND $2 and shop_id = $3 ORDER BY slot_start ASC ;`,
      values: [dateStart, dateEnd, shopId],
    };

    const result = await db.query(query);

    return result.rows;

  }

  // route /client/ to display available appointments for a given professional
  static async getAppointmentsClient(dateStart, dateEnd = dateStart, shopId) {

    const query = {
      text: `select * from ${this.name.toLowerCase()} where DATE(slot_start) BETWEEN $1 AND $2 and shop_id = $3 and appointment.user_id IS NULL ORDER BY slot_start ASC;`,
      values: [dateStart, dateEnd, shopId]
    }
    const result = await db.query(query);

    const appointmentsArray = [];
    for (const appointment of result.rows) {
      appointmentsArray.push(new this(appointment));
    }

    return appointmentsArray;
  }

  static async getUpcomingUserAppointment(userID) {

    const query = {
      text: `
            SELECT appointment.*, shop.shop_name, shop.opening_time, shop.avatar_shop, shop.is_active, shop.address_name, shop.address_number, shop.city, shop.postal_code, service.price, service.duration, service.name FROM appointment FULL JOIN shop ON appointment.shop_id = shop.id FULL JOIN service ON appointment.service_id = service.id WHERE user_id = $1 AND appointment.slot_start > now() ORDER BY appointment.slot_start DESC ;`,
      values: [userID],
    };

    const result = await db.query(query);

    return result.rows;

  }

  static async getHistoryUserAppointments(userID) {

    const query = {
      text: `SELECT appointment.*, shop.shop_name, shop.opening_time, shop.avatar_shop, shop.is_active, shop.address_name, shop.address_number, shop.city, shop.postal_code, service.price, service.duration, service.name FROM appointment FULL JOIN shop ON appointment.shop_id = shop.id FULL JOIN service ON appointment.service_id = service.id WHERE user_id = $1 AND appointment.slot_start < now() ORDER BY appointment.slot_start DESC ;`,
      values: [userID],
    };

    const result = await db.query(query);

    return result.rows;

  }

  static async getAllHistoryUserAppointments(userID) {

    const query = {
      text: `SELECT appointment.*, shop.shop_name, shop.opening_time, shop.avatar_shop, shop.is_active, shop.address_name, shop.address_number, shop.city, shop.postal_code, service.price, service.duration, service.name FROM appointment FULL JOIN shop ON appointment.shop_id = shop.id FULL JOIN service ON appointment.service_id = service.id WHERE user_id = $1 ORDER BY appointment.slot_start DESC ;`,
      values: [userID],
    };

    const result = await db.query(query);

    return result.rows;

  }

  static async alreadyHaveAppointmentInDatabase(dateAndTime, shopId) {

    const query = {
      text: `SELECT * FROM appointment WHERE slot_start = $1 AND shop_id = $2 ;`,
      values: [dateAndTime, shopId],
    };

    const result = await db.query(query);

    return result.rows[0];

  }

}

module.exports = Appointment;