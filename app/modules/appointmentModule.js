// function to add one appointment
const generateNewAppointment = async function (shopID, slotStart, slotEnd) {

    let newAppointment = new Appointment({
        slot_start: slotStart, 
        slot_end: slotEnd, 
        shop_id: shopID,
    })
    await newAppointment.insert()
};

module.exports = { generateNewAppointment }