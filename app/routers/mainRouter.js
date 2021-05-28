const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const { userConnect } = require('../middlewares');
const { locationInputSchema, idSchema, registerSchema, loginSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Routes Search
 */
// Route quick search city or zip in homepage's search bar 
router.post(
  '/maininputsearch',
  validateBody(locationInputSchema),
  mainController.findCityOrZip
);

// Route to get list of pro by location
router.post(
  '/searchbylocation',
  validateBody(locationInputSchema),
  mainController.findProByLocation
);

// Route to shop's available appointements and details
router.post(
  '/shop',
  mainController.getShopPage
);

// Route to get Pro details for map view
router.post(
  '/shopinfo',
  validateBody(idSchema),
  mainController.getProDetailsById
);

// To get service's shop
router.post(
  '/services',
  validateBody(idSchema),
  mainController.getShopServices
);


/**
 * Routes Login/signin/signout
 */
// Route to register
router.post(
  '/join',
  validateBody(registerSchema),
  mainController.register
);

// Route to login
router.post(
  '/login',
  validateBody(loginSchema),
  mainController.postLogin
);

// Route to logout
router.post(
  '/logout',
  mainController.logout
);

// Route to verifiemail and reseting password
router.get('/checkmail/:validationKey', mainController.checkEmail);

// custom middleware to check if user is logged in
// router.use(userConnect);

module.exports = router;