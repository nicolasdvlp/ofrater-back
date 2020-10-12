const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Shop = require('../models/Shop');

module.exports = {

    async getProfile (request, response) {

        const { userID } = request.body
        let client, upcomingAppointment, historyAppointment;

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
        let newRdv, oldRdv, _oldRDV;

        if (!serviceID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'serviceID' }); };
        
        const _newAppointmentID = parseInt(newAppointmentID);
        const _oldAappointmentID = parseInt(oldAappointmentID);
        const _userID = parseInt(userID);
        const _serviceID = parseInt(serviceID);

        if (_newAppointmentID<=0|| isNaN(_newAppointmentID)) { return response.status(400).json({ message: 'newAppointmentID must be a positive number', info: 'newAppointmentID' }); };
        if (_oldAappointmentID<=0|| isNaN(_oldAappointmentID)) { return response.status(400).json({ message: 'oldAappointmentID must be a positive number', info: 'oldAappointmentID' }); };
        if (_userID<=0|| isNaN(_userID)) { return response.status(400).json({ message: 'userID must be a positive number', info: 'userID' }); };
        if (_serviceID<=0|| isNaN(_serviceID)) { return response.status(400).json({ message: 'serviceID must be a positive number', info: 'serviceID' }); };

        try {

            // new appointment reservation
            newRdv = await Appointment.findById(_newAppointmentID);
            newRdv.user_id = _userID;
            newRdv.service_id = _serviceID;
            newRdv.update();

            // old appointment back to null values
            oldRdv = await Appointment.findById(_oldAappointmentID);
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

            if(!appointment) {
                return response.json({
                    success: false,
                    message: `No Appointment found with id ${request.body.id}`,
                    data:{}
                });
            };

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

        let _dateEnd, availableAppointments, shop;

        !!dateEnd ? _dateEnd = dateEnd : _dateEnd = dateStart ;

        try {
            shop = await Shop.findById(shopID);
            availableAppointments = await Appointment.getAppointmentsClient(dateStart, _dateEnd, shopID);

            if(!shop) {
                return response.json({
                    success: false,
                    message: `No shop found with id ${shopID}`,
                    data:{}
                });
            };

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