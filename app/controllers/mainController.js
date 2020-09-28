const Shop = require('../models/Shop');

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
            response.status(404).json(`No professionnal found for location : ${request.body.zipOrCity}.`)
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
            response.status(404).json(`No professionnal found for location : ${request.body.zipOrCity}.`)
        }
        response.json(findedPros);
    },

    async findOnePro(request, response) {
        const proId = await request.body.id;
        let pro;

        try {
            pro = await Shop.findById(proId);
            
        } catch(error) {
            console.trace(error);
            response.status(404).json(`No professionnal found for id ${proId}.`)
        }

        response.json(pro);
    }
}