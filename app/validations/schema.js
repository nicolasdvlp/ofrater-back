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

module.exports = { registerSchema };