"use strict";

const { Appointment } = require('../models/');
const { slotTime } = require('../../config')
const moment = require('moment');
moment().format();

// function to add one appointment
const generateNewAppointment = async function (shopId, slotStart, slotEnd) {

  let newAppointment = new Appointment({
    slot_start: slotStart,
    slot_end: slotEnd,
    shop_id: shopId,
    is_attended: false
  })
  await newAppointment.save()
};

// function a insert appointment un a day with starting hour and ending hour
const generateNewAppointmentForADay = async function (date, startHour, endHour, shopId) {

  let alreadyInDatabaseArray = [],
    startTimestampArray = [],
    endTimestampArray = [],
    currentTime;

  const startTime = moment(date + 'T' + startHour, "YYYY-MM-DDTHH:mm:ss:SSSZ");
  const endTime = moment(date + 'T' + endHour, "YYYY-MM-DDTHH:mm:ss:SSSZ");

  // calculate how many slot exist to repeat 'insert'
  const slotQty = parseInt((endTime - startTime) / slotTime / 60 / 1000);

  currentTime = moment(startTime, "YYYY-MM-DDTHH:mm:ss:SSSZ").toDate();

  // loop to add start times in startTimestampArray
  // FIXME: Promise.all()
  for (let index = 0; index < slotQty; index++) {

    const isInDatabase = await Appointment.findOne({ where: { slot_start: currentTime, shop_id: shopId } })

    currentTime = moment(currentTime, "YYYY-MM-DDTHH:mm:ss:SSSZ");

    !!isInDatabase
      ? alreadyInDatabaseArray.push(currentTime)
      : startTimestampArray.push(currentTime);

    currentTime = moment(currentTime, "YYYY-MM-DDTHH:mm:ss:SSSZ").add(slotTime, 'm').toDate()
  };

  // endTimestampArray array
  endTimestampArray = startTimestampArray.map(date => moment(date, "YYYY-MM-DD HH:mm")
    .add(slotTime, "m")
    .format("YYYY-MM-DD HH:mm")
    .toString()
  )

  // loop to insert appointments in given date
  for (let index = 0; index < startTimestampArray.length; index++) {
    await generateNewAppointment(shopId, startTimestampArray[index], endTimestampArray[index]);
  };

  return [alreadyInDatabaseArray, startTimestampArray]
};

/**
 * @version 30/05/2021
 * @author Nicolas 
 * @param {string} dateStart 
 * @param {string} dateEnd 
 * @param {{monday: string, tuesday: string, wednesday: string, thursday: string, friday: string, saturday: string, sunday: string}} days
 * @param {number} shopId 
 * @return {[Array<String>,Array<String>]} [newAppointmeentsArray, appointmentsAlreadyInDbArray]
 */
const generateNewAppointmentForALength = async function (dateStart, dateEnd, days, shopId) {

  let newAppointmeentsArray = [],
    appointmentsAlreadyInDbArray = [],
    currentDay;

  currentDay = moment(dateStart, "YYYY-MM-DD").format("YYYY-MM-DD")

  // loop to add appointments for each day
  for (let index = 0; moment(currentDay, "YYYY-MM-DD").isSameOrBefore(moment(dateEnd, "YYYY-MM-DD")); index++) {
    let _newAppointmeentsArray = [],
      _appointmentsAlreadyInDbArray = [],
      currentWeekDay;

    currentWeekDay = moment(currentDay, "YYYY-MM-DD").format("dddd").toString().toLowerCase();

    // FIXME: Promise.all()
    if (Object.keys(days).includes(currentWeekDay))
      for (const meridiemPosition of ["am", "pm"])
        if (!!days[currentWeekDay][`${meridiemPosition}Start`] && !!days[currentWeekDay][`${meridiemPosition}End`]) {
          [_appointmentsAlreadyInDbArray,
            _newAppointmeentsArray] = await generateNewAppointmentForADay(
              currentDay,
              days[currentWeekDay][`${meridiemPosition}Start`],
              days[currentWeekDay][`${meridiemPosition}End`],
              shopId
            )
          newAppointmeentsArray.push(..._newAppointmeentsArray);
          appointmentsAlreadyInDbArray.push(..._appointmentsAlreadyInDbArray);
        };

    currentDay = moment(currentDay, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD");
  }

  return [newAppointmeentsArray, appointmentsAlreadyInDbArray]
}

module.exports = { generateNewAppointmentForALength }