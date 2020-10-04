const Appointment = require('../models/Appointment');
const User = require('../models/User');

module.exports = {

    async getProfile (request, response) {

        let client;

        try {
    
            if (!request.body.userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };

            client = await User.findById(request.body.userID);

        } catch(error) {

            console.trace(error);
            response.status(404).json(`No user found for id ${request.params.userID}.`);

        }

        response.json(client);
    },

    async updateProfile (request, response) {

        let client;

        try {

            if (!request.body.userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };

            client = await User.findById(request.body.userID);

            for (const key of Object.keys(request.body)) {
                if (key !== "id") {
                    client[key] = request.body[key];
                };

            }
        } catch(error) {
            
            console.trace(error);
            response.status(404).json(`Could not find user with id ${request.body.userID};`)
        }

        client.update();

        response.json(client);
    },

    async bookAnAppointement (request, response) {

        const { appointmentID, userID, serviceID } = request.body;
        
        if (!appointmentID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'appointmentID' }); };
        if (!userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };
        if (!serviceID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'serviceID' }); };

        if (isNaN(appointmentID)||appointmentID<0||typeof appointmentID !== number) { return response.status(400).json({ message: 'appointmentID must be a positive number', info: 'appointmentID' }); };
        if (isNaN(userID)||userID<0||typeof userID !== number) { return response.status(400).json({ message: 'userID must be a positive number', info: 'userID' }); };
        if (isNaN(serviceID)||serviceID<0||typeof serviceID !== number) { return response.status(400).json({ message: 'serviceID must be a positive number', info: 'serviceID' }); };
        
        let rdv;

        try {

            rdv = await Appointment.findById(appointmentID);

            for (const key of Object.keys(request.body)) {
                if (key !== "id") {
                    rdv[key] = request.body[key];
                };

            }

            rdv.update();

        } catch(error) {

            console.trace(error);
            response.status(404).json(`Can not book`)

        }

        response.json(pro);
    },


}