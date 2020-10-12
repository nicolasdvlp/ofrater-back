const Joi = require('joi');

const patternDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
const patternPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
const patternTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const registerSchema = Joi.object({
    first_name: Joi.string().required().min(2),
    last_name: Joi.string().required().min(2),
    phone_number: Joi.required(),
    birth: Joi.required(),
    mail: Joi.string().email().required(),
    mail_confirm :Joi.ref('mail'),
    password: Joi.string().required().min(6).pattern(new RegExp(patternPassword)),
    password_confirm: Joi.ref('password'),
    role_id: Joi.required(),
    shop_name: Joi.when('role_id', {is: [ 2, "2" ], then: Joi.string().min(2).required()}),
    opening_time: Joi.when('role_id', {is: [ 2, "2" ], then: Joi.string().required()}),
    address_name: Joi.when('role_id', {is: [ 2, "2" ], then: Joi.string().min(2).required()}),
    address_number: Joi.when('role_id', {is: [ 2, "2" ], then: Joi.required()}),
    city: Joi.when('role_id', {is: [ 2, "2" ], then: Joi.string().min(2).required()}),
    postal_code: Joi.when('role_id', {is: [ 2, "2" ], then: Joi.string().required()})
});

const loginSchema = Joi.object({
    mail: Joi.string().email().required(),
    password: Joi.string().required().min(6)
});

const postAvailableAppointmentSchema = Joi.object({
    shopID: Joi.required(),
    dateStart: Joi.string().required().pattern(new RegExp(patternDate)),
    dateEnd: Joi.string().required().pattern(new RegExp(patternDate)),
    days: Joi.object({
        monday: Joi.object({
            amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
        }),
        tuesday: Joi.object({
            amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
        }),
        wednesday: Joi.object({
            amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
        }),
        thursday: Joi.object({
            amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
        }),
        friday: Joi.object({
            amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
        }),
        saturday: Joi.object({
            amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
        }),
        sunday: Joi.object({
            amStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            amEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmStart: Joi.string().allow('').required().pattern(new RegExp(patternTime)),
            pmEnd: Joi.string().allow('').required().pattern(new RegExp(patternTime))
        }),
    })
});

const getAppointmentsSchema = Joi.object({
    shopID: Joi.required(),
    dateStart: Joi.string().required().pattern(new RegExp(patternDate)),
    dateEnd: Joi.string().allow('').pattern(new RegExp(patternDate))
});

const updateProProfileSchema = Joi.object({
    shopID: Joi.required()
});

const modifyAnAppointmentSchema = Joi.object({
    newAppointmentID:  Joi.required(),
    oldAappointmentID: Joi.required(),
    userID: Joi.required(),
});

const bookAnAppointementSchema = Joi.object({
    id: Joi.required(),
    user_id: Joi.required(),
});

const cancelAppointmentSchema = Joi.object({
    id: Joi.required(),
});

const getShopPageAndAgendaSchema = Joi.object({
    dateStart: Joi.string().required().pattern(new RegExp(patternDate)),
    dateEnd: Joi.string().allow('').pattern(new RegExp(patternDate)),
    shopID: Joi.required()
});

const getUserProfileSchema = Joi.object({
    userID: Joi.required(),
});

const getShopServicesSchema = Joi.object({
    shopID: Joi.required(),
});

// const updateUserProfileSchema = Joi.object({
//     userID: Joi.required(),
// });

module.exports = { getShopServicesSchema, getUserProfileSchema, getShopPageAndAgendaSchema, registerSchema, loginSchema, postAvailableAppointmentSchema, getAppointmentsSchema, updateProProfileSchema, modifyAnAppointmentSchema, bookAnAppointementSchema, cancelAppointmentSchema };