const Joi = require('joi').extend(require('@joi/date'));
const moment = require('moment');
moment().format();

const patternDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
  patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
  patternTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const idJoi = Joi.number().positive().required(),
  stringJoi = Joi.string().required().min(2),
  mailJoi = Joi.string().email().required(),
  password = Joi.string().required().min(6).pattern(new RegExp(patternPassword)),
  timeJoi = Joi.string().allow('').required().pattern(new RegExp(patternTime)),
  dayJoi = Joi.object({
    amStart: timeJoi,
    amEnd: timeJoi,
    pmStart: timeJoi,
    pmEnd: timeJoi
  }).custom((doc) => {
    if (moment(doc.amStart, 'HH:mm').isAfter(moment(doc.amEnd, 'HH:mm'))
      || moment(doc.pmStart, 'HH:mm').isAfter(moment(doc.pmEnd, 'HH:mm'))
      || moment(doc.amEnd, 'HH:mm').isAfter(moment(doc.pmStart, 'HH:mm')))
      throw new Error('xxEnd must be after xxStart OR pmStart must be after  previous amEnd!');

    return doc; // Return the value unchanged
  });

const registerSchema = Joi.object({
  first_name: stringJoi,
  last_name: stringJoi,
  phone_number: Joi.required(),
  birth: Joi.required(),
  mail: mailJoi,
  mail_confirm: Joi.ref('mail'),
  password,
  password_confirm: Joi.ref('password'),
  role_id: idJoi,
  shop_name: Joi.when('role_id', { is: 2, then: stringJoi, }),
  opening_time: Joi.when('role_id', { is: 2, then: stringJoi, }),
  address_name: Joi.when('role_id', { is: 2, then: stringJoi, }),
  address_number: Joi.when('role_id', { is: 2, then: idJoi, }),
  city: Joi.when('role_id', { is: 2, then: stringJoi, }),
  postal_code: Joi.when('role_id', { is: 2, then: Joi.string().min(5).max(5).required() })
});

const loginSchema = Joi.object({
  mail: mailJoi,
  password,
});

const postAvailableAppointmentSchema = Joi.object({
  id: idJoi,
  dateStart: Joi.date().format('YYYY-MM-DD').required(),
  dateEnd: Joi.date().format('YYYY-MM-DD').min(Joi.ref('dateStart')),
  days: Joi.object({
    monday: dayJoi,
    tuesday: dayJoi,
    wednesday: dayJoi,
    thursday: dayJoi,
    friday: dayJoi,
    saturday: dayJoi,
    sunday: dayJoi,
  }),
  // slotTimeInMinute: idJoi
});

const getAppointmentsSchema = Joi.object({
  id: idJoi,
  dateStart: Joi.string().required().pattern(new RegExp(patternDate)),
  dateEnd: Joi.string().allow('').pattern(new RegExp(patternDate))
});

const modifyAnAppointmentSchema = Joi.object({
  newAppointmentID: idJoi,
  oldAappointmentID: idJoi,
  serviceID: idJoi,
  userID: idJoi,
});

const bookAnAppointementSchema = Joi.object({
  id: idJoi,
  user_id: idJoi,
  // FIXME:
  // service_id: idJoi,
});

const idSchema = Joi.object({
  id: idJoi,
});

const locationInputSchema = Joi.object({
  input: Joi.string().required().allow('')
});

module.exports = { locationInputSchema, idSchema, registerSchema, loginSchema, postAvailableAppointmentSchema, getAppointmentsSchema, modifyAnAppointmentSchema, bookAnAppointementSchema };