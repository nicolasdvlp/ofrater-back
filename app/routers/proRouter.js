const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');

/**
 * Routes /pro
 */
router.put('/profile', proController.updateProfile);

router.post('/availableappointment', proController.postAvailableAppointment)

module.exports = router;