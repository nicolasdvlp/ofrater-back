const Shop = require('../models/Shop');

module.exports = {
    
    // Route "/mainsearch"
    async findShopByCity(request, response) {
        const searchedShops = await Shop.findShopByCity(request.body.input);
        response.json(searchedShops);
    }
}