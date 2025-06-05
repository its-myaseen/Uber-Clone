const mongoose = require('mongoose');

const connectToDb = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(() => {
        console.log('✅ Connected to database')
    }).catch((err) => {
        console.log(`❌ An error occurred: ${err}`)
    });
};

module.exports = connectToDb;
