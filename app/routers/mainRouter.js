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
    // Route to shop shop's available appointements and details
router.post('/shop', mainController.getShopPage);
    // Route to get Pro details for map view
router.post('/shopdetails', mainController.getProDetailsById);
    // To get service's shop
router.post('/services', validateBody(getShopServicesSchema), mainController.getShopServices);

/**
 * Routes Login/signin/signout
 */
    // Route to register
router.post('/join', validateBody(registerSchema), mainController.register);
    // Route to login
router.post('/login', validateBody(loginSchema), mainController.postLogin);
    // Route to logout
router.post('/logout', mainController.logout);
    // Route to verifiemail and reseting password
router.get('/checkmail/:validationKey', mainController.checkEmail);

    // custom middleware to check if user is logged in
// router.use(userConnect);

module.exports = router;