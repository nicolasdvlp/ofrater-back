'use strict';

const bcrypt = require('bcrypt');
const { Promise } = require('node-fetch');
const { Appointment, User, Shop } = require('../models');
const config = require('./../../config');

module.exports = {
  async getUserProfile(request, response) {
    try {
      const { id: userId } = request.body;
      let client, upcomingAppointment, historyAppointment;

      [client, upcomingAppointment, historyAppointment,] = Promise.all([
        User.findById(userId),
        Appointment.getUpcomingUserAppointment(userId),
        Appointment.getHistoryUserAppointments(userId),
      ]);

      response.json({ ...client, upcomingAppointment, historyAppointment });

    } catch (error) {
      console.trace(error);
      response.status(404).json(error);
    }
  },

  async updateUserProfile(request, response) {
    const { id: userId } = request.body;

    try {
      let client = await User.findById(userId);

      for (const key of Object.keys(request.body)) {
        if (key !== 'id' && key !== 'password') {
          client[key] = request.body[key];
        }
        if (key === 'password') {
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
    const { newAppointmentID, oldAappointmentID, userId: user_id, serviceId: service_id } = request.body;
    let newRdv, oldRdv, _oldRdv;

    try {
      [newRdv, oldRdv] = Promise.all([
        Appointment.findById(newAppointmentID),
        Appointment.findById(oldAappointmentID),
      ]);

      // new appointment reservation
      newRdv = { ...newRdv, user_id, service_id };
      // old appointment back to null values
      _oldRdv = { ...oldRdv }; // copy
      oldRdv = { ...oldRdv, user_id: null, service_id: null };

      Promise.all([
        newRdv.update(),
        oldRdv.update(),
      ]);

      response.json({ new_appointment: newRdv, old_appointment: _oldRdv, });
    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
    }
  },

  async bookAnAppointement(request, response) {
    let { id: appointmentId, user_id, service_id } = request.body;

    try {
      let appointment = await Appointment.findById(appointmentId);

      for (const key of Object.keys(request.body)) {
        if (key !== 'id' || /*FIXME: Temporary mod for front*/ key !== 'service_id') {
          appointment[key] = request.body[key];
        }
      }

      await appointment.update();

      response.json(appointment);
    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
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

      appointment = { ...appointment, user_id: null, service_id: null };
      await appointment.update();

      response.json(appointment);
    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
    }
  }
};