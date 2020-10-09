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

            response.json({
                success: true,
                message: 'Profile Updated.',
                data: client
            });

        } catch(error) {
            
            console.trace(error);
            response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                information: `The profile User is NOT updated.`
            });

        }
    },

    async modifyAnAppointment (request, response) {

        const { newAppointmentID, oldAappointmentID, userID, serviceID  } = request.body;

        if (!newAppointmentID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'newAppointmentID' }); };
        if (!oldAappointmentID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'oldAappointmentID' }); };
        if (!userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };
        if (!serviceID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'serviceID' }); };
        
        const newAppointmentIDD = parseInt(newAppointmentID);
        const oldAappointmentIDD = parseInt(oldAappointmentID);
        const userIDD = parseInt(userID);
        const serviceIDD = parseInt(serviceID);

        if (newAppointmentIDD<=0|| isNaN(newAppointmentIDD)) { return response.status(400).json({ message: 'newAppointmentID must be a positive number', info: 'newAppointmentID' }); };
        if (oldAappointmentIDD<=0|| isNaN(oldAappointmentIDD)) { return response.status(400).json({ message: 'oldAappointmentID must be a positive number', info: 'oldAappointmentID' }); };
        if (userIDD<=0|| isNaN(userIDD)) { return response.status(400).json({ message: 'userID must be a positive number', info: 'userID' }); };
        if (serviceIDD<=0|| isNaN(serviceIDD)) { return response.status(400).json({ message: 'serviceID must be a positive number', info: 'serviceID' }); };

        let newRdv;
        let oldRdv;
        let _oldRDV;

        try {

            // new appointment reservation
            newRdv = await Appointment.findById(newAppointmentIDD);
            newRdv.user_id = userIDD;
            newRdv.service_id = serviceIDD;
            newRdv.update();

            // old appointment back to null values
            oldRdv = await Appointment.findById(oldAappointmentIDD);
            _oldRDV = {...oldRdv}
            oldRdv.user_id = null;
            oldRdv.service_id = null;
            oldRdv.update();

            response.json({
                success: true,
                message: 'Appointment modified.',
                data: {
                    new_appointment: newRdv,
                    old_appointment: _oldRDV,
                }
            });

        } catch(error) {
            console.trace(error);
            response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                information: `The appointment is NOT modified.`
            });
        }
    },
    
    async bookAnAppointement (request, response) {

        const { id, user_id, service_id } = request.body;

        if (!id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'id (appointment id)' }); };
        if (!user_id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };
        // if (!service_id) { return response.status(400).json({ message: 'missing_required_parameter', info: 'serviceID' }); };

        appointment_idd = parseInt(id);
        user_idd = parseInt(user_id);
        // service_idd = parseInt(service_id);

        if (appointment_idd<=0|| isNaN(appointment_idd)) { return response.status(400).json({ message: 'appointment_id must be a positive number', info: 'appointment_id' }); };
        if (user_idd<=0|| isNaN(user_idd)) { return response.status(400).json({ message: 'user_id must be a positive number', info: 'user_id' }); };
        // if (service_idd<=0|| isNaN(service_idd)) { return response.status(400).json({ message: 'service_id must be a positive number', info: 'service_id' }); };
        
        let appointment;

        try {

            appointment = await Appointment.findById(id);

            for (const key of Object.keys(request.body)) {
                if (key !== "id"|| /*FIXME: Temporary mod for front*/key !== "service_id") {
                    appointment[key] = request.body[key];
                };
            }

            appointment.update();

            response.json({
                success: true,
                message: 'Appointment correctly booked',
                data: appointment
            });

        } catch(error) {

            console.trace(error);

            response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                information: `The appointment ${request.body.id} is not booked.`
            });
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
                data: appointment
            });

        } catch(error) {
            console.trace(error);
            response.status(500).json({
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

            response.json({
                success: true,
                message: 'Available appointment(s) correctly inserted',
                data:{
                    shop, 
                    availableAppointments
                }
            });

        } catch (error) {
            console.trace(error);
            response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error
            });
        }
    }
}