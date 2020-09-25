const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');


/**
 * Search Routes
 */
router.post('/mainsearch', mainController.findShopByCity);




module.exports = router;