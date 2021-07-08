const express = require('express');
const userController = require('../controllers/userController');
const { idSchema, bookAnAppointementSchema, modifyAnAppointmentSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');
const router = express.Router();

/**
 * Routes /user
 */

router.route('/profile')
  // Route to get user profile 
  .post(validateBody(idSchema), userController.getUserProfile)
  // Route to update user profile 
  .put(validateBody(idSchema), userController.updateUserProfile);

// to book an appointment
router.route('/book')
  .put(validateBody(bookAnAppointementSchema), userController.bookAnAppointement);

// to modify an appointment and clear the old appointment
router.route('/bookmodify')
  .put(validateBody(modifyAnAppointmentSchema), userController.modifyAnAppointment);

// to cancel an appointment
router.route('/bookcancel')
  .put(validateBody(idSchema), userController.cancelAppointment);

module.exports = router;

