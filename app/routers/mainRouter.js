const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const userMiddleware = require('../middlewares/userMiddleware');


const { registerSchema } = require('../validations/schema');
const { validateBody } = require('../validations/validate');

/**
 * Test route
 */
router.get('/hello', (req, res) => {res.json("Hello Wordl!");})

/**
 * Routes Search
 */
// Route for city and zip in the main page
router.post('/mainsearch', mainController.findCityOrZip);
// Route to get Pro detailscontacté par téléphone au numéro que vous avez in
router.post('/searchonepro', mainController.findOnePro);
// Route to get list of pro by location
router.post('/searchprobylocation', mainController.findProByLocation);

/**
 * To get service's shop
 */
router.post('/services', mainController.getShopServices);


/**
 * Routes Login/signin/signout
 */

router.route('/registration')
    .post(validateBody(registerSchema), mainController.register);

router.get('/checkEmail/:crypto', mainController.checkEmail);
router.post('/login', mainController.postLogin);
router.post('/signout', mainController.signout);


// custom middleware to check if user is logged in
// router.use(userMiddleware);

// 404 gestion
// router.use(mainController.error404);


module.exports = router;