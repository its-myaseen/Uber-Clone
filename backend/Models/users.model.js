const mongoose = require('mongoose') //importing mongoose to communicate with database server in an organized way
const bcrypt = require('bcrypt') //Importing bcrypt for hashing and comparing password purposes
const jwt = require('jsonwebtoken') //Importing JWT for token


//User Schema
const userSchema = new mongoose.Schema({
    fullname: { //Full Name consist of two parts eg;firstname and lastname.
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least Three Characters Long']
            //first name is required and should be =>3 characters, otherwise it will give an error "First name must be at least Three Characters Long"
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least Three Characters Long']
            //last name is not required it is optional, but if entered, it should be at least 3 characters long, other wise it will give  an error "Last name must be at least Three Characters Long"
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email Must be at least 5 characters Long']
        //Email is Required and it should be atleast 5 characters long and unique
    },
    password: {
        type: String,
        required: true,
        select: false,
        //passowrd is required and it will not be send by default when fetching user data
    },
    socketId: {
        type: String
        //Socket id for real time location
    }
})



//=========Methods For userSchema=============//
//Method to Generate JWT Token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this.id }, process.env.SECRET, { expiresIn: '24h' })
    return token
}

//Method to Compare Entered Password with Hashed Password of the user of given email/username
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//Hashing Password Before Saving to DataBase for Security Purpose
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}


//Creating User Model on the Basis of defined userSchema, contains methods and statics
const userModel = mongoose.model('user', userSchema)

module.exports = userModel