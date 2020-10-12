const { Appointment, User, Shop } = require('../models/');
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

            pro = await Shop.findById(request.body.shopID);

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

        let _startTimestampArray = [];
        let alreadyInDatabaseArray = [];
        
        try {

            const { shopID, dateStart, dateEnd, days } = req.body

            const shopIDD = parseInt(shopID);
            if (!days) { return res.status(400).json({ message: 'missing_required_parameter', info: 'days' }); };
            if (shopIDD<=0|| isNaN(shopIDD)) { return response.status(400).json({ message: 'shopID must be a positive number', info: 'shopID' }); };
            if (typeof days !== 'object') { return res.status(400).json({ message: 'days must be an object with {monday: {amStart: HH:mm, amEnd: HH:mm, pmStart: HH:mm, pmEnd: HH:mm}, tuesday: {...}', info: 'days' }); };
            if ((moment(dateEnd ,"YYYY-MM-DD")<moment(dateStart,"YYYY-MM-DD"))) {return res.status(400).json({ message: 'dateStart must be after dateEnd', info: 'dateStart/dateEnd' });};

            // function a insert appointment un a day with starting hour and ending hour
            const generateNewAppointmentForADay = async function (date, startHour, endHour, shopIDD) {

                let startTimestampArray = [];
                let endTimestampArray = [];

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
                        startTimestampArray.push(currentTime);
                        _startTimestampArray.push(currentTime);
                        currentTime = startTime.add(30, 'm').format("YYYY-MM-DD HH:mm").toString();
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
            const generateNewAppointment = async function (shopIDD, slotStart, slotEnd) {
            
                let newAppointment = new Appointment({
                    slot_start: slotStart, 
                    slot_end: slotEnd, 
                    shop_id: shopIDD,
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
                            await generateNewAppointmentForADay(dateToCible, days.monday.amStart, days.monday.amEnd, shopIDD)
                        };
                        if(!!days.monday.pmStart && !!days.monday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.monday.pmStart, days.monday.pmEnd, shopIDD)
                        };
                        break;

                    case "tuesday":
                        if(!!days.tuesday.amStart && !!days.tuesday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.tuesday.amStart, days.tuesday.amEnd, shopIDD)
                        };
                        if(!!days.tuesday.pmStart && !!days.tuesday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.tuesday.pmStart, days.tuesday.pmEnd, shopIDD)
                        };
                        break;

                    case "wednesday":
                        if(!!days.wednesday.amStart && !!days.wednesday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.wednesday.amStart, days.wednesday.amEnd, shopIDD)
                        };
                        if(!!days.wednesday.pmStart && !!days.wednesday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.wednesday.pmStart, days.wednesday.pmEnd, shopIDD)
                        };
                        break;

                    case "thursday":
                        if(!!days.thursday.amStart && !!days.thursday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.thursday.amStart, days.thursday.amEnd, shopIDD)
                        };
                        if(!!days.thursday.pmStart && !!days.thursday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.thursday.pmStart, days.thursday.pmEnd, shopIDD)
                        };
                        break;

                    case "friday":
                        if(!!days.friday.amStart && !!days.friday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.friday.amStart, days.friday.amEnd, shopIDD)
                        };
                        if(!!days.friday.pmStart && !!days.friday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.friday.pmStart, days.friday.pmEnd, shopIDD)
                        };
                        break;

                    case "saturday":
                        if(!!days.saturday.amStart && !!days.saturday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.saturday.amStart, days.saturday.amEnd, shopIDD)
                        };
                        if(!!days.saturday.pmStart && !!days.saturday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.saturday.pmStart, days.saturday.pmEnd, shopIDD)
                        };
                        break;

                    case "sunday":
                        if(!!days.sunday.amStart && !!days.sunday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.sunday.amStart, days.sunday.amEnd, shopIDD)
                        };
                        if(!!days.sunday.pmStart && !!days.sunday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.sunday.pmStart, days.sunday.pmEnd, shopIDD)
                        };
                        break;

                    default:
                        break;
                }
            }

            res.json({
                success: true,
                message: 'Available appointment(s) correctly inserted',
                number_insertion : _startTimestampArray.length,
                inserted_slot : _startTimestampArray,
                number_already_in_DB : alreadyInDatabaseArray.length,
                already_in_DB: alreadyInDatabaseArray
            });

        } catch (error) {

            console.trace(error);
            res.status(500).json({
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
            const shopIDD = parseInt(shopID);
            if (shopIDD<=0|| isNaN(shopIDD)) { return response.status(400).json({ message: 'shopID must be a positive number', info: 'shopID' }); };

            if (!dateEnd) { dateEnd = dateStart };
            
            appointments = await Appointment.getAppointmentShop(dateStart, dateEnd, shopIDD);

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