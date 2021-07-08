const Joi = require('joi')
  .extend(require('@joi/date'));

const patternDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
const patternPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
const patternTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
const idJoi = Joi.number().positive().required();
const dayJoi = Joi.object({
  amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
  amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
  pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
  pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime))
})
const password = Joi.string().required().min(6).pattern(new RegExp(patternPassword));
const mail = Joi.string().email().required();
const stringJoi = Joi.string().required().min(2);



const registerSchema = Joi.object({
  first_name: stringJoi,
  last_name: stringJoi,
  phone_number: Joi.required(),
  birth: Joi.required(),
  mail,
  mail_confirm: Joi.ref('mail'),
  password,
  password_confirm: Joi.ref('password'),
  role_id: idJoi,
  shop: Joi.object({
    shop_name: Joi.when('role_id', { is: 2, then: stringJoi, }),
    opening_time: Joi.when('role_id', { is: 2, then: stringJoi, }),
    address_name: Joi.when('role_id', { is: 2, then: stringJoi, }),
    address_number: Joi.when('role_id', { is: 2, then: Joi.required() }),
    city: Joi.when('role_id', { is: 2, then: stringJoi, }),
    postal_code: Joi.when('role_id', { is: 2, then: Joi.string().required() })
  })
});

const loginSchema = Joi.object({
  mail,
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
  })
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
  // service_id: idJoi,
});

const idSchema = Joi.object({
  id: idJoi,
});

const locationInputSchema = Joi.object({
  input: Joi.string().required().allow('')
});

module.exports = { locationInputSchema, idSchema, registerSchema, loginSchema, postAvailableAppointmentSchema, getAppointmentsSchema, modifyAnAppointmentSchema, bookAnAppointementSchema };