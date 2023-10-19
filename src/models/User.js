const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({

    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
    },
    verification: {
        type: Boolean,
    },
    date: {
        type: Date,
        default: Date.now
    },

    buff: Buffer,


});
module.exports = mongoose.model('user', UserSchema);