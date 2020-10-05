const Shop = require('../models/Shop');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Role = require('../models/Role');
const { number } = require('joi');
const { getShopServices } = require('../models/Service');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

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
        if (isNaN(proId)||proId<=0||typeof proId !== 'number') { return response.status(400).json({ message: 'ShopID must be a positive number', info: 'id' }); };
        
        
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
        const { first_name, last_name, phone_number, birth, mail, mail_confirm, password, password_confirm, role_id } = request.body;
        let shop_name, opening_time, address_name, address_number, city, postal_code;

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

            if (!shop_name) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shop_name' }); };
            if (!opening_time) { return response.status(400).json({ message: 'missing_required_parameter', info: 'opening_time' }); };
            if (!address_name) { return response.status(400).json({ message: 'missing_required_parameter', info: 'address_name' }); };
            if (!address_number) { return response.status(400).json({ message: 'missing_required_parameter', info: 'address_number' }); };
            if (!city) { return response.status(400).json({ message: 'missing_required_parameter', info: 'city' }); };
            if (!postal_code) { return response.status(400).json({ message: 'missing_required_parameter', info: 'postal_code' }); };

        }

        const _shop = {}

        if(request.body.shop) {

            _shop.shop_name = request.body.shop.shop_name;
            _shop.opening_time = request.body.shop.opening_time;
            _shop.address_name = request.body.shop.address_name;
            _shop.address_number = request.body.shop.address_number;
            _shop.city = request.body.shop.city;
            _shop.postal_code = request.body.shop.postal_code;
           
        }
        const saltRounds = 10;
        let newUser;

        try {

            const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
            const hash = bcrypt.hashSync(password, saltRounds);

            if (passwordRegex.test(password)) {
                if (password === password_confirm && mail === mail_confirm) {
                    newUser = new User({first_name, last_name, phone_number, birth, mail, password: hash, role_id});
                    await newUser.insert();
                } else if (password !== password_confirm) {
                    return response.json(`Your password could not be checked.`);
                } else if (mail !== mail_confirm) {
                    return response.json(`Your mail address could not be checked.`)
                }
            } else if (!passwordRegex.test(password)) {
                return response.json(`Your password must contain at least one lowercase letter, one uppercase letter, one digit and be composed of minimum 6 characters.`);
            }

            if(newUser.role_id === 2) {
                newShop = new Shop({ 
                    shop_name: _shop.shop_name,
                    opening_time: _shop.opening_time,
                    address_name: _shop.address_name,
                    address_number: _shop.address_number,
                    city: _shop.city,
                    postal_code: _shop.postal_code
                });

                await newShop.insert();

                await newUser.ownShop(newShop);
            }

        } catch(error) {

            console.trace(error);
            response.status(404).json(`New user could not have been created.`);

        }

        response.json(newUser);
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

        } catch (error) {

            console.log(error);    

        }

        response.json('Logged in.')

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