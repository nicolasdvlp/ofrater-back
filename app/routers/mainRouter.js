const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const userMiddleware = require('../middlewares/userMiddleware');



/**
 * Routes Search
 */

// Route for city and zip in the main page
router.get('/mainsearch', mainController.findCityOrZip);
// Route to get Pro detailscontacté par téléphone au numéro que vous avez in
router.get('/searchOnePro', mainController.findOnePro);
// Route to get list of pro by location
router.get('/searchProByLocation', mainController.findProByLocation);



/**
 * Routes Login/signin/signout
 */

router.post('/registration', mainController.register);
router.post('/login', mainController.postLogin);
router.post('/signout', mainController.signout);


// custom middleware to check if user is logged in
//  router.use(userMiddleware);

// 404 gestion
// router.use(mainController.error404);


module.exports = router;