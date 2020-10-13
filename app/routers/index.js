const express = require('express');
const router = express.Router();
const mainRouter = require('./mainRouter');
const clientRouter = require('./clientRouter');
const proRouter = require('./proRouter');

// route /
router.get('/', (req, res) => { res.sendFile('index.html') ; });

// route test
router.get('/hello', (req, res) => {res.json("Hello Wordl!");})

// route api
router.use('/api', mainRouter);
router.use('/api/client', clientRouter);
router.use('/api/pro', proRouter);

module.exports = router;