const { response } = require("express");

module.exports = (req, res, next) => {

const handleSend = (req, res) => {
    const secret_key = process.env.SECRET_CAPTCHA;
    const token = req.body.token;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

    fetch(url, {
        method: 'post'
    })
        .then(response => 
        {
            console.log(response)
            response.json()
            next{}
        }
        )
        .then(google_response => res.json({ google_response }))
        .catch(error => res.json({ error }));
};