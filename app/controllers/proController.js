"use strict";

const { Appointment, Shop } = require('../models/');
const { generateNewAppointmentForALength } = require('../modules/appointmentModule');
const moment = require('moment');
moment().format();

module.exports = {

  async getProfile(request, response) {
    try {
      const { id: shopId } = request.body.id;
      let pro = await Shop.findById(shopId);

      response.json({ data: { ...pro } });

    } catch (error) {
      console.trace(error);
      response.status(404).json({ error });
    }

  },

  async updateProfile(request, response) {
    try {
      const { id: shopId } = request.body.id;
      let pro = await Shop.findById(shopId);

      if (pro) {
        for (const key of Object.keys(request.body)) {
          if (key !== "id")
            pro[key] = request.body[key];
        }
        pro.update();
      };

      response.json({ data: { pro } });

    } catch (error) {
      console.trace(error);
      response.status(404).json(`Could not find shop with id ${shopId};`)
    }
  },

  /**
   * @version 30/05/2021
   * @author Nicolas
   * @param  {object} req
   * @param  {string} req.body
   * @param  {number} req.body.id
   * @param  {string} req.body.dateStart
   * @param  {string=} req.body.dateEnd
   * @param {{monday: string, tuesday: string, wednesday: string, thursday: string, friday: string, saturday: string, sunday: string}} req.body.days
   */
  async postAvailableAppointment(req, res) {
    try {
      let newAppointmeentsArray = [],
        appointmentsAlreadyInDbArray = [];
      const { id: shopId, dateStart, dateEnd = dateStart, days } = req.body;

      for (const key of Object.keys(days)) {
        // FIXME: Schema
        if (moment(days[key].amStart, "HH:mm").isAfter(moment(days[key].amEnd, "HH:mm"))
          || moment(days[key].pmStart, "HH:mm").isAfter(moment(days[key].pmEnd, "HH:mm"))
          || moment(days[key].amEnd, "HH:mm").isAfter(moment(days[key].pmStart, "HH:mm")))
          return res.status(400).json({ success: false, message: `${key}.xxEnd must be after ${key}.xxStart OR ${key}.pmStart must be after ${key}.amEnd`, info: 'dateStart/dateEnd' });
      }

      [newAppointmeentsArray, appointmentsAlreadyInDbArray] = await generateNewAppointmentForALength(dateStart, dateEnd, days, shopId)

      res.json({
        number_insertion: newAppointmeentsArray.length,
        inserted_slot: newAppointmeentsArray,
        number_already_in_DB: appointmentsAlreadyInDbArray.length,
        already_in_DB: appointmentsAlreadyInDbArray
      });

    } catch (error) {
      console.trace(error);
      res.status(500).json({ error });
    }
  },

  async getAppointmentsPro(request, response) {
    try {

      let { id: shopId, dateStart, dateEnd = dateStart } = request.body
      let appointments = [];

      appointments = await Appointment.getAppointmentShop(dateStart, dateEnd, shopId);

      response.json({
        message: 'Appointments correctly requested',
        number_appointment: appointments.length,
        data: appointments
      });

    } catch (error) {
      console.trace(error);
      response.status(500).json({ error });
    }
  },

  // Method to confirm that a client attended an appointment
  async confirmAttendance(request, response) {
    try {

      const { id: appointmentId } = request.body;

      let appointment = await Appointment.findById(appointmentId);

      if (!appointment.user_id)
        return response.status(400).json({ error: { message: 'Appointment not found.' } });

      if (appointment.user_id === null)
        return response.status(400).json({ error: { message: 'Attendance registration impossible. This appointment is not booked by any client.' } });

      appointment.is_attended = true;
      await appointment.update();

      response.json({
        message: 'Attendance confirmation successfully registered.',
        data: appointment
      });

    } catch (error) {
      console.trace(error);
      response.status(500).json({ error });
    }
  }
}