const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');
const { confirmAttendanceSchema, postAvailableAppointmentSchema, getAppointmentsSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Routes /pro
 */
    // Route to get user profile 
router.post('/profile', proController.getProfile);
    // Route to update user profile 
router.put('/profile', proController.updateProfile);
    // create available appointments in database
router.post('/createappointments', validateBody(postAvailableAppointmentSchema), proController.postAvailableAppointment);
    // get appointment in database between to dates or a single date
router.post('/getappointments', validateBody(getAppointmentsSchema), proController.getAppointmentsPro);
    // confirm that a client attended an appointment
router.put('/confirmattendance', validateBody(confirmAttendanceSchema), proController.confirmAttendance);

module.exports = router;