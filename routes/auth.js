let express = require('express');
const mongoose = require('mongoose');
let keys = require('../constants/constants')

let router = express.Router();
const sendMail = require('../helper/nodemailer')

const User = mongoose.model('User');


const signUpText = (emailAddress) => `http://localhost:8080/auth/emailActive?emailAddress=${emailAddress}`

router.post('/signin', function(req, res) {
    const { emailAddress, mobileNumber, password } = req.body;
    if (!emailAddress && !mobileNumber) {
        res.status(500).send(keys.emailOrNumberIsMust);
    } else if (!password) {
        res.status(500).send(keys.passwordIsNotThere)
    } else {
        signIn(req, res)
    }
});

router.post('/signup', function(req, res) {
    const { emailAddress, mobileNumber, password } = req.body;
    if (!emailAddress && !mobileNumber) {
        res.status(500).send(keys.emailOrNumberIsMust);
    } else if (!password) {
        res.status(500).send(keys.passwordIsNotThere)
    } else {
        insertUserIntoDatabase(req, res)
    }
});

router.get('/emailActive', function(req, res) {
    activateUser(req, res)
})


function insertUserIntoDatabase(req, res) {
    let user = new User();
    const { emailAddress, mobileNumber, password } = req.body;

    user.emailAddress = emailAddress;
    user.mobileNumber = mobileNumber;
    user.password = password;

    User.find({ emailAddress }).then(function(users) {
        if (users.length) {
            res.status(500).send('Email address already exist')
        } else {
            user.save((err, doc) => {
                if (!err) {
                    sendMail(emailAddress, 'You are looged In', signUpText(emailAddress));
                    res.status(200).send('Username and password saved')
                } else {
                    res.status(500).send('Error occured')
                }
            })
        }
    });
}

function signIn(req, res) {
    const { emailAddress, mobileNumber, password } = req.body;

    User.find({ emailAddress }).then((users) => {
        if (users.length) {
            const [user] = users
            if (password === user.password) {
                if (user.isActive) {
                    res.status(200).send('User login')
                } else {
                    sendMail(emailAddress, 'You are looged In', signUpText(emailAddress));
                    res.status(200).send('email not active')
                }
            } else {
                res.status(500).send('password incorrect')
            }
        } else {
            res.status(400).send('User does not exist')
        }
    })
}

function activateUser(req, res) {
    const { emailAddress } = req.query;
    User.updateOne({ emailAddress }, { emailAddress, isActive: true }).then(() => {
        res.send('is active')
    })
}

//export this router to use in our index.js
module.exports = router;