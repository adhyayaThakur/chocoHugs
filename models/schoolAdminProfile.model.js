const mongoose = require('mongoose');

// Attributes of the Course object
const schoolAdminProfileSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
    unique: true,
  },
  mobileNumber: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  isActive: {
    type: Boolean,
    enum: [false, true],
    default: false,
  },
  schoolName: {
    type: String,
  },
  address: {
    type: String,
  },
  schoolCode: {
    type: String,
    unique: true,
  },
});

mongoose.model('SchoolAdmin', schoolAdminProfileSchema, 'schoolAdminProfile');
