const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
// const { userConnect } = require('../middlewares');
const { locationInputSchema, idSchema, registerSchema, loginSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Routes Search
 */
// Route quick search city or zip in homepage's search bar 
router.route('/maininputsearch')
  .post(validateBody(locationInputSchema), mainController.findCityOrZip);

// Route to get list of pro by location
router.route('/searchbylocation')
  .post(validateBody(locationInputSchema), mainController.findProByLocation);

// Route to shop's available appointements and details
router.route('/shop')
  .post(mainController.getShopPage);

// Route to get Pro details for map view
router.route('/shopinfo',)
  .post(validateBody(idSchema), mainController.getProDetailsById);

// To get service's shop
router.route('/services')
  .post(validateBody(idSchema), mainController.getShopServices);

/**
 * Routes Login/signin/signout
 */
// Route to register
router.route('/join')
  .post(validateBody(registerSchema), mainController.register);

// Route to login
router.route('/login')
  .post(validateBody(loginSchema), mainController.postLogin);

// Route to logout
router.route('/logout')
  .post(mainController.logout);

// Route to verifiemail and reseting password
router.route('/checkmail/:validationKey')
  .get(mainController.checkEmail);

// custom middleware to check if user is logged in
// router.use(userConnect);

module.exports = router;