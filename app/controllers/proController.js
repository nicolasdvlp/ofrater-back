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
        success: true,
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
        success: true,
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
      let startTimestampArray = [];
      let alreadyExistInDbArray = [];
      const { id, dateStart, dateEnd, days } = req.body;

      if (moment(dateStart, "YYYY-MM-DD").isAfter(dateEnd))
        return res.status(400).json({ success: false, message: 'dateStart must be after dateEnd', info: 'dateStart/dateEnd' });

      for (const key of Object.keys(days)) {
        console.log(days[key].amStart, days[key].amEnd,
          moment(days[key].amStart, "HH:mm").isAfter(moment(days[key].amEnd, "HH:mm"))
        )
      }

      let dateToCible = moment(dateStart, "YYYY-MM-DD")
      // .format("YYYY-MM-DD").toString();

      // loop to add appointments in a day
      for (let index = 0; dateToCible !== dateEnd; index++) {

        dateToCible = moment(dateStart, "YYYY-MM-DD").add(index, "day").format("YYYY-MM-DD").toString();
        const jourDeDateCible = moment(dateToCible, "YYYY-MM-DD").format("dddd").toString().toLowerCase();
        // Switch to verify the dayy of the week and if it's a worked day
        switch (jourDeDateCible) {
          case "monday":
            if (!!days.monday.amStart && !!days.monday.amEnd) {
              await generateNewAppointmentForADay(dateToCible, days.monday.amStart, days.monday.amEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            if (!!days.monday.pmStart && !!days.monday.pmEnd) {
              await generateNewAppointmentForADay(dateToCible, days.monday.pmStart, days.monday.pmEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            break;

          case "tuesday":
            if (!!days.tuesday.amStart && !!days.tuesday.amEnd) {
              await generateNewAppointmentForADay(dateToCible, days.tuesday.amStart, days.tuesday.amEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            if (!!days.tuesday.pmStart && !!days.tuesday.pmEnd) {
              await generateNewAppointmentForADay(dateToCible, days.tuesday.pmStart, days.tuesday.pmEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            break;

          case "wednesday":
            if (!!days.wednesday.amStart && !!days.wednesday.amEnd) {
              await generateNewAppointmentForADay(dateToCible, days.wednesday.amStart, days.wednesday.amEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            if (!!days.wednesday.pmStart && !!days.wednesday.pmEnd) {
              await generateNewAppointmentForADay(dateToCible, days.wednesday.pmStart, days.wednesday.pmEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            break;

          case "thursday":
            if (!!days.thursday.amStart && !!days.thursday.amEnd) {
              await generateNewAppointmentForADay(dateToCible, days.thursday.amStart, days.thursday.amEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            if (!!days.thursday.pmStart && !!days.thursday.pmEnd) {
              await generateNewAppointmentForADay(dateToCible, days.thursday.pmStart, days.thursday.pmEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            break;

          case "friday":
            if (!!days.friday.amStart && !!days.friday.amEnd) {
              await generateNewAppointmentForADay(dateToCible, days.friday.amStart, days.friday.amEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            if (!!days.friday.pmStart && !!days.friday.pmEnd) {
              await generateNewAppointmentForADay(dateToCible, days.friday.pmStart, days.friday.pmEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            break;

          case "saturday":
            if (!!days.saturday.amStart && !!days.saturday.amEnd) {
              await generateNewAppointmentForADay(dateToCible, days.saturday.amStart, days.saturday.amEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            if (!!days.saturday.pmStart && !!days.saturday.pmEnd) {
              await generateNewAppointmentForADay(dateToCible, days.saturday.pmStart, days.saturday.pmEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            break;

          case "sunday":
            if (!!days.sunday.amStart && !!days.sunday.amEnd) {
              await generateNewAppointmentForADay(dateToCible, days.sunday.amStart, days.sunday.amEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            if (!!days.sunday.pmStart && !!days.sunday.pmEnd) {
              await generateNewAppointmentForADay(dateToCible, days.sunday.pmStart, days.sunday.pmEnd, id, (resInDB, resInsert) => {
                startTimestampArray = [...startTimestampArray, ...resInsert];
                alreadyExistInDbArray = [...alreadyExistInDbArray, ...resInDB];
              })
            };
            break;

          default:
            break;
        }
      }

      res.json({
        success: true,
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
        success: true,
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
        return response.status(400).json({ success: false, message: 'Appointment not found.' });

      if (appointment.user_id === null)
        return response.status(400).json({ success: false, message: 'Attendance registration impossible. This appointment is not booked by any client.' });

      appointment.is_attended = true;
      appointment.update();
      response.json({ success: true, message: 'Attendance confirmation successfully registered.', data: appointment });

    } catch (error) {

      console.trace(error);
      response.status(500).json({ success: false, message: 'Attendance confirmation could not be registered.' });

    }
  }
}