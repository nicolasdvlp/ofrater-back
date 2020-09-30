const User = require('../models/User');
const Appointment = require('../models/Appointment');
const moment = require('moment'); 
moment().format(); 

module.exports = {

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
    // FIXME: a modifier pour la connection pro
        try {

            const { 
                dateStart,
                dateEnd,
                startHour,
                endHour,
                shopID
            } = req.body

            

           

   
          
            
            // TODO faire horaire de debut de la journée

            const generateNewAppointmentForADay = async function (date, startHour, dateEnd, shopID=1) {

                // TODO faire horaire de debut de la journée
                const _toJoinStart = [date, startHour]
                const toJoinStart = _toJoinStart.join(' ')

                const debutDeJ = moment(toJoinStart, "YYYY-MM-DD HH:mm");
                console.log(debutDeJ, ' debut de journée');

                // TODO faire horaire de fin de la journée
                const _toJoinEnd = [date, endHour]
                const toJoinEnd = _toJoinEnd.join(' ')

                const finDeJ = moment(toJoinEnd, "YYYY-MM-DD HH:mm");
                console.log(finDeJ, ' fin de journée');

                // TODO GENERER DES TIMESTAMPS

                let _timestampsz = [];


                const indexDay = await (finDeJ - debutDeJ) /30 / 60 /1000;

                const timestampArray = [];

                // TODO mettre dans un tableau  les timestampz pour les heure de début


                for (let index = 0; index < indexDay; index++) {
                    const currentTime = debutDeJ.add(30, 'm').format("YYYY-MM-DD HH:mm:SS").toString();
                    timestampArray.push(currentTime);
                };

                // TODO generer un deuxieme tableau pour les heure de fin

                const endTimestampArray = timestampArray.map(date => 
                    moment(date, "YYYY-MM-DD HH:mm:SS")
                    .add(30, "m")
                    .subtract(1, 'S')
                    .format("YYYY-MM-DD HH:mm:SS")
                    .toString()
                );

                // TODO BOUCLER SUR LE TABLEAU POUR INSERER DES RDV

                for (let index = 0; index < timestampArray.length; index++) {
                    await generateNewAppointment(1, timestampArray[index], endTimestampArray[index]); // FIXME: CHANGER LE SHOP ID avec this.id
                };

            };


            const generateNewAppointment = async function (shopID, slotStart, slotEnd) {
            
                let newAppointment = new Appointment({
                    slot_start: slotStart, 
                    slot_end: slotEnd, 
                    shop_id: shopID,
                })
                await newAppointment.insert()
            };

            // -----------------------------------------------------------------------------
            
            // const { 
                // * dateStart,
                // * dateEnd,
                // * startHour,
                // * endHour,
                // shopID
            // } = req.body

            let dateToCible = moment(dateStart, "YYYY-MM-DD").add(0, "day").format("YYYY-MM-DD").toString();
         
            for (let index = 0 ; dateToCible !== dateEnd; index++) {

                dateToCible = moment(dateStart, "YYYY-MM-DD").add(index, "day").format("YYYY-MM-DD").toString();
                console.log(dateToCible);
                generateNewAppointmentForADay(dateStart, startHour, dateEnd);

            }

/*
            generateNewAppointmentForADay(firsday, startHour, dateEnd);




            generateNewAppointmentForADay(dateStart, startHour, dateEnd);

*/








            

        } catch (error) {

            console.log(error);
            res.end()

        }

    }
}

// TODO 🗳 methode qui verifie le jour de la semaine pour attribuer les bon parametre d'horraire sur la journée SWITCH
    // * 🗳methode qui va boucler tous les jours la methode du dessous entre telle date et telle date
        //! ✅ methode de prise de plusieurs rdv entre telle heure et telle heure (toutes les heures ou demi heure par ex)
            //? ✅ methode de prise de un 1 rdv