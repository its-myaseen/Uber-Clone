var express = require('express');
var router = express.Router();
const userController = require('../Controllers/user.controller')
const authMiddleware = require('../Middlewares/auth.middleware')

const { body } = require('express-validator')


//Route for Registering Users
router.post('/register', [//Express Validation, its result is extracted at '../Controllers/user.controller'
  body('email').isEmail().withMessage('Invalid Email'), //Validating Email
  body('fullname.firstname').isLength({min:3}).withMessage('First Name must be at least 3 characters long'), //Validating First Name
  body('password').isLength({min:6}).withMessage('Password must be at Least 6 characters long') //Validating Password
  //Incase of Wrong Data, error with respect to validation is extracted. result is extracted at '../Controllers/user.controller'
], userController.registerUser)


//Route for user Login
router.post('/login', [//Express Validation, its result is extracted at '../Controllers/user.controller'
  body('email').isEmail().withMessage('Invalid Email'),//Validating Email
  body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long')//Validating Password
   //Incase of Wrong Data, error with respect to validation is extracted. result is extracted at '../Controllers/user.controller'
], userController.loginUser)

//Route for user Profile
router.get('/profile', authMiddleware.authUser ,userController.getUserProfile)


//Route for user logout
router.post('/logout', userController.logoutUser)

//Exporting User Routers
module.exports = router;
