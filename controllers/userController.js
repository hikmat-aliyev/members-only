const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

exports.homepage_get = (req, res, next) => {
  res.render('homepage', {user: req.user})
}

exports.user_signup_get = (req, res, next) => {
  res.render('user_signup_form', { title: 'Members only club', errors: [] })
}

exports.user_signup_post = [
  body('username')
  .trim()
  .isLength({ min: 1})
  .escape()
  .withMessage('Username must be specified.')
  .custom(async (value) => {
    const username = await User.find({ username: value })
    if(username.length > 0){
      throw new Error('Username is already exist!')
    }
    return true;
  }),
  body('first_name')
    .trim()
    .isLength({ min: 1})
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('last_name')
    .trim()
    .isLength({ min: 1})
    .escape()
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('password')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Password should be at least 3 characters long.'),
  body('password_confirm')
    .trim()
    .custom((value, {req}) => {
      if(value !== req.body.password){
        throw new Error('Passwords do not match!')
      }
      return true;
    }), 
  
    asyncHandler(async (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      try{
        await bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if(err){
            return next(err);
          }else{
            try{
              const user = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                username: req.body.username,
                password: hashedPassword
              });
              if(!errors.isEmpty()) {
                res.render('sign-up-form', {
                  title: 'Members error only club',
                  errors: errors.array()
                });
                return;
              }else {
                await user.save();
                res.redirect('/')
              }
            }catch(err){
              return next(err);
            }
          }
        })
      } catch(err){
        return next(err);
      }
    })
]

exports.user_login_get = (req, res, next) => {
  res.render('user_login_form')
}
