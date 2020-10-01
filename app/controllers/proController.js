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
<<<<<<< HEAD




=======
        try {
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a

            const { 
                dateStart,
                dateEnd,
                startHour,
                endHour,
                shopID
            } = req.body

            

           

<<<<<<< HEAD
        // TODO faire horaire de debut de la journée
        const _toJoinStart = [dateStart, starthour]
        const toJoinStart = _toJoinStart.join(' ')
       
        let debutDeJ = await momenttz.tz(moment(toJoinStart, "YYYY-MM-DD HH:mm"), "Europe/Paris")
        // console.log(debutDeJ, ' debut de journée');

        // TODO faire horaire de fin de la journée
        const _toJoinEnd = [dateStart, endHour]
        const toJoinEnd = _toJoinEnd.join(' ')
       
        const finDeJ = momenttz.tz(moment(toJoinEnd, "YYYY-MM-DD HH:mm"), "Europe/Paris")
        // console.log(finDeJ, ' fin de journée');
=======
   
          
            
            // TODO faire horaire de debut de la journée

            const generateNewAppointmentForADay = async function (date, startHour, dateEnd, shopID=1) {
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a

                // TODO faire horaire de debut de la journée
                const _toJoinStart = [date, startHour]
                const toJoinStart = _toJoinStart.join(' ')

                const debutDeJ = moment(toJoinStart, "YYYY-MM-DD HH:mm");
                console.log(debutDeJ, ' debut de journée');

<<<<<<< HEAD
=======
                // TODO faire horaire de fin de la journée
                const _toJoinEnd = [date, endHour]
                const toJoinEnd = _toJoinEnd.join(' ')
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a

                const finDeJ = moment(toJoinEnd, "YYYY-MM-DD HH:mm");
                console.log(finDeJ, ' fin de journée');

<<<<<<< HEAD
        let indexDay = await (finDeJ - debutDeJ) /30 / 60 /1000 /4;
=======
                // TODO GENERER DES TIMESTAMPS
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a

                let _timestampsz = [];


                const indexDay = await (finDeJ - debutDeJ) /30 / 60 /1000;

                const timestampArray = [];

                // TODO mettre dans un tableau  les timestampz pour les heure de début


<<<<<<< HEAD
        var _timestampsz = [];
=======
                for (let index = 0; index < indexDay; index++) {
                    const currentTime = debutDeJ.add(30, 'm').format("YYYY-MM-DD HH:mm:SS").toString();
                    timestampArray.push(currentTime);
                };
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a

                // TODO generer un deuxieme tableau pour les heure de fin

<<<<<<< HEAD
try {
    

        _timestampsz.push(debutDeJ);
        _timestampsz.push('coucou');



const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    _timestampsz.push(dateAugment);
  }, 1000);
});

FIXME:

const timestampArray = [];
const addInArray = async(array, data) => {
    array.push(data);
}
const forLoop = async _ => {
    for (let index = 0; index < indexDay; index++) {
        const currentTime = debutDeJ.add(30, 'm').format("YYYY-MM-DDT:HH:mm:SS").toString();
        addInArray(timestampArray, currentTime);
    }
    console.log(timestampArray);
  }
forLoop();


        console.log('dateAugment2', dateAugment);

        dateAugment =  debutDeJ.add(30, 'm');

        console.log('dateAugment2', dateAugment);
/*

        do {

            let dateAugment =  debutDeJ.add(30, 'm');
            console.log(dateAugment);
            _timestampsz.push(dateAugment);
            console.log(indexDay)
            indexDay-=1

        } while ( indexDay >= 0 );
*/
        setTimeout(() => {console.log(_timestampsz)}, 1000)
    

    } catch (error) {
        console.log(error)
    }
    
// FIXME:

/*
        const forLoop = async _ => {
            console.log('Start')
          
            for (let index = 0 ; index < indexDay ; index++) {

                if(index ===0){
                    console.log('je suis la');
                    await _timestampsz.push(await debutDeJ);
                } else {
                    console.log('ou la');
                    await _timestampsz.push(new Promise((resolve, reject) => {
                        resolve(debutDeJ.add(30, 'm'));
                    }))
                }
            }

            console.log('End')

        }
[
  Moment<2020-12-01T09:00:00+01:00>,
  Moment<2020-12-01T09:30:00+01:00>,
  Moment<2020-12-01T10:00:00+01:00>,
  Moment<2020-12-01T10:30:00+01:00>,
  Moment<2020-12-01T11:00:00+01:00>
]
        await forLoop()

        const result = await Promise.all(_timestampsz)

        console.log(result);*/

=======
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
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a

            };


<<<<<<< HEAD
        // (async () => {
        //     for (let index = 0, p = Promise.resolve(); index < indexDay ; index++) {
        //         p = p.then(_ => new Promise(async resolve => {
        //             console.log(index);


        //             if(index ===0){
        //                 console.log('je suis la');
        //                 await _timestampsz.push(await debutDeJ);
        //             } else {
        //                 console.log('ou la');
        //                 await _timestampsz.push(await debutDeJ.add(30, 'm'));
        //             }
        //             resolve();

        //         })
        //     )}
        // })();


/*
        (async () => {
        for (let index = 0;  index < indexDay; index++) {
            
            if(index ===0){
                _timestampsz.push(debutDeJ);
            } else {
                _timestampsz.push(debutDeJ.add(30, 'm'));
                console.log(debutDeJ)

            }
        }
        })();
  */      


=======
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
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a

/*
            generateNewAppointmentForADay(firsday, startHour, dateEnd);




            generateNewAppointmentForADay(dateStart, startHour, dateEnd);

*/








<<<<<<< HEAD
// TODO methode qui verifie le jour de la semaine pour attribuer les bon parametre d'horraire sur la journée
    // * methode qui va boucler tous les jours la methode du dessous entre telle date et telle date
        //! methode de prise de plusieurs rdv entre telle heure et telle heure (toutes les heures ou demi heure par ex)
            //? methode de prise de un 1 rdv
=======
            

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
>>>>>>> 15fe9e6eb7dd6b4171fda8d8e3e04d2a3f7b114a
