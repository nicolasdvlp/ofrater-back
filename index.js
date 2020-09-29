/**
 * Requires
 */
if (process.env.NODE_ENV !== 'production') {require('dotenv').config();}
const PORT = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const mainRouter = require('./app/routers/mainRouter');
const clientRouter = require('./app/routers/clientRouter');
const proRouter = require('./app/routers/proRouter');
const mainController = require('./app/controllers/mainController');


const app = express();

/**
 * Middlewares
 */
// body-parson json
app.use(express.json());

// // session
// app.use(session({
//   secret: 'Une super phrase de chiffrement de ouf',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // true si https
// }))
// // custom middleware to check if user is logged in
// const userMiddleware = require('./app/middlewares/userMiddleware');
// app.use(userMiddleware)


/**
 * Routers
 */
app.use(mainRouter);
app.use('/client', clientRouter);
app.use('/pro', proRouter);
app.use(mainController.error404);

// ### Serveur Listener ###
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });