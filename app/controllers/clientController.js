const Appointment = require('../models/Appointment');
const User = require('../models/User');

module.exports = {

    async getProfile (request, response) {

        const { userID } = request.body

        let client;

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

        } catch(error) {

            console.trace(error);
            response.status(404).json(`Can not book`)

        }

        response.json(pro);

    },
    
    async bookAnAppointement (request, response) {

        const { appointmentID, userID, serviceID } = request.body;
        
        if (!appointmentID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'appointmentID' }); };
        if (!userID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'userID' }); };
        if (!serviceID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'serviceID' }); };

        if (isNaN(appointmentID)||appointmentID<=0||typeof appointmentID !== 'number') { return response.status(400).json({ message: 'appointmentID must be a positive number', info: 'appointmentID' }); };
        if (isNaN(userID)||userID<=0||typeof userID !== 'number') { return response.status(400).json({ message: 'userID must be a positive number', info: 'userID' }); };
        if (isNaN(serviceID)||serviceID<=0||typeof serviceID !== 'number') { return response.status(400).json({ message: 'serviceID must be a positive number', info: 'serviceID' }); };
        
        let rdv;

        try {

            rdv = await Appointment.findById(appointmentID);

            for (const key of Object.keys(request.body)) {
                if (key !== "appointmentID") {
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