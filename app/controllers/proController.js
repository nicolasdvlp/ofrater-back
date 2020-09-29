const User = require('../models/User');

module.exports = {

    async getProfile (request, response) {

        let pro;

        try {
            pro = await User.findById(request.params.id);
        } catch(error) {
            console.trace(error);
            response.status(404).json(`No user found for id ${request.params.id}.`);
        }

        response.json(pro);
    },

    async updateProfile (request, response) {

        let pro;

        try {
            pro = await User.findById(request.body.id);

            for (const key of Object.keys(request.body)) {
                if (key !== "id") {
                    pro[key] = request.body[key];
                };

            }
        } catch(error) {
            console.trace(error);
            response.status(404).json(`Could not find user with id ${request.body.id};`)
        }

        pro.update();

        response.json(pro);
    }

}