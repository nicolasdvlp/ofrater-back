if (process.env.NODE_ENV !== 'production') {require('dotenv').config();}
const PORT = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { requireHTTPS } = require('./app/middlewares')
const routers = require('./app/routers');
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

app.use(requireHTTPS);
// router
app.use(routers);

// ### Serveur Listener ###

// app.listen(PORT, () => {
    // console.log(`Listening on ${PORT}`);
// });

https
  .createServer(options, app).listen(PORT, () => {
    console.log(`App is running ! Go to https://localhost:${PORT}`);
});
