const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  // databaseURL: process.env.DATABASE_URI,
  postgresql: {
    user: process.env.PGUSER,
    passwird: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST || localhost
  },
  gmail: {
    user: process.env.GMAILEMAIL,
    password: process.env.GMAILPWD
  },
  bcrypt: {
    saltRounds: 10
  },
  gouvGeoAPI: {
    zipCode: "https://geo.api.gouv.fr/communes?codePostal=",
    cityName: "https://geo.api.gouv.fr/communes?nom="
  }
}