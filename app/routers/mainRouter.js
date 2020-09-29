const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');


/**
 * Routes Search
 */

// Route for city and zip in the main page
router.get('/mainsearch', mainController.findCityOrZip);
// Route to get Pro detailscontacté par téléphone au numéro que vous avez in
router.get('/searchOnePro', mainController.findOnePro);
// Route to get list of pro by location
router.get('/searchProByLocation', mainController.findProByLocation)



/**
 * Routes Login
 */

 router.post('/registration', mainController.register);
 router.post('/login', mainController.postLogin);


// 404 gestion
router.use(mainController.error404);

module.exports = router;