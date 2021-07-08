"use strict";

const { Role, User, Shop, Service, Appointment, Category } = require('../models/'),
  { getCitysAndZips, getGPSCoordinates } = require('./../modules/locationModule'),
  config = require('./../../config'),
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  sendmail = require('../mailer/mailer');

module.exports = {
  // Route "/maininputsearch"
  async findCityOrZip(request, response) {
    try {
      await getCitysAndZips(request.body.input, (res) => { response.json(res) })
    } catch (error) {
      console.trace(error);
      response.status(500).json({ error });
    }
  },

  // Route "/searchProByLocation"
  async findProByLocation(request, response) {
    try {

      let { input } = request.body
      let latitude, longitude, pros = [];

      [latitude, longitude] = await getGPSCoordinates(input, async (input) => {
        const citys = await getCitysAndZips(input)
        return citys[0].zipCode
      })

      if (!latitude || !longitude)
        return response.status(400).json({ success: false, message: 'geocode from city not found', info: 'zipOrCity' });

      // FIXME:
      // pros = await Shop.findAll({ where: { geo: [] } }longitude, latitude);

      return response.json(pros);

    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
    }
  },

  async getProDetailsById(request, response) {

    const { id: shopId } = request.body;
    let pro, category, service;

    try {

      pro = await Shop.findByPk(shopId, { include: "services" });

      if (pro)
        [category, service] = Promise.all([
          // FIXME: Role ? Categorie ?
          Role.findShopCategories(shopId),
          Service.getShopServices(shopId),
        ])

      response.json({ ...pro, category, service });

    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
    }
  },

  async getShopPage(request, response) {
    try {

      const { dateStart, dateEnd = dateStart, id: shopId } = request.body;
      let availableAppointments, shop;

      shop = await Shop.findByPk(shopId);
      if (shop)
        availableAppointments = await Appointment.getAppointmentsClient(dateStart, dateEnd, shopId);

      response.json({
        message: 'Shop found',
        data: { shop, availableAppointments }
      });

    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
    }
  },

  async register(request, response) {
    try {

      let { first_name, last_name, phone_number, birth, mail, password, role_id } = request.body;
      let shop_name, opening_time, address_name, address_number, city, postal_code, latitude, longitude;
      let user, newShop, alreadyExist, account_validation_crypto;
      const hash = bcrypt.hashSync(password, config.bcrypt.saltRounds);

      if (!!request.body.shop) {
        shop_name = request.body.shop.shop_name;
        opening_time = request.body.shop.opening_time;
        address_name = request.body.shop.address_name;
        address_number = request.body.shop.address_number;
        city = request.body.shop.city;
        postal_code = request.body.shop.postal_code;
        latitude = request.body.shop.latitude;
        longitude = request.body.shop.longitude;
      }

      alreadyExist = await User.findByMail(mail);
      if (alreadyExist)
        return response.status(400).json({ success: false, message: `User already in database with this email : ${mail}`, info: 'mail' });

      // Generate a unique string that will be sent to the new user for user activation email
      account_validation_crypto = crypto.randomBytes(50).toString('hex');

      user = new User({ first_name, last_name, phone_number, birth, mail, password: hash, role_id, is_validated: false, account_validation_crypto });

      if (user.role_id === 2) {

        const adressToGeo = encodeURI([address_number, address_name, postal_code, city].join(' '));
        [latitude, longitude] = await getGPSCoordinates(adressToGeo)

        newShop = new Shop({
          shop_name, opening_time,
          address_name, address_number,
          city, postal_code,
          geo: `point(${latitude} ${longitude})`
        });
      }

      Promise.all([
        user.insert(),
        newShop.insert(),
        user.ownShop(newShop),
      ])

      sendmail(user.mail, account_validation_crypto);

      response.json({
        message: 'User (and Shop) correctly created',
        data: {
          user,
          ... (!!newShop && { shop: newshop })
        }
      });

    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
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
        await userToValidate.update();
        return response.json({
          message: 'Account validated.'
        });
      }

    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
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
      response.status(500).json(error);
    }
  },

  async logout(req, res) {
    try {

      await req.session.destroy();
      res.json('User logged out.');

    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
    }
  },

  async getShopServices(request, response) {
    try {
      const { id: serviceId } = request.body;
      response.json(await Service.getShopServices(serviceId));
    } catch (error) {
      console.trace(error);
      response.status(500).json(error);
    }
  }
}