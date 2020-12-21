const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { userConnect } = require('../middlewares');
const { searchprobylocationSchema, getShopServicesSchema, registerSchema, loginSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Routes Search
 */
// Route quick search city or zip in homepage's search bar 
router.post('/mainsearch', mainController.findCityOrZip);
// Route to get list of pro by location
router.post('/searchprobylocation', validateBody(searchprobylocationSchema), mainController.findProByLocation);
// Route to get Pro details
router.post('/prodetails', mainController.getProDetails);
// To get service's shop
router.post('/services', validateBody(getShopServicesSchema), mainController.getShopServices);


/**
 * Routes Login/signin/signout
 */
router.post('/registration', validateBody(registerSchema), mainController.register);
router.get('/checkEmail/:crypto', mainController.checkEmail);
router.post('/login', validateBody(loginSchema), mainController.postLogin);
router.post('/logout', mainController.logout);

// custom middleware to check if user is logged in
// router.use(userConnect);

module.exports = router;