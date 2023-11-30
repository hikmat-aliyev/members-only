const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.user_create_get = (req, res, next) => {
  res.render('user_form', { title: 'Members only club' })
}

// exports.user_create_post = [

// ]