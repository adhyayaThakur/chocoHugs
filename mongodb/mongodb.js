const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://adhyaya:btsblackpinktwice@cluster0.ye18h.mongodb.net/webseries?retryWrites=true&w=majority'
    , {useNewUrlParser: true}, (err) => {
      if (!err) {
        console.log('Successfully Established Connection with MongoDB');
      } else {
        console.log('Failed to Establish Connection with MongoDB with Error: ' +
        err,
        );
      }
    });

// Connecting Node and MongoDB
require('../models/user.model');
require('../models/course.model');
require('../models/schoolAdminProfile.model');
