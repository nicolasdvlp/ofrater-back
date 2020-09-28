const Shop = require('../models/Shop');
const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {

    error404(_, response) {
        response
            .status(404)
            .json('Page not found');
    },
    
    // Route "/mainsearch"
    async findCityOrZip(request, response) {

        try {
            const searchedShops = await Shop.findShopByCity(request.body.input);
        } catch (error) {
            console.log(error);
            response.status(404).json(`No professional found for location : ${request.body.zipOrCity}.`)
        }
        response.json(searchedShops);
    },
    
    // Route "/searchProByLocation"
    async findProByLocation(request, response) {
        
        let findedPros;

        try {
            findedPros = await Shop.findShopByCity(request.body.zipOrCity);
        } catch (error) {
            console.log(error);
            response.status(404).json(`No professional found for location : ${request.body.zipOrCity}.`)
        }
        response.json(findedPros);
    },

    async findOnePro(request, response) {
        const proId = request.body.id;
        let pro;

        try {
            pro = await Shop.findById(proId);
            
        } catch(error) {
            console.trace(error);
            response.status(404).json(`No professional found for id ${proId}.`)
        }

        response.json(pro);
    },

    async register(request, response) {
        const {first_name, last_name, phone_number, birth, mail, password, role_id} = request.body;
        console.log(request.body.shop);

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

            const hash = bcrypt.hashSync(password, saltRounds);

            newUser = new User({first_name, last_name, phone_number, birth, mail, password: hash, role_id});
            newUser.save();

            if(newUser.role_id === 2) {
                newShop = new Shop({ 
                    shop_name: _shop.shop_name,
                    opening_time: _shop.opening_time,
                    address_name: _shop.address_name,
                    address_number: _shop.address_number,
                    city: _shop.city,
                    postal_code: _shop.postal_code
                });

                newShop.save();
            }



        } catch(error) {
            console.trace(error);
            response.status(404).json(`New user could not have been created.`);
        }

        response.json(newUser);
    },

    async postLogin(request, response) {

    }
}