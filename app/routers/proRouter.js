const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');

/**
 * Routes /pro
 */
router.get('/:id/profile', proController.getProfile);
router.put('/profile', proController.updateProfile);

router.post('/availableappointment', proController.postAvailableAppointment);

router.post('/getappointments', proController.getAppointmentsPro);

module.exports = router;