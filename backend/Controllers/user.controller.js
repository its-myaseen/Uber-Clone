const userModel = require('../Models/users.model')
const blockListTokenModel = require('../Models/blackListToken.model')
const userServices = require('../Services/user.service')

const { validationResult } = require("express-validator")
const blackListTokenModel = require('../Models/blackListToken.model')

//Controller For Creating User
module.exports.registerUser = async (req, res, next) => {
    //Extracting Validation Errors from express-validator, used during defining the route on body data
    const errors = validationResult(req);//errors
    if (!errors.isEmpty()) {//incase of any errror sending error to the frontend with status code 400
        return res.status(400).json({ errors: errors.array() });
    }

    //if there is not any error then getting fullname, email, and password from the body
    const { fullname, email, password } = req.body;

    //hashing the plain password to store in database
    const hashedPassword = await userModel.hashPassword(password);

    //creating user document in database users Collection
    const user = await userServices.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword //Hashed Password, not plain password
    })

    const token = user.generateAuthToken(); //Generating Token by Schema Defined Functions

    res.status(200).json({ token, user }) //Sending Created User and Generated Token with status code 200 to the frontend
}


//Controlling for user login
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password')
    if (!user) {
        return res.status(401).json({ message: "Invalid Email or Password" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Email or Password" })
    }

    const token = await user.generateAuthToken()
    res.cookie('token', token)
    return res.status(200).json({ user, token })
}


//controller for Getting User Profile
module.exports.getUserProfile = (req, res, next)=>{
    res.status(200).json(req.user)
}


//controller for Log Out User
module.exports.logoutUser = async(req, res, next)=>{
    res.clearCookie("token") //Removing Token from Cookie
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1] || null); //getting token from the header or cookie part of request
    await blackListTokenModel.create({token}) //saving blacklisted token in blackListToken Collection
    res.status(200).json({message: "User Logged Out Succesfuly!"})//Sending message with status code 200
}