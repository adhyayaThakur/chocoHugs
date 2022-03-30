const mongoose = require('mongoose');

// Attributes of the Course object
const userSchema = new mongoose.Schema({
  emailAddress: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  password: {
    type: String,
  },
  isActive: {
    type: Boolean,
    enum: [false, true],
    default: false,
  },
  confirmationCode: {
    type: String,
  },
  role: {
    type: String,
    enum: ['schoolSuperAdmin', 'admin', 'teacher', 'student', 'parent'],
    default: 'student',
  },
});

mongoose.model('User', userSchema, 'user');
