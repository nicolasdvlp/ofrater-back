const { Appointment } = require('../models/');
const moment = require('moment'); 
moment().format(); 

// function to add one appointment
const generateNewAppointment = async function (shopID, slotStart, slotEnd) {

    let newAppointment = new Appointment({
        slot_start: slotStart, 
        slot_end: slotEnd, 
        shop_id: shopID,
        is_attended: false
    })
    await newAppointment.insert()
};

// function a insert appointment un a day with starting hour and ending hour
const generateNewAppointmentForADay = async function (date, startHour, endHour, shopID, callback) {

    let alreadyInDatabaseArray = [];

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

    await callback(alreadyInDatabaseArray, startTimestampArray)
};


module.exports = { generateNewAppointment, generateNewAppointmentForADay }