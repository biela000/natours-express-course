const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'A user must have an email address'],
    validate: {
      validator: function () {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        );
      },
      message: 'Invalid email address',
    },
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    validate: {
      validator: function () {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
          this.password
        );
      },
      message:
        'Password must be 8 characters or more and contain: a number, a lowercase letter and an uppercase letter',
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password confirmation'],
    validate: {
      validator: function () {
        return this.password === this.passwordConfirm;
      },
    },
  },
});

module.exports = mongoose.model('User', Schema);
