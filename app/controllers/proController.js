const { Appointment, Shop } = require('../models/');
const { generateNewAppointmentForADay } = require('../modules/appointmentModule');
const moment = require('moment');
moment().format();

module.exports = {

  async getProfile(request, response) {
    try {
      let { id } = request.body;
      let pro;

      pro = await Shop.findById(id);

      response.json({
        message: `Shop founded : ${!!pro}`,
        data: { ...pro }
      });

    } catch (error) {
      console.trace(error);
      response.status(404).json(`No shop found for id ${id}.`);
    }

  },

  async updateProfile(request, response) {
    try {
      let { id } = request.body;
      let pro;

      pro = await Shop.findById(id);

      if (pro) {
        for (const key of Object.keys(request.body)) {
          if (key !== "id")
            pro[key] = request.body[key];
        }
        pro.update();
      };

      response.json({
        message: `Shop updated`,
        data: { pro }
      });

    } catch (error) {

      console.trace(error);
      response.status(404).json(`Could not find shop with id ${request.body.id};`)

    }
  },

  async postAvailableAppointment(req, res) {
    try {
      let startTimestampArray = [],
        alreadyExistInDbArray = [],
        currentDay;
      let { id, dateStart, dateEnd, days } = req.body;

      if (moment(dateStart, "YYYY-MM-DD").isAfter(dateEnd))
        return res.status(400).json({ success: false, message: 'dateEnd must be after dateStart', info: 'dateStart/dateEnd' });

      for (const key of Object.keys(days)) {
        if (moment(days[key].amStart, "HH:mm").isAfter(moment(days[key].amEnd, "HH:mm"))
          || moment(days[key].pmStart, "HH:mm").isAfter(moment(days[key].pmEnd, "HH:mm"))
          || moment(days[key].amEnd, "HH:mm").isAfter(moment(days[key].pmStart, "HH:mm")))
          return res.status(400).json({ success: false, message: `${key}.xxEnd must be after ${key}.xxStart OR ${key}.pmStart must be after ${key}.amEnd`, info: 'dateStart/dateEnd' });
      }

      currentDay = moment(dateStart, "YYYY-MM-DD").format("YYYY-MM-DD")

      // loop to add appointments for each day
      for (let index = 0; moment(currentDay, "YYYY-MM-DD").isSameOrBefore(moment(dateEnd, "YYYY-MM-DD")); index++) {

        let _startTimestampArray = [],
          _alreadyExistInDbArray = [],
          currentWeekDay;

        currentWeekDay = moment(currentDay, "YYYY-MM-DD").format("dddd").toString().toLowerCase();

        if (Object.keys(days).includes(currentWeekDay))
          for (const tm of ["am", "pm"])
            if (!!days[currentWeekDay][`${tm}Start`] && !!days[currentWeekDay][`${tm}End`]) {
              [_alreadyExistInDbArray, _startTimestampArray] = await generateNewAppointmentForADay(
                currentDay,
                days[currentWeekDay][`${tm}Start`],
                days[currentWeekDay][`${tm}End`],
                id
              )
              startTimestampArray.push(..._startTimestampArray);
              alreadyExistInDbArray.push(..._alreadyExistInDbArray);
            };

        currentDay = moment(currentDay, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD");
      }

      res.json({
        message: `Available appointment(s) correctly inserted for id ${id}`,
        number_insertion: startTimestampArray.length,
        inserted_slot: startTimestampArray,
        number_already_in_DB: alreadyExistInDbArray.length,
        already_in_DB: alreadyExistInDbArray
      });

    } catch (error) {

      console.trace(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });
    }

  },

  async getAppointmentsPro(request, response) {
    try {

      let appointments = [];
      let { shopId, dateStart, dateEnd } = request.body
      const _shopId = parseInt(shopId);
      if (_shopId <= 0 || isNaN(_shopId))
        return response.status(400).json({ success: false, message: 'shopId must be a positive number', info: 'shopId' });

      if (!dateEnd) dateEnd = dateStart;

      appointments = await Appointment.getAppointmentShop(dateStart, dateEnd, _shopId);

      response.json({
        message: 'Appointments correctly requested',
        number_appointment: appointments.length,
        data: appointments
      });

    } catch (error) {

      console.trace(error);
      return response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });

    }
  },

  // Method to confirm that a client attended an appointment
  async confirmAttendance(request, response) {
    try {

      const appointmentId = request.body;
      let appointment;

      appointment = await Appointment.findById(appointmentId);

      if (!appointment.user_id)
        return response.status(400).json({ error: { message: 'Appointment not found.' } });

      if (appointment.user_id === null)
        return response.status(400).json({ error: { message: 'Attendance registration impossible. This appointment is not booked by any client.' } });

      appointment.is_attended = true;
      appointment.update();
      response.json({
        message: 'Attendance confirmation successfully registered.',
        data: appointment
      });

    } catch (error) {

      console.trace(error);
      response.status(500).json({ error: { message: 'Attendance confirmation could not be registered.' } });

    }
  }
}