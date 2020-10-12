const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');
const { postAvailableAppointmentSchema, getAppointmentsSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Routes /pro
 */
router.post('/profile', proController.getProfile);
router.put('/profile', proController.updateProfile);

// send available appointments in database
router.post('/availableappointment', validateBody(postAvailableAppointmentSchema), proController.postAvailableAppointment);

// get appointment in database between to dates or a single date
router.post('/getappointments', validateBody(getAppointmentsSchema), proController.getAppointmentsPro);

module.exports = router;