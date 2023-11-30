const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.user_create_get = (req, res, next) => {
  res.render('user_form', { title: 'Members only club', errors: [] })
}

exports.user_create_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1})
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
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
  body('email')
    .trim()
    .isEmail()
    .escape()
    .withMessage('Invalid email address.'),
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

      const user = new User({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        email: req.body.email,
        password: req.body.password
      });

      if(!errors.isEmpty()) {
        res.render('user_form', {
          title: 'Members error only club',
          errors: errors.array()
        });
        return;
      }else {
        await user.save();
        res.render('user_homepage')
      }

    })
]