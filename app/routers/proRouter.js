const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');
const { idSchema, postAvailableAppointmentSchema, getAppointmentsSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Routes /pro
 */
router.route('/profile')
  // Route to get user profile 
  .post(validateBody(idSchema), proController.getProfile)
  // Route to update user profile 
  .put(validateBody(idSchema), proController.updateProfile);

// create available appointments in database
router.route('/createslots')
  .post(validateBody(postAvailableAppointmentSchema), proController.postAvailableAppointment);

// get appointment in database between to dates or a single date
router.route('/calendar')
  .post(validateBody(getAppointmentsSchema), proController.getAppointmentsPro);

// confirm that a client attended an appointment
router.route('/confirmattendance')
  .put(validateBody(idSchema), proController.confirmAttendance);

module.exports = router;