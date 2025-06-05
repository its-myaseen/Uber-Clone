const mongoose = require('mongoose');
//Collection for Black Listed Token, when the user logs out, its current token will be stored in this collection, and the stored token will be automatically deleted after 24 hours
const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 // 24 hours in seconds
    }
});

module.exports = mongoose.model('BlackListToken', blackListTokenSchema);