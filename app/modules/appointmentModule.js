'use strict';

const { Appointment } = require('../models/'),
  { slotTime } = require('../../config'),
  moment = require('moment');
moment().format();

// function to add one appointment
const generateNewSlotAppointment = async function (shopId, slotStart, slotEnd) {
  Appointment.create({ slot_start: slotStart, slot_end: slotEnd, shop_id: shopId, is_attended: false });
};

const generateStartTimeArray = async function (date, startHour, endHour, slotTimeInMinute = slotTime) {
  let startSlotArray = [], currentTime;

  const startTime = moment(date + 'T' + startHour, 'YYYY-MM-DDTHH:mm:ss:SSSZ');
  const endTime = moment(date + 'T' + endHour, 'YYYY-MM-DDTHH:mm:ss:SSSZ');

  // compute how many slot exist
  const slotQty = parseInt((endTime - startTime) / slotTime / 60 / 1000);

  currentTime = moment(startTime, 'YYYY-MM-DDTHH:mm:ss:SSSZ');

  for (let index = 0; index < slotQty; index++) {
    startSlotArray.push(currentTime.add(slotTimeInMinute * index, 'm').toISOString());
  }
  return startSlotArray;
};

/**
 * function to insert appointments for a day with starting and ending hours
 * @version 14/07/2021
 * @author Nicolas 
 * @param {string} date 
 * @param {string} startHour 
 * @param {string} endHour 
 * @param {number} shopId 
 * @param {number=} slotTimeInMinute 
 * @return {[Array<String>,Array<String>]} [newAppointmeentsArray, appointmentsAlreadyInDbArray]
 */
const generateNewAppointmentForADay = async function (date, startHour, endHour, shopId, slotTimeInMinute = slotTime) {
  let slotsArray = await generateStartTimeArray(date, startHour, endHour, slotTimeInMinute);

  let {
    alreadyInDatabaseArray,
    startTimestampArray
  } = await slotsArray
    .reduce(async (acc, cur) => {
      acc = await acc;
      cur = moment(cur, 'YYYY-MM-DDTHH:mm:ss:SSSZ').toISOString();
      const isInDB = await Appointment.findOne({ where: { slot_start: cur, shop_id: shopId } });
      const key = isInDB ? 'alreadyInDatabaseArray' : 'startTimestampArray';
      return { ...acc, [key]: [...acc[key]].concat([cur]) };
    }, Promise.resolve({
      alreadyInDatabaseArray: [], startTimestampArray: []
    }));

  // loop to insert appointments in given date
  for (let index = 0; index < startTimestampArray.length; index++) {
    const endTime = await moment(startTimestampArray[index], 'YYYY-MM-DD HH:mm')
      .add(slotTimeInMinute, 'm')
      .toISOString();
    generateNewSlotAppointment(shopId, startTimestampArray[index], endTime);
  }

  return [alreadyInDatabaseArray, startTimestampArray];
};

/**
 * @version 14/07/2021
 * @author Nicolas 
 * @param {string} dateStart 
 * @param {string} dateEnd 
 * @param {{monday: string, tuesday: string, wednesday: string, thursday: string, friday: string, saturday: string, sunday: string}} days
 * @param {number} shopId 
 * @param {number=} slotTimeInMinute 
 * @return {[Array<String>,Array<String>]} [newAppointmeentsArray, appointmentsAlreadyInDbArray]
 */
const generateNewAppointmentForTimeLapse = async function (dateStart, dateEnd, days, shopId, slotTimeInMinute = slotTime) {
  let newAppointmeentsArray = [], appointmentsAlreadyInDbArray = [];

  let currentDay = moment(dateStart, 'YYYY-MM-DD').format('YYYY-MM-DD');

  // loop on each day
  for (let index = 0; moment(currentDay, 'YYYY-MM-DD').isSameOrBefore(moment(dateEnd, 'YYYY-MM-DD')); index++) {
    let _newAppointmeentsArray = [], _appointmentsAlreadyInDbArray = [];
    let currentWeekDay = moment(currentDay, 'YYYY-MM-DD').format('dddd').toString().toLowerCase();

    // FIXME: Promise.all()
    if (Object.keys(days).includes(currentWeekDay))
      for (const meridiemPosition of ['am', 'pm'])
        if (!!days[currentWeekDay][`${meridiemPosition}Start`] && !!days[currentWeekDay][`${meridiemPosition}End`]) {
          [
            _appointmentsAlreadyInDbArray,
            _newAppointmeentsArray
          ] = await generateNewAppointmentForADay(
            currentDay,
            days[currentWeekDay][`${meridiemPosition}Start`],
            days[currentWeekDay][`${meridiemPosition}End`],
            shopId,
            slotTimeInMinute
          );

          newAppointmeentsArray.push(..._newAppointmeentsArray);
          appointmentsAlreadyInDbArray.push(..._appointmentsAlreadyInDbArray);
        }

    currentDay = moment(currentDay, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
  }

  return [newAppointmeentsArray, appointmentsAlreadyInDbArray];
};

module.exports = { generateNewAppointmentForTimeLapse };