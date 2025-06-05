const userModel = require('../Models/users.model')


//Function to Create User in DataBase
module.exports.createUser = async ({
    firstname, lastname, email, password //getting 4 key value pairs in object form eg; firstname, lastname, email, and password for creating the user
}) => {
    if (!firstname || !email || !password) { //Checking that all required field are available or not eg; firstname, email and password
        throw new Error('All Fields are Required!')// if not then sending error "All Fields are Required!"
    }

    //If All Data is Available then creating user by UserModel on databse
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })

    //Returning the created user data
    return user
}