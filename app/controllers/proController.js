const User = require('../models/User');
const Appointment = require('../models/Appointment');
const moment = require('moment'); 
var momenttz = require('moment-timezone');
moment().format(); 
momenttz().tz("Europe/Paris").format();

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






        const { 
            dateStart,
            dateEnd,
            starthour,
            endHour,
            shopID
        } = req.body

    

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


        // TODO GENERER DES TIMESTAMPS


        // console.log("debutDeJ.add(30, 'm') :", debutDeJ.add(30, 'm'));
        // console.log("debutDeJ :", debutDeJ);
        // console.log("fin de journée - début de journée :");

        let indexDay = await (finDeJ - debutDeJ) /30 / 60 /1000 /4;



        // await (async function loop() {
        //     for (let index = 0;  index < indexDay; index++) {
        //         await new Promise(resolve => {
        //             if(index ===0){
        //                 _timestampsz.push(debutDeJ);
        //             } else {
        //                 _timestampsz.push(debutDeJ.add(30, 'm'));
        //             }
        //         })
        //     }
        // })();


        // for (let i = 0, p = Promise.resolve(); i < 10; i++) {
        //     p = p.then(_ => new Promise(resolve =>
        //         setTimeout(function () {
        //             console.log(i);
        //             resolve();
        //         }, Math.random() * 1000)
        //     ));
        // }


        var _timestampsz = [];


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



        // TODO mettre dans un tableau  les timestampz


        // TODO BOUCLER SUR LE TABLEAU POUR INSERER DES RDV


        const generateNewAppointment = async function (shopID, slotStart, slotEnd) {
          
            let newAppointment = new Appointment({
                slot_start: slotStart, //timestamp date+heure 2020-10-20 22:00:0+02
                slot_end: slotEnd, //timestamp date+heure2020-10-20 22:30:0+02
                shop_id: shopID,
                is_attended: false
            })

            await newAppointment.insert()
        } 

        // generateNewAppointment(shopID, slotStart, slotEnd);

        res.end()

    }

}


// TODO methode qui verifie le jour de la semaine pour attribuer les bon parametre d'horraire sur la journée
    // * methode qui va boucler tous les jours la methode du dessous entre telle date et telle date
        //! methode de prise de plusieurs rdv entre telle heure et telle heure (toutes les heures ou demi heure par ex)
            //? methode de prise de un 1 rdv
