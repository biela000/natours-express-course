const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    select: false,
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

Schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

Schema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', Schema);
