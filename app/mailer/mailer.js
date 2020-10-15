require('dotenv').config();
const nodemailer = require('nodemailer');

function sendmail (userEmailAdress, account_email_crypto) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAILEMAIL,
            pass: process.env.GMAILPWD
        }
    });

    let mailOptions = {
        from: 'barbeapapaofrater@gmail.com',
        to: userEmailAdress,
        subject: 'Bienvenue sur Ofrater !',
        // En local
        //html: `<p>Vous venez de vous inscrire sur la meilleure plateforme de prise de rendez-vous chez un coiffeur/barbier !<p> <h1>Youpi</h1> <a href="http://localhost:3003/checkEmail/${account_email_crypto}">Cliquez sur ce lien</a>`
    
        html: `<p>Vous venez de vous inscrire sur la meilleure plateforme de prise de rendez-vous chez un coiffeur / barbier !<p></br><p>Afin de valider votre inscription, veuillez cliquer sur le lien suivant : <a href="https://www.ofrater.me/professional/shop/20">Valider mon compte</a></p>`
    };

    transporter.sendMail(mailOptions, function(error, data) {
        if (error) {
            console.log('Error occurs', error);
        } else {
            console.log('Email sent', data);
        }
    });
}

module.exports = sendmail;

//sendmail('coincoin@yopmail.com');