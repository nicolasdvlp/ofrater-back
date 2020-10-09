const Shop = require('../models/Shop');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const { number } = require('joi');
const { getShopServices } = require('../models/Service');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const fetch = require('node-fetch');

module.exports = {

    error404(_, response) {
        response
            .status(404)
            .json('Page not found');
    },
    
    // Route "/mainsearch"
    async findCityOrZip(request, response) {

        let searchedShops;

        try {
            searchedShops = await Shop.findShopByCity(request.body.input);
        } catch (error) {
            console.log(error);
            response.status(404).json(`No professional found for location : ${request.body.zipOrCity}.`)
        }
        response.json(searchedShops);
    },
    
    // Route "/searchProByLocation"
    async findProByLocation(request, response) {
        
        const { zipOrCity } = request.body
        let findedPros;

        if (!zipOrCity) { return response.status(400).json({ message: 'missing_required_parameter', info: 'zipOrCity' }); };

        try {
            findedPros = await Shop.findShopByCity(zipOrCity);
        } catch (error) {
            console.log(error);
            response.status(404).json(`No professional found for location : ${zipOrCity}.`)
        }
        response.json(findedPros);
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

            let { first_name, last_name, phone_number, birth, mail, mail_confirm, password, password_confirm, role_id } = request.body;
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

            newUser = new User({first_name, last_name, phone_number, birth, mail, password: hash, role_id});
            await newUser.insert();

            if(newUser.role_id === 2) {

                const adressToGeo = [address_number, address_name.split(' ').join('+'), postal_code, city.split('-').join('+').split(' ').join('+')].join('+').toLowerCase();
                await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adressToGeo}`)
                    .then(res => res.json())
                    .then((json) => {if(!!json.features[0].geometry.coordinates){ return coordonates = json.features[0].geometry.coordinates }});
    
                [longitude, latitude] = coordonates;

                newShop = new Shop({ 
                    shop_name, opening_time,
                    address_name, address_number,
                    city, postal_code,
                    latitude: latitude,
                    longitude: longitude
                });
                await newShop.insert();
                await newUser.ownShop(newShop);
            }

            let data = {};
            data.user = newUser;
            !!newShop?data.shop=newShop:null;

            response.json({
                success: true,
                message: 'User (and Shop) correctly created',
                data
            });

        } catch(error) {

            console.trace(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error
            });

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