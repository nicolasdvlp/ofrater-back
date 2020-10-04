const User = require('../models/User');
const Appointment = require('../models/Appointment');
const moment = require('moment'); 
moment().format(); 

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
    },

    async postAvailableAppointment (req, res) {

        try {

            const { 
                shopID,
                dateStart,
                dateEnd,
                days
            } = req.body
            
            // function a insert appointment un a day with starting hour and ending hour
            const generateNewAppointmentForADay = async function (date, startHour, endHour, shopID) {

                const _toJoinStart = [date, startHour]
                const toJoinStart = _toJoinStart.join(' ')

                const debutDeJ = moment(toJoinStart, "YYYY-MM-DD HH:mm");

                const _toJoinEnd = [date, endHour]
                const toJoinEnd = _toJoinEnd.join(' ')

                const finDeJ = moment(toJoinEnd, "YYYY-MM-DD HH:mm");

                // calculate how many slot exist to repeat 'insert'
                const indexDay = await (finDeJ - debutDeJ) /30 / 60 /1000;

                const startTimestampArray = [];

                // loop to add start times in startTimestampArray
                for (let index = 0; index < indexDay; index++) {
                    let currentTime = debutDeJ.format("YYYY-MM-DD HH:mm").toString();

                    if (index === 0) {
                        startTimestampArray.push(currentTime);
                    } else {
                        currentTime = debutDeJ.add(30, 'm').format("YYYY-MM-DD HH:mm").toString();
                        startTimestampArray.push(currentTime);
                    }
                };

                // endTimestampArray array
                const endTimestampArray = timestampArray.map(date => 
                    moment(date, "YYYY-MM-DD HH:mm")
                    .add(30, "m")
                    .subtract(1, 'm')
                    .format("YYYY-MM-DD HH:mm")
                    .toString()
                );

                // loop to insert appointments in given date
                for (let index = 0; index < timestampArray.length; index++) {
                    await generateNewAppointment(shopID, timestampArray[index], endTimestampArray[index]); 
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
                            await generateNewAppointmentForADay(dateToCible, days.monday.amStart, days.monday.amEnd)
                        };
                        if(!!days.monday.pmStart && !!days.monday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.monday.pmStart, days.monday.pmEnd)
                        };
                        break;

                    case "tuesday":
                        if(!!days.tuesday.amStart && !!days.tuesday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.tuesday.amStart, days.tuesday.amEnd)
                        };
                        if(!!days.tuesday.pmStart && !!days.tuesday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.tuesday.pmStart, days.tuesday.pmEnd)
                        };
                        break;

                    case "wednesday":
                        if(!!days.wednesday.amStart && !!days.wednesday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.wednesday.amStart, days.wednesday.amEnd)
                        };
                        if(!!days.wednesday.pmStart && !!days.wednesday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.wednesday.pmStart, days.wednesday.pmEnd)
                        };
                        break;

                    case "thursday":
                        if(!!days.thursday.amStart && !!days.thursday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.thursday.amStart, days.thursday.amEnd)
                        };
                        if(!!days.thursday.pmStart && !!days.thursday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.thursday.pmStart, days.thursday.pmEnd)
                        };
                        break;

                    case "friday":
                        if(!!days.friday.amStart && !!days.friday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.friday.amStart, days.friday.amEnd)
                        };
                        if(!!days.friday.pmStart && !!days.friday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.friday.pmStart, days.friday.pmEnd)
                        };
                        break;

                    case "saturday":
                        if(!!days.saturday.amStart && !!days.saturday.amEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.saturday.amStart, days.saturday.amEnd)
                        };
                        if(!!days.saturday.pmStart && !!days.saturday.pmEnd) {
                            await generateNewAppointmentForADay(dateToCible, days.saturday.pmStart, days.saturday.pmEnd)
                        };
                        break;

                    case "sunday":
                        if(!!days.sunday.amStart && !!days.sunday.amEnd) {
                            generateNewAppointmentForADay(dateToCible, days.sunday.amStart, days.sunday.amEnd)
                        };
                        if(!!days.sunday.pmStart && !!days.sunday.pmEnd) {
                            generateNewAppointmentForADay(dateToCible, days.sunday.pmStart, days.sunday.pmEnd)
                        };
                        break;

                    default:
                        break;
                }
            }

        } catch (error) {
            console.log(error);
            res.end()
        }
    },

    async getAppointmentsPro (request, response) {

        let rdvs = [];

        try {

            let { shopID, dateStart, dateEnd } = request.body

            if (!shopID) { return response.status(400).json({ message: 'missing_required_parameter', info: 'shopID' }); };
            if (!dateStart) { return rresponses.status(400).json({ message: 'missing_required_parameter', info: 'dateStart' }); };

            if (!dateEnd) { dateEnd = dateStart };
            
            rdvs = await Appointment.getAppointmentShop(dateStart, dateEnd, shopID);

        } catch(error) {
            console.trace(error);
            response.status(404).json(`No appointment founded for shopID ${request.params.shopID}.`);
        }

        response.json(rdvs);
    },
}