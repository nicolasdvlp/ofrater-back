if (process.env.NODE_ENV !== 'production') {require('dotenv').config();}
const PORT = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const https = require('https');
const mainRouter = require('./app/routers/mainRouter');
const clientRouter = require('./app/routers/clientRouter');
const proRouter = require('./app/routers/proRouter');
const cors = require('cors');

const app = express();

// SSH files
const key = fs.readFileSync(path.join(__dirname, 'certificate', 'private.key'));
const cert = fs.readFileSync(path.join(__dirname, 'certificate', 'ofrater_me.crt'));
const ca = fs.readFileSync(path.join(__dirname, 'certificate', 'ofrater_me.ca-bundle'));
const options = { key, cert, ca };

/**
 * Middlewares
 */
// body-parson json
app.use(express.json());

app.use(express.static('public'));

// session
app.use(session({
  secret: 'Une super phrase de chiffrement de ouf Iliade 4 Life',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: true, //! true if https
    maxAge: (1000 * 60 * 60 * 10) // 10 hours
   } 
}))

app.use(cors())

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
// app.use(mainController.error404);

// ### Serveur Listener ###

// app.listen(PORT, () => {
    // console.log(`Listening on ${PORT}`);
// });

https
  .createServer(options, app).listen(PORT, () => {
    console.log(`App is running ! Go to https://localhost:${PORT}`);
});
