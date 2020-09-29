const express = require('express');
const router = express.Router();
const proController = require('../controllers/proController');

/**
 * Routes /pro
 */
router.get('/:id/profile', proController.getProfile);
router.put('/profile', proController.updateProfile);

module.exports = router;