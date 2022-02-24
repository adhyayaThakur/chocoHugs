var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'adhyayathakur@gmail.com',
        pass: 'Harrypotter@99'
    }
});

const sendMail = (to, subject, text) => {
    var mailOptions = {
        from: 'adhyayathakur240499@gmail.com',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}

module.exports = sendMail;