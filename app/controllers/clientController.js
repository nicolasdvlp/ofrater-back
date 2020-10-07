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

            response.json({ ...client, upcomingAppointment, historyAppointment });

        } catch(error) {

            console.trace(error);
            response.status(404).json(`No user found for id ${userID}.`);

        }
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

            client.update();

            response.json('Profile Updated');

        } catch(error) {
            
            console.trace(error);
            response.status(404).json(`Could not find user with id ${request.body.userID};`)

        }
    },

    async modifyAnAppointment (request, response) {

        const { newAppointmentID, oldAappointmentID, userID, serviceID  } = request.body;

        if (!newAppointmentID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'newAppointmentID' }); };
        if (!oldAappointmentID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'oldAappointmentID' }); };
        if (!userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };
        if (!serviceID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'serviceID' }); };
        if (isNaN(newAppointmentID)||newAppointmentID<=0||typeof newAppointmentID !== 'number') { return response.status(400).json({ message: 'newAppointmentID must be a positive number', info: 'newAppointmentID' }); };
        if (isNaN(oldAappointmentID)||oldAappointmentID<=0||typeof oldAappointmentID !== 'number') { return response.status(400).json({ message: 'oldAappointmentID must be a positive number', info: 'oldAappointmentID' }); };
        if (isNaN(userID)||userID<=0||typeof userID !== 'number') { return response.status(400).json({ message: 'userID must be a positive number', info: 'userID' }); };
        if (isNaN(serviceID)||serviceID<=0||typeof serviceID !== 'number') { return response.status(400).json({ message: 'serviceID must be a positive number', info: 'serviceID' }); };

        let newRdv;
        let oldRdv;

        try {

            // new appointment reservation
            newRdv = await Appointment.findById(newAppointmentID);

            newRdv.user_id = userID;
            newRdv.service_id = ServiceID;

            newRdv.update();

            // old appointment back to null values
            oldRdv = await Appointment.findById(oldAappointmentID);

            rdv.user_id = null;
            rdv.service_id = null;
            
            oldRdv.update();

            response.json('Appointment modified.');

        } catch(error) {

            console.trace(error);
            response.status(404).json(`Appointment NOT modified.`)

        }
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

            response.json(rdv);

        } catch(error) {

            console.trace(error);
            response.status(404).json(`Can not book`)

        }
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