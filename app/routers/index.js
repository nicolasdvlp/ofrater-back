const express = require('express');
const router = express.Router();
const path = require('path');
const mainRouter = require('./mainRouter');
const userRouter = require('./userRouter');
const proRouter = require('./proRouter');

// route api test
router.get('/api/hello', (req, res) => { res.json("Hello Wordl!");})

//-- route api
router.use('/api', mainRouter);
// connected user route
router.use('/api/user', userRouter);
// connected profesionnal route
router.use('/api/pro', proRouter);

// 404 api
router.use('/api/', (_, res) => { res.status(404).json('API route not found - 404'); });

// route / for react front
router.use('*', (_, res) => { res.sendFile(path.join(__dirname, '../..', 'public', 'index.html')); });

module.exports = router;