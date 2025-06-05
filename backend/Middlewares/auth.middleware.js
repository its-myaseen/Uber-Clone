const userModel = require('../Models/users.model')
const blackListTokenModel = require('../Models/blackListToken.model') //Collection of Black List Tokens
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.authUser = async (req, res, next)=>{
    //extracting token from header or cookies
    const token = req.cookies.token || (req.headers.authorization?.split(' ')[1] || null);

    if(!token){//if token is not extracted it will send an error "Unauthorized" with status code 401
        return res.status(401).json({message: "Unauthorized"})
    }

    const isBlackListed = await blackListTokenModel.findOne({token:token}) //checking, whether the extracted token is black listed or not, if true then it will send an error "Unauthorized" with error code of 401
    if(isBlackListed){
        return res.status(401).json({message: "Unauthorized"})
    }
    
    try{
        const decoded = jwt.verify(token, process.env.SECRET) //Verification of jwt token by SECRET
        const user = await userModel.findById(decoded._id) //finding user by the extracted id from token

        req.user = user //setting req.user to the extracted user data

        return next() //transfering control to the controller from this middleware
    }catch (err){//if there is any error in the above veification part, it will send an error in the message
        return res.status(401).json({message: err})
    }
}

