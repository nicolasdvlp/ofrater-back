const express = require('express');
const clientController = require('../controllers/clientController');
const { getUserProfileSchema, getShopPageAndAgendaSchema, bookAnAppointementSchema, modifyAnAppointmentSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');
const router = express.Router();


/**
 * Routes /client
 */
router.post('/profile', validateBody(getUserProfileSchema), clientController.getUserProfile);
router.put('/profile', clientController.updateUserProfile);

// to book an appointment
router.put('/book', validateBody(bookAnAppointementSchema), clientController.bookAnAppointement);

// to cancel an appointment
router.put('/cancelAppointment', clientController.cancelAppointment);

// to access one shop page and consult available appointments
router.post('/shop', validateBody(getShopPageAndAgendaSchema), clientController.getShopPage);

// to modify an appointment and clear the old appointment
router.put('/bookmodify', validateBody(modifyAnAppointmentSchema), clientController.modifyAnAppointment);

module.exports = router;

