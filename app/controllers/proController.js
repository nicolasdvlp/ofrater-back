const User = require('../models/User');
const Appointment = require('../models/Appointment');
const moment = require('moment'); 
moment().format(); 

module.exports = {

    async getProfile (request, response) {

        let pro;

        try {
    
            if (!request.body.shopID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shopID' }); };

            pro = await User.findById(request.body.shopID);
    
        } catch(error) {
            console.trace(error);
            response.status(404).json(`No shop found for id ${request.params.shopID}.`);
        }

        response.json(pro);
    },

    async updateProfile (request, response) {

        let pro;

        try {

            if (!request.body.shopID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shopID' }); };

            pro = await User.findById(request.body.shopID);

            for (const key of Object.keys(request.body)) {
                if (key !== "shopID") {
                    pro[key] = request.body[key];
                };

            }

            pro.update();

        } catch(error) {

            console.trace(error);
            response.status(404).json(`Could not find shop with id ${request.body.shopID};`)

        }

        response.json(pro);
    },

    async postAvailableAppointment (req, res) {

        let startTimestampArray = [];
        let endTimestampArray = [];
        let alreadyInDatabaseArray = [];

        try {

            const { shopID, dateStart, dateEnd, days } = req.body

            if (!shopID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shopID' }); };
            if (!dateStart) { return response.status(400).json({ message: 'missing_required_parameter', info: 'dateStart' }); };
            if (!dateEnd) { return response.status(400).json({ message: 'missing_required_parameter', info: 'dateEnd' }); };
            if (!days) { return response.status(400).json({ message: 'missing_required_parameter', info: 'days' }); };
            if (isNaN(shopID)||shopID<=0||typeof shopID !== 'number') { return response.status(400).json({ message: 'shopID must be a positive number', info: 'shopID' }); };
            if (typeof dateStart !== 'string') { return response.status(400).json({ message: 'dateStart must be a string YYYY-MM-DD or DD/MM/YYYY', info: 'dateStart' }); };
            if (typeof dateEnd !== 'string') { return response.status(400).json({ message: 'dateEnd must be a string YYYY-MM-DD or DD/MM/YYYY', info: 'dateEnd' }); };
            if (typeof days !== 'object') { return response.status(400).json({ message: 'days must be an object with {monday: {amStart: HH:mm, amEnd: HH:mm, pmStart: HH:mm, pmEnd: HH:mm}, tuesday: {...}', info: 'days' }); };
            
            // function a insert appointment un a day with starting hour and ending hour
            const generateNewAppointmentForADay = async function (date, startHour, endHour, shopID) {

                const startTime = moment(date + ' ' + startHour, "YYYY-MM-DD HH:mm");
                const endTime = moment(date + ' ' + endHour, "YYYY-MM-DD HH:mm");

                // calculate how many slot exist to repeat 'insert'
                const indexDay = await (endTime - startTime) /30 / 60 /1000;

                // loop to add start times in startTimestampArray
                for (let index = 0; index < indexDay; index++) {

                    let currentTime = startTime.format("YYYY-MM-DD HH:mm").toString();

                    const isInDatabase = await Appointment.alreadyHaveAppointmentInDatabase(currentTime, shopID)
                    
                    if(!!isInDatabase) {

                        alreadyInDatabaseArray.push(currentTime);

                    } else {

                        if (index === 0) {
                            startTimestampArray.push(currentTime);
                        } else {
                            currentTime = startTime.add(30, 'm').format("YYYY-MM-DD HH:mm").toString();
                            startTimestampArray.push(currentTime);
                        }
                    }
                };

                // endTimestampArray array
                endTimestampArray = await startTimestampArray.map(date => 
                    moment(date, "YYYY-MM-DD HH:mm")
                    .add(30, "m")
                    .subtract(1, 'm')
                    .format("YYYY-MM-DD HH:mm")
                    .toString()
                )

                // loop to insert appointments in given date
                for (let index = 0; index < startTimestampArray.length; index++) {
                    await generateNewAppointment(shopID, startTimestampArray[index], endTimestampArray[index]); 
                };
            };

            // function to add one appointment
            const generateNewAppointment = async function (shopID, slotStart, slotEnd) {
            
                let newAppointment = new Appointment({
                    slot_start: slotStart, 
                    slot_end: slotEnd, 
                    shop_id: shopID,
                })
                await newAppointment.insert()
            };

           let dateToCible = moment(dateStart, "YYYY-MM-DD").add(0, "day").format("YYYY-MM-DD").toString();
            
            // loop to add appointments in a day
            for (let index = 0 ; dateToCible !== dateEnd; index++) {

                dateToCible = moment(dateStart, "YYYY-MM-DD").add(index, "day").format("YYYY-MM-DD").toString();

                const jourDeDateCible = moment(dateToCible, "YYYY-MM-DD").format("dddd").toString().toLowerCase();

                // Switch to verify the dayy of the week and if it's a worked day
                switch (jourDeDateCible) {
                    case "monday":
                        if(!!days.monday.amStart && !!days.monday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.monday.amStart, days.monday.amEnd, shopID)
                        };
                        if(!!days.monday.pmStart && !!days.monday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.monday.pmStart, days.monday.pmEnd, shopID)
                        };
                        break;

                    case "tuesday":
                        if(!!days.tuesday.amStart && !!days.tuesday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.tuesday.amStart, days.tuesday.amEnd, shopID)
                        };
                        if(!!days.tuesday.pmStart && !!days.tuesday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.tuesday.pmStart, days.tuesday.pmEnd, shopID)
                        };
                        break;

                    case "wednesday":
                        if(!!days.wednesday.amStart && !!days.wednesday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.wednesday.amStart, days.wednesday.amEnd, shopID)
                        };
                        if(!!days.wednesday.pmStart && !!days.wednesday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.wednesday.pmStart, days.wednesday.pmEnd, shopID)
                        };
                        break;

                    case "thursday":
                        if(!!days.thursday.amStart && !!days.thursday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.thursday.amStart, days.thursday.amEnd, shopID)
                        };
                        if(!!days.thursday.pmStart && !!days.thursday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.thursday.pmStart, days.thursday.pmEnd, shopID)
                        };
                        break;

                    case "friday":
                        if(!!days.friday.amStart && !!days.friday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.friday.amStart, days.friday.amEnd, shopID)
                        };
                        if(!!days.friday.pmStart && !!days.friday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.friday.pmStart, days.friday.pmEnd, shopID)
                        };
                        break;

                    case "saturday":
                        if(!!days.saturday.amStart && !!days.saturday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.saturday.amStart, days.saturday.amEnd, shopID)
                        };
                        if(!!days.saturday.pmStart && !!days.saturday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.saturday.pmStart, days.saturday.pmEnd, shopID)
                        };
                        break;

                    case "sunday":
                        if(!!days.sunday.amStart && !!days.sunday.amEnd) {
                            generateNewAppointmentForADay(dateToCible, days.sunday.amStart, days.sunday.amEnd, shopID)
                        };
                        if(!!days.sunday.pmStart && !!days.sunday.pmEnd) {
                            generateNewAppointmentForADay(dateToCible, days.sunday.pmStart, days.sunday.pmEnd, shopID)
                        };
                        break;

                    default:
                        break;
                }
            }

            res.json({
                success: true,
                message: 'Available appointment(s) correctly inserted',
                number_insertion : startTimestampArray.length,
                inserted_slot : startTimestampArray,
                number_already_in_DB : alreadyInDatabaseArray.length,
                already_in_DB: alreadyInDatabaseArray
            });

        } catch (error) {

            console.trace(error);

            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error
            });
        }
    },

    async getAppointmentsPro (request, response) {

        let appointments = [];

        try {

            let { shopID, dateStart, dateEnd } = request.body

            if (!shopID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shopID' }); };
            if (!dateStart) { return rresponses.status(400).json({ message: 'missing_required_parameter', info: 'dateStart' }); };
            if (isNaN(shopID)||shopID<=0||typeof shopID !== 'number') { return response.status(400).json({ message: 'shopID must be a positive number', info: 'shopID' }); };
            if (typeof dateStart !== 'string') { return response.status(400).json({ message: 'dateStart must be a string YYYY-MM-DD or DD/MM/YYYY', info: 'dateStart' }); };

            if (!dateEnd) { dateEnd = dateStart };
            
            appointments = await Appointment.getAppointmentShop(dateStart, dateEnd, shopID);

            response.json({
                success: true,
                message: 'Appointments correctly requested',
                number_appointment : appointments.length,
                data: appointments
            });

        } catch(error) {

            console.trace(error);

            return response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error
            });
        }

    },
}