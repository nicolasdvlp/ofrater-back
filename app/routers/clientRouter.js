const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();


/**
 * Routes /client
 */
router.get('/:id/profile', clientController.getProfile);
router.put('/profile', clientController.updateProfile);




module.exports = router;
