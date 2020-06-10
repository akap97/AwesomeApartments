const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
const User = new Schema({
    firstname: {
        type: String,
        required: false,
        unique: false
    },
    lastname: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    }
    
},{
    timestamps: true
});
User.plugin(passportLocalMongoose);
var Users = mongoose.model('User', User);

module.exports = Users;