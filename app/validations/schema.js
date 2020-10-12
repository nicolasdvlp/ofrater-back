const Joi = require('joi');

const registerSchema = Joi.object({
    first_name: Joi.string().required().min(2),
    last_name: Joi.string().required().min(2),
    phone_number: Joi.required(),
    birth: Joi.required(),
    mail: Joi.string().required(),
    mail_confirm :Joi.string().required(),
    password: Joi.string().required().min(6).pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$')),
    password_confirm: Joi.ref('password'),
    role_id: Joi.required()
});

const loginSchema = Joi.object({
    mail: Joi.string().required(),
    password: Joi.string().required().min(6)
});

const postAvailableAppointmentSchema = Joi.object({
    shopID: Joi.required(),
    dateStart: Joi.string().required().pattern(new RegExp('^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$')),
    dateEnd: Joi.string().required().pattern(new RegExp('^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$')),
    days: Joi.required()
});

const getappointmentsSchema = Joi.object({
    shopID: Joi.required(),
    dateStart: Joi.string().required().pattern(new RegExp('^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$')),
    dateEnd: Joi.string().pattern(new RegExp('^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$')),
});

const updateProProfileSchema = Joi.object({
    shopID: Joi.required(),
});



module.exports = { registerSchema, loginSchema, postAvailableAppointmentSchema, getappointmentsSchema, updateProProfileSchema };