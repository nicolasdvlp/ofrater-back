const { Role, User, Shop, Service, Appointment } = require('../models/');
const sendmail = require('../mailer/mailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { getlength } = require('../modules/mainModule');
const { Console } = require('console');
const config = require('./../../config')

module.exports = {
  // Route "/mainsearch"
  async findCityOrZip(request, response) {
    try {

      let { input } = request.body
      let city = [];

      if (!isNaN(parseInt(input)) && getlength(input) === 5) { //if it's a number

        await fetch(`${config.gouvGeoAPI.zipCode}${parseInt(input)}`)
          .then(res => res.json())
          .then((json) => {
            if (json)
              json.forEach(ville => { city.push({ city: ville.nom, cp: ville.codesPostaux[0] }) });
          })

      } else {

        await fetch(`${config.gouvGeoAPI.cityName}${input}`)
          .then(res => res.json())
          .then((json) => {
            if (json)
              json.forEach(ville => { city.push({ city: ville.nom, cp: ville.codesPostaux[0] }) });
          });

      }

      response.json({
        message: 'City found',
        number_result: city.length,
        data: city
      });

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        error: {
          message: 'Internal Server Error',
          error
        }
      });

    }
  },

  // Route "/searchProByLocation"
  async findProByLocation(request, response) {
    try {

      let { input } = request.body
      let longitude, latitude;
      let findedPros = [];
      let city = [];

      if (!isNaN(parseInt(input)) && getlength(parseInt(input)) === 5) { //if it's a number

        await fetch(`${config.gouvGeoAPI.zipCode}${parseInt(input)}`)
          .then(res => res.json())
          .then((json) => {
            if (!!json) {
              json.forEach(ville => { city.push({ city: ville.nom, cp: ville.codesPostaux[0] }) });
            }
          })

      } else {

        await fetch(`${config.gouvGeoAPI.cityName}${input}`)
          .then(res => res.json())
          .then((json) => {
            if (!!json) {
              json.forEach(ville => { city.push({ city: ville.nom, cp: ville.codesPostaux[0] }) });
            }
          });

      }

      if (city[0].cp) {

        await fetch(`https://api-adresse.data.gouv.fr/search/?q=${city[0].cp}`)
          .then(res => res.json())
          .then((json) => {
            if (!!json && !!json.features) {
              [latitude, longitude] = json.features[0].geometry.coordinates
            }
          });

        if (!latitude || !longitude)
          return response.status(400).json({ success: false, message: 'geocode from city not found', info: 'zipOrCity' });

        findedPros = await Shop.findNearest(longitude, latitude);

        return response.json({
          message: 'Shop founded',
          number_result: findedPros.length,
          data: findedPros
        });

      }

      response.json({
        message: 'Shop founded',
        number_result: findedPros.length,
        data: findedPros
      });

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });

    }
  },

  async getProDetailsById(request, response) {

    const { id } = request.body;
    let pro, category, service;

    try {

      pro = await Shop.findById(id);
      category = await Role.findShopCategories(id);
      service = await Service.getShopServices(id);

      response.json({ ...pro, category, service });

    } catch (error) {

      console.trace(error);
      response.status(404).json(`No professional found for id ${id}.`)

    }
  },

  async getShopPage(request, response) {
    try {

      const { dateStart, dateEnd = dateStart, shopId } = request.body;
      let availableAppointments, shop;

      shop = await Shop.findById(shopId);
      if (shop)
        availableAppointments = await Appointment.getAppointmentsClient(dateStart, dateEnd, shopId);

      response.json({
        message: 'Shop found',
        data: { shop, availableAppointments }
      });

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });

    }
  },

  async register(request, response) {
    try {


      let { first_name, last_name, phone_number, birth, mail, password, role_id } = request.body;
      let shop_name, opening_time, address_name, address_number, city, postal_code, latitude, longitude;
      let newUser, newShop;
      let data = {};
      const hash = bcrypt.hashSync(password, config.bcrypt.saltRounds);

      if (request.body.shop) {

        shop_name = request.body.shop.shop_name;
        opening_time = request.body.shop.opening_time;
        address_name = request.body.shop.address_name;
        address_number = request.body.shop.address_number;
        city = request.body.shop.city;
        postal_code = request.body.shop.postal_code;
        latitude = request.body.shop.latitude;
        longitude = request.body.shop.longitude;

      }

      let isInDatabase = await User.findByMail(mail);
      if (isInDatabase)
        return response.status(400).json({ success: false, message: `User already in database with this email : ${mail}`, info: 'mail' });

      newUser = new User({ first_name, last_name, phone_number, birth, mail, password: hash, role_id, is_validated: false });
      await newUser.insert();

      if (newUser.role_id === 2) {

        const adressToGeo = [
          address_number,
          address_name.split(' ').join('+'),
          postal_code,
          city.split('-').join('+').split(' ').join('+')
        ].join('+').toLowerCase();

        await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adressToGeo}`)
          .then(res => res.json())
          .then((json) => { if (!!json.features.length) { return [longitude, latitude] = json.features[0].geometry.coordinates } });

        newShop = new Shop({
          shop_name, opening_time,
          address_name, address_number,
          city, postal_code,
          geo: `point(${latitude} ${longitude})`
        });
        await newShop.insert();
        await newUser.ownShop(newShop);
      }

      data.user = newUser;
      !!newShop ? data.shop = newShop : null;

      // Creation of a unique string that will be sent to the new user for user activation email
      const buffer = crypto.randomBytes(50);
      const bufferString = buffer.toString('hex');

      // Storage of this unique string in db
      newUser.account_validation_crypto = bufferString;
      newUser.update();

      // Send email containing the previous string to the new user for account verification
      sendmail(newUser.mail, bufferString);

      response.json({
        message: 'User (and Shop) correctly created',
        data
      });

    } catch (error) {
      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });
    }
  },

  // Method to collect the crypto from the link the user clicked on and compare it with the one in DB
  // if the comparison is ok, the user is verified and updated in DB
  async checkEmail(request, response) {
    try {

      const userToValidate = await User.findByAccountValidationCrypto(request.params.validationKey);

      if (userToValidate) {
        userToValidate.is_validated = true;
        userToValidate.account_validation_crypto = "";
        userToValidate.update();
        return response.json({
          message: 'Account validated.'
        });
      }

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'The account could not be validated.',
        error
      });

    }
  },

  async postLogin(request, response) {
    try {

      const { mail, password } = request.body
      let owned_shop;

      let userToConnect = await User.findByMail(mail);

      if (!userToConnect)
        return response.status(404).json({ success: false, message: `No user found for email ${mail}.`, info: 'mail' })

      if (userToConnect.role_id === 2)
        owned_shop = await Shop.ownedByUser(userToConnect.id);

      if (await bcrypt.compare(password, userToConnect.password)) {
        request.session.user = userToConnect;
        return response.json({
          message: 'User logged in',
          data: { ...userToConnect, owned_shop }
        });
      };

      response.status(401).json({ success: false, message: 'Impossible to log in. Wrong password.' })

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });

    }
  },

  async logout(req, res) {
    try {

      await req.session.destroy();
      res.json('User logged out.');

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });

    }
  },

  async getShopServices(request, response) {
    try {

      const { id } = request.body;
      let services;

      services = await Service.getShopServices(id);

      response.json({
        data: services
      });

    } catch (error) {

      console.trace(error);
      response.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error
      });

    }
  }
}