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

// session
app.use(session({
  secret: 'Une super phrase de chiffrement de ouf Iliade 4 Life',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, //! true if https
    maxAge: (1000 * 60 * 60 * 10) // 10 hours
   } 
}))

// check session 
// app.use((req, _, next) => {
//   console.log('=== SESSION CHECKER ===');
//   console.table(req.session);
//   console.log('=== END OF SESSION CHECKER ===');
//   next();
// });



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