const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();


/**
 * Routes /client
 */
router.post('/profile', clientController.getProfile);
router.put('/profile', clientController.updateProfile);

// to book an appointment
router.put('/book', clientController.bookAnAppointement);

// to cancel an appointment
router.put('/cancelAppointment', clientController.cancelAppointment);

// to modify an appointment and clear the old appointment
router.put('/bookmodify', clientController.modifyAnAppointment);

module.exports = router;

