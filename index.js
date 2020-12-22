if (process.env.NODE_ENV !== 'production') {require('dotenv').config();}
const PORT = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { requireHTTPS } = require('./app/middlewares')
const routers = require('./app/routers');
const cors = require('cors');
    // const https = require('https');

const app = express();

    // SSH files
    // const key = fs.readFileSync(path.join(__dirname, 'certificate', 'private.key'));
    // const cert = fs.readFileSync(path.join(__dirname, 'certificate', 'ofrater_me.crt'));
    // const ca = fs.readFileSync(path.join(__dirname, 'certificate', 'ofrater_me.ca-bundle'));
    // const options = { key, cert, ca };

// ### Middlewares ###

// body-parson json
app.use(express.json());

// dossier static
app.use(express.static('public'));

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

// cors
app.use(cors())

// Doc for API
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


    // force https
    // app.use(requireHTTPS);

// ### routers ###
app.use('/api/v1', routers);

    // ### Serveur Listener ###

    // https
    // .createServer(options, app).listen(PORT, () => {
      // console.log(`App is running ! Go to https://localhost:${PORT}`);
    // });

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});