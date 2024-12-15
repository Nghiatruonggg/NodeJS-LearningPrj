const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

// name, email, photo, password, passwordConfirm

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      min: [6, 'The name needs to be longer'],
      max: 20,
    },
    email: {
      type: String,
      required: [true, 'We need an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'This must be an email'],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'please provide the password'],
      min: 8,
      select: false,
      // validator: [
      //   validator.isStrongPassword({
      //     minLength: 8,
      //     minLowerCase: 1,
      //     minUpperCase: 1,
      //   }),
      // ],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'you need to confirm your password'],
      validate: {
        // Only works on create() and save()
        validator: function (el) {
          return this.password === el;
        },
        message: 'password are not the same',
      },
    },
  },
  { timestamps: true },
);

// eslint-disable-next-line prefer-arrow-callback
userSchema.pre('save', async function (next) {
  // Only runs when password is modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost 12 -> Delete passwordConfirm field
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword,
// eslint-disable-next-line arrow-body-style
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
