require('dotenv').config();
const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAILEMAIL,
        pass: process.env.GMAILPWD
    }
});

let mailOptions = {
    from: 'barbeapapaofrater@gmail.com',
    to: 'coincoin@yopmail.com',
    subject: 'Bienvenue sur Ofrater !',
    text: 'Vous venez de vous inscrire sur la meilleure plateforme de prise de rendez-vous chez un coiffeur/barbier !'
};

transporter.sendMail(mailOptions, function(error, data) {
    if (error) {
        console.log('Error occurs', error);
    } else {
        console.log('Email sent');
    }
});
