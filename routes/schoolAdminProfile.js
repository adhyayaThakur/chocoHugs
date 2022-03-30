let express = require('express');
const mongoose = require('mongoose');
let keys = require('../constants/constants');
const sendMail = require('../helper/nodemailer');

let router = express.Router();

const SchoolAdmin = mongoose.model('SchoolAdmin');

router.post('/create',(req,res)=>{
    const {emailAddress,mobileNumber,password,schoolName,address,schoolCode}=req.body;

    if(!emailAddress){
        res.status(500).send('Email Address is not provided')
    }else if(!mobileNumber){
        res.status(500).send('Mobile Number is not provided')
    }else if(!password){
        res.status(500).send('password is not provided')
    }else if(!schoolName.trim()){
        res.status(500).send('School name is not provided')
    }else if(!address.trim()){
        res.status(500).send('Address is not provided');
    }else if(!schoolCode.trim()){
        res.status(500).send('School code is not provided')
    }
    else{
        createSchoolAdmin(req,res);
    }
})

router.post('/update',(req,res)=>{
    const {emailAddress,mobileNumber,password,schoolName,address,schoolCode}=req.body;
    if(!emailAddress){
        res.status(500).send('Email Address is not provided')
    }else if(!mobileNumber){
        res.status(500).send('Mobile Number is not provided')
    }else if(!password){
        res.status(500).send('Phone numer is not provided')
    }else if(!schoolName.trim()){
        res.status(500).send('School name is not provided')
    }else if(!address.trim()){
        res.status(500).send('Address is not provided');
    }else if(!schoolCode.trim()){
        res.status(500).send('School code is not provided')
    }else{
        updateSchoolAdmin(req,res);
    }

})

router.post('/activeEmail',(req,res)=>{
    const {emailAddress}=req.query;


})


function createSchoolAdmin (req,res){

    let schoolAdminProfile= new SchoolAdmin(req.body);

    const {emailAddress,schoolCode}=req.body;

    SchoolAdmin.find({schoolCode}).then((schools)=>{
        if(schools.length){
            res.status(400).send('School Code is already provided')
        }else{
            schoolAdminProfile.save((err,doc)=>{
                if(!err){
                    sendMail({
                        to : emailAddress,
                        subject: 'Your school profile has been created',
                        text:'Your school profile has been created'
                    })
                    res.status(200).send('Your school profile has been created, check your email and confirm it')
                }else{
                        if ( err.code === 11000) {
                const message= Object.keys(err.keyPattern).join(',').concat(' already exist!')

         
                          return res.status(422).send({ 
                              succes: false, 
                            message
                         });
                        }
                    res.status(500).send('Error occured! contanct your admin for further info')
                }
            })
        }
    })
}

function updateSchoolAdmin(req,res){
    const {emailAddress,mobileNumber,password,schoolName,address,schoolCode}=req.body;

    SchoolAdmin.updateOne({schoolCode},{...req.body}).then(data=>{
        const {matchedCount} = data;
        
        if(matchedCount){
            res.status(200).send('School code created')
        }else{
            res.status(200).send('School code does not exist');
        }
    })


}


module.exports = router;
