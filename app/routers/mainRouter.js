const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');


/**
 * Routes Search
 */

// Route for city and zip in the main page
router.post('/mainsearch', mainController.findCityOrZip);
// Route to get Pro detailscontacté par téléphone au numéro que vous avez in
router.post('/searchOnePro', mainController.findOnePro);
// Route to get list of pro by location
router.post('/searchProByLocation', mainController.findProByLocation)



/**
 * Routes Login
 */

 router.post('/registration', mainController.register);
 router.post('/login', mainController.postLogin);

module.exports = router;