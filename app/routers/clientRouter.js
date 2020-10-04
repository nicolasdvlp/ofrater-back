const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();


/**
 * Routes /client
 */
router.post('/profile', clientController.getProfile);
router.put('/profile', clientController.updateProfile);

// to book an appointment
router.post('/book', clientController.bookAnAppointement);


module.exports = router;
