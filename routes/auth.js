const express = require('express');
const { check, body } = require('express-validator/check');   // imports check function from check subfolder in express-validator package

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),  // white space sanitizer
    body('password', 'Password has to valid.')
        .isLength({min: 8})
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin);

router.post(
    '/signup',
    [
        check('email')  // check will look for it anywhere in the view
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //     throw new Error('This email is forbidden')
                // }
                // return true;
                return User.findOne({email: value})
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('Email already exists. Please choose another email.');
                        }
                     });
                })
            .normalizeEmail(),
        // body will only check for name='password' in body of the view
        body(
            'password',
            'Please enter a password with at least 8 characters with text and numbers only'
        )
            .isLength({min: 8})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
    ],
    authController.postSignup);

router.post('/logout', isAuth, authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);
// :token is a dynamic parameter that we can reference in controller
router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;