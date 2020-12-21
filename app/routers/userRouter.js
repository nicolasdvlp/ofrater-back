const express = require('express');
const userController = require('../controllers/userController');
const { getUserProfileSchema, getShopPageAndAgendaSchema, bookAnAppointementSchema, modifyAnAppointmentSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');
const router = express.Router();


/**
 * Routes /user
 */
    // Route to get user profile 
router.post('/profile', validateBody(getUserProfileSchema), userController.getUserProfile);
    // Route to update user profile 
router.put('/profile', userController.updateUserProfile);
    // to book an appointment
router.put('/book', validateBody(bookAnAppointementSchema), userController.bookAnAppointement);
    // to modify an appointment and clear the old appointment
router.put('/bookmodify', validateBody(modifyAnAppointmentSchema), userController.modifyAnAppointment);
    // to cancel an appointment
router.put('/bookcancel', userController.cancelAppointment);

module.exports = router;

