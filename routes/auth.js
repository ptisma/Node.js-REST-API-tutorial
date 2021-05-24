const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            //goes to the next rejection handler aka catch block
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;


/*
custom(validator)
validator(value, { req, location, path }): the custom validator function.
Receives the value of the field being validated, as well as the express request, the location and the field path.
The custom validator may return a promise to indicate an async validation task or truth

Any time you are inside of a promise callback, you can use throw. However, if you're in any other asynchronous callback, you must use reject.
*/