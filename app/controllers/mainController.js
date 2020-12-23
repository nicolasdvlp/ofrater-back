const { Role, User, Shop, Service, Appointment } = require('../models/');
const sendmail = require('../mailer/mailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { getlength } = require('../modules/mainModule')

module.exports = {

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
            const _zipOrCity = parseInt(zipOrCity)
            let longitude, latitude;
            let findedPros = [];
            let city = [];

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

            if (!!city[0].cp) {
                await  fetch(`https://api-adresse.data.gouv.fr/search/?q=${city[0].cp}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json && !!json.features){ 
                    [latitude, longitude] = json.features[0].geometry.coordinates }});
                    
                if(!latitude || !longitude) {return response.status(400).json({ success: false, message: 'geocode from city not found', info: 'zipOrCity' });}
                
                findedPros = await Shop.findNearest(longitude, latitude);

                return response.json({
                    success: true,
                    message: 'Shop founded',
                    number_result: findedPros.length,
                    data: findedPros
                });

            }

            response.json({
                success: true,
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
        
        const proId = parseInt(request.body.shopId);
        let pro, category, service;
        
        if (!request.body.id) { return response.status(400).json({ success: false, message: 'missing_required_parameter', info: 'id' }); };
        if (proId<=0|| isNaN(proId)) { return response.status(400).json({ success: false, message: 'ShopId must be a positive number', info: 'id' }); };

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
    
    async getShopPage(request, response) {

        const { dateStart, dateEnd, shopId } = request.body;

        let _dateEnd, availableAppointments, shop;

        !!dateEnd ? _dateEnd = dateEnd : _dateEnd = dateStart ;

        try {
            shop = await Shop.findById(shopId);
            availableAppointments = await Appointment.getAppointmentsClient(dateStart, _dateEnd, shopId);

            if(!shop) {
                return response.json({
                    success: false,
                    message: `No shop found with id ${shopId}`,
                    data:{}
                });
            };

            response.json({
                success: true,
                message: 'Shop found',
                data:{
                    shop, 
                    availableAppointments
                }
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

        let newUser;

        try {

            let { first_name, last_name, phone_number, birth, mail, password, role_id } = request.body;
            let shop_name, opening_time, address_name, address_number, city, postal_code, latitude, longitude ;
            let data = {} ;
            let newShop ;
            const saltRounds = 10 ;
            const hash = bcrypt.hashSync(password, saltRounds) ;
    
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

            const isInDatabase = await User.findByMail(mail);

            if(!!isInDatabase) { return response.status(400).json({ success: false, message: `User already in database with this email : ${mail}`, info: 'mail'});};

            newUser = new User({first_name, last_name, phone_number, birth, mail, password: hash, role_id, is_validated: false});
            await newUser.insert();

            if(newUser.role_id === 2) {

                const adressToGeo = [address_number, address_name.split(' ').join('+'), postal_code, city.split('-').join('+').split(' ').join('+')].join('+').toLowerCase();
                await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adressToGeo}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json.features.length){ return [longitude, latitude] = json.features[0].geometry.coordinates }});
    
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
                return response.json({success: true, message: 'Account validated.'});
            } else {
                return response.status(500).json({success: false, message: 'The account could not be validated.'});
            }
        } catch (error) {

            console.trace(error);
            response.status(500).json('The account could not have been validated.');
            
        }
    },

    async postLogin(request, response) {

        const { mail, password } = request.body
        let shop, _shop;

        try {
            
            const userToConnect = await User.findByMail(mail);

            if(!userToConnect) {return response.status(404).json({message: `No user found for email ${mail}.`, info: 'mail'})};

            if(userToConnect.role_id === 2) {
                shop = await Shop.ownedByUser(userToConnect.id);
            };

            !!shop ? _shop = shop : null ;

            if(await bcrypt.compare(password, userToConnect.password)) {
                request.session.user = userToConnect;
                return response.json({success: true, message: 'User logged in', data: userToConnect, owned_shop: _shop});
            }

            response.status(401).json({success: false, message: 'Impossible to log in. Wrong password.'})

        } catch (error) {

            console.log(error);    

        }
    },

    async logout(req, res) {

        try {
            await req.session.destroy();

        } catch (error) {
            console.log(error);    
        }

        res.json('User logged out.');
    },

    async getShopServices(req, res) {

        const { shopId } = req.body;
        let services = [];
        
        try {

            services = await Service.getShopServices(shopId);

            res.json(services)


        } catch (error) {

            console.log(error);    
        }

    }

}