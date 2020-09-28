const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');


/**
 * Search Routes
 */

// Route for city and zip in the main page
router.post('/mainsearch', mainController.findCityOrZip);

router.post('/searchOnePro', mainController.findOnePro);

router.post('/searchProByLocation', mainController.findProByLocation)


// 404 gestion
router.use(mainController.error404);

module.exports = router;