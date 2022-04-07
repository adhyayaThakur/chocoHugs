const express = require('express');
const mongoose = require('mongoose');
const keys = require('../constants/constants');

const router = express.Router();
const sendMail = require('../helper/nodemailer');

const User = mongoose.model('User');


const signUpText = (emailAddress) => `http://localhost:8080/auth/emailActive?emailAddress=${emailAddress}`;

router.post('/signin', function(req, res) {
  const {emailAddress, mobileNumber, password} = req.body;
  if (!emailAddress && !mobileNumber) {
    res.status(500).send(keys.emailOrNumberIsMust);
  } else if (!password) {
    res.status(500).send(keys.passwordIsNotThere);
  } else {
    signIn(req, res);
  }
});

router.post('/signup', function(req, res) {
  const {emailAddress, mobileNumber, password} = req.body;
  if (!emailAddress && !mobileNumber) {
    res.status(500).send(keys.emailOrNumberIsMust);
  } else if (!password) {
    res.status(500).send(keys.passwordIsNotThere);
  } else {
    insertUserIntoDatabase(req, res);
  }
});

router.get('/emailActive', function(req, res) {
  activateUser(req, res);
});

router.post('/changePassword',function(req,res){
  const {emailAddress}=req.body;

  if(!emailAddress){
    res.status(400).send('Email address is not provided');
  }
  changePassword(req,res);
})

function changePassword(req,res){

  const {emailAddress,newPassword,oldPassword}=req.body;

  User.find({emailAddress}).then((userList)=>{
      const [user]=userList;
      if(user.password!==oldPassword){
        res.status(400).send('password incorrect');
      }else if(oldPassword===newPassword){
        res.status(400).send(JSON.stringify({
          success: false,
          message:'Old password is equal to new password'
        }))
      }else{
        User.updateOne({emailAddress},{emailAddress,password: newPassword}).then((response)=>{
            const {modifiedCount}= response;
            if(modifiedCount===1){
              res.status(200).send(JSON.stringify({
                success: true,
                message: 'Password changed!'
              }))
            }
        })
      }
  })
}


function insertUserIntoDatabase(req, res) {
  const user = new User();
  const {emailAddress, mobileNumber, password} = req.body;

  user.emailAddress = emailAddress;
  user.mobileNumber = mobileNumber;
  user.password = password;

  User.find({emailAddress}).then(function(users) {
    if (users.length) {
      res.status(500).send('Email address already exist');
    } else {
      user.save((err) => {
        if (!err) {
          sendMail({
            to: emailAddress,
            subject: 'You are looged In',
            html: signUpText(emailAddress),
          });
          res.status(200).send('Username and password saved');
        } else {
          res.status(500).send('Error occured');
        }
      });
    }
  });
}

function signIn(req, res) {
  const {emailAddress, password} = req.body;

  User.find({emailAddress}).then((users) => {
    if (users.length) {
      const [user] = users;
      if (password === user.password) {
        if (user.isActive) {
          res.status(200).send('User login');
        } else {
          sendMail({
            to: emailAddress,
            subject: 'You are looged In',
            html: signUpText(emailAddress),
          });
          res.status(200).send('email not active');
        }
      } else {
        res.status(500).send('password incorrect');
      }
    } else {
      res.status(400).send('User does not exist');
    }
  });
}

function activateUser(req, res) {
  const {emailAddress} = req.query;
  User.updateOne({emailAddress}, {emailAddress, isActive: true}).then((data) => {
    const {matchedCount} = data;
    if (matchedCount) {
      res.status(200).send('is active');
    } else {
      res.status(400).send('email address does not exist');
    }
  }).catch((err)=>console.log(err));
}

// export this router to use in our index.js
module.exports = router;
