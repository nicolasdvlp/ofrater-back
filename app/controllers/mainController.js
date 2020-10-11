const Shop = require('../models/Shop');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const { number } = require('joi');
const { getShopServices } = require('../models/Service');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const sendmail = require('../mailer/mailer');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { getlength } = require('../modules/mainModule')

module.exports = {

    error404(_, response) {
        response
            .status(404)
            .json('Page not found');
    },
    
    // Route "/mainsearch"
    async findCityOrZip(request, response) {
        
        try {

            const { input } = request.body
            const _input = parseInt(input)
            let city = [];

            if(!isNaN(_input) && getlength(_input) === 5 ) { //if it's a number

                await fetch(`https://geo.api.gouv.fr/communes?codePostal=${_input}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json){ 
                        json.forEach(ville => {city.push({ city: ville.nom, cp: ville.codesPostaux[0] })});
                    }})
            } else {

                await fetch(`https://geo.api.gouv.fr/communes?nom=${input}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json){ 
                        json.forEach(ville => {city.push({ city: ville.nom, cp: ville.codesPostaux[0] })});
                    }});

            }
            response.json({
                success: true,
                message: 'City found',
                number_result: city.length,
                data: city
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
    
    // Route "/searchProByLocation"
    async findProByLocation(request, response) {
        try {
        
            const { zipOrCity } = request.body
            console.log(zipOrCity);
            const _zipOrCity = parseInt(zipOrCity)
            let longitude, latitude;
            let coordonates = [];
            let city = [];

            let findedPros;

            if (!zipOrCity) { return response.status(400).json({ message: 'missing_required_parameter', info: 'zipOrCity' }); };

            if(!isNaN(_zipOrCity) && getlength(_zipOrCity) === 5 ) { //if it's a number

                await fetch(`https://geo.api.gouv.fr/communes?codePostal=${_zipOrCity}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json){ 
                        json.forEach(ville => {city.push({ city: ville.nom, cp: ville.codesPostaux[0] })});
                    }})
            } else {

                await fetch(`https://geo.api.gouv.fr/communes?nom=${zipOrCity}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json){ 
                        json.forEach(ville => {city.push({ city: ville.nom, cp: ville.codesPostaux[0] })});
                    }});
            }

            await  fetch(`https://api-adresse.data.gouv.fr/search/?q=${city[0].cp}`)
                .then(res => res.json())
                .then((json) => {if(!!json && !!json.features){ 
                [latitude, longitude] = json.features[0].geometry.coordinates }});
                
            if(!latitude || !longitude) {return response.status(400).json({ message: 'geocode from city not found', info: 'zipOrCity' });}
            findedPros = await Shop.findNearest(longitude, latitude);

            response.json({
                success: true,
                message: 'Shop founded',
                number_result: findedPros.length,
                data: findedPros
            });
       
        } catch (error) {

            console.trace(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error
            });
        }
    },

    async findOnePro(request, response) {
        
        const proId = parseInt(request.body.id);
        
        if (!request.body.id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'id' }); };
        if (proId<=0|| isNaN(proId)) { return response.status(400).json({ message: 'ShopID must be a positive number', info: 'id' }); };
        
        let pro;
        let category;
        let service;

        try {
            pro = await Shop.findById(proId);
            category = await Role.findShopCategories(proId);
            service = await Service.getShopServices(proId);
            
        } catch(error) {
            console.trace(error);
            response.status(404).json(`No professional found for id ${proId}.`)
        }

        response.json({...pro, category, service});
    },

    async register(request, response) {

        let newUser;

        try {

            let { first_name, last_name, phone_number, birth, mail, mail_confirm, password, password_confirm, role_id} = request.body;
            let shop_name, opening_time, address_name, address_number, city, postal_code, latitude, longitude, coordonates;
            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
            const saltRounds = 10;
            const hash = bcrypt.hashSync(password, saltRounds);

            if (!first_name) { return response.status(400).json({ message: 'missing_required_parameter', info: 'first_name' }); };
            if (!last_name) { return response.status(400).json({ message: 'missing_required_parameter', info: 'last_name' }); };
            if (!phone_number) { return response.status(400).json({ message: 'missing_required_parameter', info: 'phone_number' }); };
            if (!birth) { return response.status(400).json({ message: 'missing_required_parameter', info: 'birth' }); };
            if (!mail) { return response.status(400).json({ message: 'missing_required_parameter', info: 'mail' }); };
            if (!mail_confirm) { return response.status(400).json({ message: 'missing_required_parameter', info: 'mail_confirm' }); };
            if (!password) { return response.status(400).json({ message: 'missing_required_parameter', info: 'password' }); };
            if (!password_confirm) { return response.status(400).json({ message: 'missing_required_parameter', info: 'password_confirm' }); };
            if (!role_id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'role_id' }); };
    
            if (request.body.shop) {

                shop_name = request.body.shop.shop_name;
                opening_time = request.body.shop.opening_time;
                address_name = request.body.shop.address_name;
                address_number = request.body.shop.address_number;
                city = request.body.shop.city;
                postal_code = request.body.shop.postal_code;
                latitude = request.body.shop.latitude;
                longitude = request.body.shop.longitude;
                coordonates = request.body.shop.coordonates;

                if (!shop_name) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shop_name' }); };
                if (!opening_time) { return response.status(400).json({ message: 'missing_required_parameter', info: 'opening_time' }); };
                if (!address_name) { return response.status(400).json({ message: 'missing_required_parameter', info: 'address_name' }); };
                if (!address_number) { return response.status(400).json({ message: 'missing_required_parameter', info: 'address_number' }); };
                if (!city) { return response.status(400).json({ message: 'missing_required_parameter', info: 'city' }); };
                if (!postal_code) { return response.status(400).json({ message: 'missing_required_parameter', info: 'postal_code' }); };

            }

            if (!passwordRegex.test(password)) { return response.status(400).json({ message: 'Your password must contain at least one lowercase letter, one uppercase letter, one digit and be composed of minimum 6 characters.', info: 'password'});};
            if (password !== password_confirm) { return response.status(400).json({ message: 'The two passwords are different', info: 'password' }); };
            if (mail !== mail_confirm) { return response.status(400).json({ message: 'The two mails are different', info: 'mail' }); };

            const isInDatabase = await User.findByMail(mail);

            if(!!isInDatabase) { return response.status(400).json({ message: `User already in database with this email : ${mail}`, info: 'mail'});};

            newUser = new User({first_name, last_name, phone_number, birth, mail, password: hash, role_id, is_validated: false});
            await newUser.insert();

            let newShop;

            if(newUser.role_id === 2) {

                const adressToGeo = [address_number, address_name.split(' ').join('+'), postal_code, city.split('-').join('+').split(' ').join('+')].join('+').toLowerCase();
                await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adressToGeo}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json.features.length){ return coordonates = json.features[0].geometry.coordinates }});
    
                !!coordonates.length?[longitude, latitude] = coordonates:null;

                newShop = new Shop({ 
                    shop_name, opening_time,
                    address_name, address_number,
                    city, postal_code,
                    geo: `point(${latitude} ${longitude})`
                });
                await newShop.insert();
                await newUser.ownShop(newShop);
            }

            let data = {};
            data.user = newUser;
            !!newShop?data.shop=newShop:null;

            // Creation of a unique string that will be sent to the new user for user activation email
            const buffer = crypto.randomBytes(50);
            const bufferString = buffer.toString('hex');

            // Storage of this unique string in db
            newUser.account_validation_crypto = bufferString;
            newUser.update();

            // Send email containing the previous string to the new user for account verification
            sendmail(newUser.mail, bufferString);

            response.json({
                success: true,
                message: 'User (and Shop) correctly created',
                data
            });

        } catch(error) {

            console.trace(error);
            response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error
            });

        }
    },

    // Method to collect the crypto from the link the user clicked on and compare it with the one in BDD
    // if the comparison is ok, the user is verified
    async checkEmail(request, response) {

        try {
            const userToValidate = await User.findByAccountValidationCrypto(request.params.crypto);

            if (userToValidate) {
                userToValidate.is_validated = true;
                userToValidate.update();
                response.json(userToValidate);
            }
        } catch (error) {
            console.trace(error);
            response.json('The account could not have been validated.');
        }
    },

    async postLogin(request, response) {

        const { mail, password } = request.body

        if (!mail) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shop_name' }); };
        if (!password) { return response.status(400).json({ message: 'missing_required_parameter', info: 'password' }); };

        try {

            const userToConnect = await User.findByMail(mail);
            if(await bcrypt.compare(password, userToConnect.password)) {
                request.session.user = userToConnect;
            }

            response.json(userToConnect)

        } catch (error) {

            console.log(error);    

        }
    },

    async signout(req, res) {

        try {
            await req.session.destroy();

        } catch (error) {
            console.log(error);    
        }

        res.json('User logged out.');
    },

    async getShopServices(req, res) {

        const { shopID } = req.body;
        let services = [];
        if (!shopID) { return res.status(400).json({ message: 'missing_required_parameter', info: 'shopID' }); };
        
        try {

            services = await Service.getShopServices(shopID);

        } catch (error) {

            console.log(error);    
        }

        res.json(services)
    }

}