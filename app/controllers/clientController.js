const User = require('../models/User');

module.exports = {

    async updateProfile (request, response) {

        let client;

        try {
            client = await User.findById(request.body.id);

            for (const key of Object.keys(request.body)) {
                if (key !== "id") {
                    client[key] = request.body[key];
                };

            }
        } catch(error) {
            console.trace(error);
            response.status(404).json(`Could not find user with id ${request.body.id};`)
        }

        client.update();

        response.json(client);
    }

}