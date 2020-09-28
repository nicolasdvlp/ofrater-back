// ### Requires ###
if (process.env.NODE_ENV !== 'production') {require('dotenv').config();}
const PORT = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const mainRouter = require('./app/routers/mainRouter');
const clientRouter = require('./app/routers/clientRouter');
const proRouter = require('./app/routers/proRouter');

const app = express();

// ### Middlewares ###
app.use(express.json());

// ### Router ###
app.use(mainRouter);
app.use('/client', clientRouter);
app.use('/pro', proRouter);

// ### Serveur Listener ###
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });