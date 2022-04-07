const express = require('express');
const mongoose = require('mongoose');
const keys = require('../constants/constants');

const router = express.Router();
const sendMail = require('../helper/nodemailer');

const User = mongoose.model('User');


const signUpText = (emailAddress) => `http://localhost:8080/auth/emailActive?emailAddress=${emailAddress}`;

const forgotPasswordText =(emailAddress)=>`http://localhost:8080/auth/forgotPassword?emailAddress=${emailAddress}`;

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

router.post('/forgotPasswordEmailActivation',function(req,res){
  const {emailAddress}=req.body;
  if(emailAddress){
    forgotPasswordEmailActivation(req,res);
  }else{
    res.status(400).send(JSON.stringify({
      success: false,
      message : 'Email Address not provided.'
    }))
  }
})

router.post('/forgotPassword',function(req,res){
  const {emailAddress,password}=req.body;

  if(password && emailAddress){
    forgotPassword(req,res)
  }else{
    res.status(400).send({
      success:false,
      message: 'Credentials are not provided'
    })
  }
})

function forgotPassword(req,res){
  const {emailAddress,password}=req.body;

    User.find({emailAddress}).then((users)=>{
      if(users.length===1){
        User.updateOne({emailAddress},{emailAddress,password}).then(()=>{
          res.status(200).send(JSON.stringify({
            success:true,
            message :'Password updated successfully',
          }))
        }).catch(()=>{
          res.status(500).send(JSON.stringify({
            success: false,
            message : 'Error! Contanct differentiation'
          }))
        })
      }else{
        res.status(500).send(JSON.stringify({
          success: false,
          message : 'Error! Contanct differentiation'
        }))
      }
    })
}

function forgotPasswordEmailActivation(req,res){
  const {emailAddress}=req.body;

  User.find({emailAddress}).then((user)=>{
      if(user.length==1){
        sendMail({
          to: emailAddress,
          subject: 'Forgot Password',
          text : forgotPasswordText(emailAddress)
        })
        res.status(200).send(JSON.stringify({
          success: true,
          message: 'Verification mail sent',
        }))
      }else{
        res.status(400).send(JSON.stringify({
          success:false,
          message: 'User does not exist!'
        }))
      }

  }).catch(()=>{
    res.status(500).send(JSON.stringify({
      success:false,
      message : 'Error! Contanct administration'
    }))
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
