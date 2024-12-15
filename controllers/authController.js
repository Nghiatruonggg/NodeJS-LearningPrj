const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id: id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }
  // Check if the user exists && password is correct
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password incorrect', 400));
  }

  // Sign new JWT token and send them back
  const token = signToken(user._id)
  res.status(200).json({
    status: 'success',
    token,
  });
});
