const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { userConnect } = require('../middlewares');
const { searchprobylocationSchema, getShopServicesSchema, registerSchema, loginSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Routes Search
 */
// Route for city and zip in the main page
router.post('/mainsearch', mainController.findCityOrZip);
// Route to get Pro detailscontacté par téléphone au numéro que vous avez in
router.post('/searchonepro', mainController.findOnePro);
// Route to get list of pro by location
router.post('/searchprobylocation', validateBody(searchprobylocationSchema), mainController.findProByLocation);

/**
 * To get service's shop
 */
router.post('/services', validateBody(getShopServicesSchema), mainController.getShopServices);


/**
 * Routes Login/signin/signout
 */

router.post('/registration', validateBody(registerSchema), mainController.register);
router.get('/checkEmail/:crypto', mainController.checkEmail);
router.post('/login', validateBody(loginSchema), mainController.postLogin);
router.post('/signout', mainController.signout);


// custom middleware to check if user is logged in
// router.use(userConnect);


module.exports = router;