const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Shop = require('../models/Shop');

module.exports = {

    async getProfile (request, response) {

        const { userID } = request.body

        let client;
        let upcomingAppointment;
        let historyAppointment;

        try {

            if (!userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };

            client = await User.findById(userID);
            upcomingAppointment = await Appointment.getUpcomingUserAppointment(userID);
            historyAppointment = await Appointment.getHistoryUserAppointments(userID)

        } catch(error) {

            console.trace(error);
            response.status(404).json(`No user found for id ${userID}.`);

        }

        response.json({ ...client, upcomingAppointment, historyAppointment });
    },

    async updateProfile (request, response) {

        let client;

        try {

            if (!request.body.userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };

            client = await User.findById(request.body.userID);

            for (const key of Object.keys(request.body)) {
                if (key !== "userID") {
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

        const { appointment_id, user_id, service_id } = request.body;

        if (!appointment_id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'appointment_id' }); };
        if (!user_id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };
        if (!service_id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'serviceID' }); };

        if (isNaN(appointment_id)||appointment_id<0||typeof appointment_id !== 'number') { return response.status(400).json({ message: 'appointment_id must be a positive number', info: 'appointment_id' }); };
        if (isNaN(user_id)||user_id<0||typeof user_id !== 'number') { return response.status(400).json({ message: 'userID must be a positive number', info: 'userID' }); };
        if (isNaN(service_id)||service_id<0||typeof service_id !== 'number') { return response.status(400).json({ message: 'serviceID must be a positive number', info: 'serviceID' }); };
        
        let rdv;

        try {

            rdv = await Appointment.findById(appointment_id);

            for (const key of Object.keys(request.body)) {
                if (key !== "appointment_id") {
                    rdv[key] = request.body[key];
                };

            }

            rdv.update();

        } catch(error) {

            console.trace(error);
            response.status(404).json(`Can not book`)

        }

        response.json(rdv);
    },

    async cancelAppointment(request, response) {

        let appointment;

        try {
            appointment = await Appointment.findById(request.body.id);

            appointment.user_id = null;
            appointment.service_id = null;

            appointment.update();

            response.json({
                success: true,
                message: 'Appointment correctly cancelled',
                appointment
            });

        } catch(error) {
            console.trace(error);
            return response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                information: `The appointment ${request.body.id} couldn't have been cancelled.`
            });
        }
    },

    async getShopPage(request, response) {

        const { dateStart, dateEnd, shopID } = request.body;

        if (!dateStart) { return response.status(400).json({ message: 'missing_required_parameter', info: 'dateStart' }); };
        if (!dateEnd) {  dateEnd = dateStart; };
        if (!shopID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };

        let availableAppointments;
        let shop;

        try {
            shop = await Shop.findById(shopID);
            availableAppointments = await Appointment.getAppointmentsClient(dateStart, dateEnd, shopID);

            response.json({shop, availableAppointments});

        } catch (error) {
            console.trace(error);
            return response.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

}