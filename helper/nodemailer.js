const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adhyayathakur@gmail.com',
    pass: 'Harrypotter@99',
  },
});

const sendMail = ({to, subject, text, html}) => {
  const mailOptions = {
    from: 'adhyayathakur@gmail.com',
    to,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports = sendMail;
