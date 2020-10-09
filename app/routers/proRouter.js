const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');

/**
 * Routes /pro
 */
router.post('/profile', proController.getProfile);
router.put('/profile', proController.updateProfile);

// send available appointment in database
router.post('/availableappointment', proController.postAvailableAppointment);

// get appointment in database between to dates or a single date
router.post('/getappointments', proController.getAppointmentsPro);

module.exports = router;