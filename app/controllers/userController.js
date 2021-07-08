"use strict";

const bcrypt = require('bcrypt');
const { Appointment, User, Shop } = require('../models');
const config = require('./../../config')

module.exports = {
  async getUserProfile(request, response) {
    try {
      const { id: userId } = request.body
      let client, upcomingAppointment, historyAppointment;

      [client, upcomingAppointment, historyAppointment,] = Promise.all([
        User.findById(userId),
        Appointment.getUpcomingUserAppointment(userId),
        Appointment.getHistoryUserAppointments(userId),
      ])

      response.json({ ...client, upcomingAppointment, historyAppointment });

    } catch (error) {
      console.trace(error);
      response.status(404).json(error);
    }
  },

  async updateUserProfile(request, response) {
    try {
      const { id: userId } = request.body
      let client = await User.findById(userId);

      for (const key of Object.keys(request.body)) {
        if (key !== "id" && key !== "password") {
          client[key] = request.body[key];
        };
        if (key === "password") {
          const hash = bcrypt.hashSync(request.body[key], config.bcrypt.saltRounds);
          client.password = hash;
        }
      }

      await client.update();

      response.json({
        message: 'Profile Updated.',
        data: client
      });

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        information: `The profile User is NOT updated.`
      });

    }
  },

  async modifyAnAppointment(request, response) {

    const { newAppointmentID, oldAappointmentID, userID, serviceID } = request.body;
    let newRdv, oldRdv, _oldRDV;

    try {

      // new appointment reservation
      newRdv = await Appointment.findById(newAppointmentID);
      newRdv.user_id = userID;
      newRdv.service_id = serviceID;
      await newRdv.update();

      // old appointment back to null values
      oldRdv = await Appointment.findById(oldAappointmentID);
      _oldRDV = { ...oldRdv }
      oldRdv.user_id = null;
      oldRdv.service_id = null;
      await oldRdv.update();

      response.json({
        message: 'Appointment modified.',
        data: {
          new_appointment: newRdv,
          old_appointment: _oldRDV,
        }
      });

    } catch (error) {
      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        information: `The appointment is NOT modified.`
      });
    }
  },

  async bookAnAppointement(request, response) {

    try {
      let { id: appointmentId, user_id, service_id } = request.body;

      let appointment = await Appointment.findById(appointmentId);

      for (const key of Object.keys(request.body)) {
        if (key !== "id" || /*FIXME: Temporary mod for front*/ key !== "service_id") {
          appointment[key] = request.body[key];
        }
      }

      await appointment.update();

      response.json({
        message: 'Appointment correctly booked',
        data: appointment
      });

    } catch (error) {

      console.trace(error);

      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        information: `The appointment ${request.body.id} is not booked.`
      });
    }
  },

  async cancelAppointment(request, response) {
    try {
      let { id: appointmentId } = request.body;

      let appointment = await Appointment.findById(appointmentId);

      if (!appointment) return response.json({
        success: false,
        message: `No Appointment found with id ${appointmentId}`,
        data: {}
      });

      appointment.user_id = null;
      appointment.service_id = null;
      await appointment.update();

      response.json({
        message: 'Appointment correctly cancelled',
        data: appointment
      });

    } catch (error) {
      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        information: `The appointment ${request.body.id} couldn't have been cancelled.`
      });
    }
  }
}