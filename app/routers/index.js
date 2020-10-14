const express = require('express');
const router = express.Router();
const mainRouter = require('./mainRouter');
const clientRouter = require('./clientRouter');
const proRouter = require('./proRouter');
const path = require('path');


// route test
router.get('/hello', (req, res) => {res.json("Hello Wordl!");})

// route api
router.use('/api', mainRouter);
router.use('/api/client', clientRouter);
router.use('/api/pro', proRouter);

// 404 api
router.use('/api/', (_, res) => { res.status(404).json('API route not found - 404'); });

// 404 web
// router.use((_, res) => { res.redirect('/not-found'); });

// route /
router.get('*', (_, res) => { res.sendFile( path.join(__dirname, 'public', 'index.html') ; });

module.exports = router;