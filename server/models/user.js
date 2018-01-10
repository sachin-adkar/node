const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        minlength: 3
    }, email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            async: false,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    room:{
        type:String
    }
});



UserSchema.statics.findUser = async function (uname, upassword) {

    User = this;
    // console.log("User", User)
    var user = await User.findOne({
        "name": uname
    });
    if (user) {
        return user;

    } else {
        return Promise.reject();
    }
}


var User = mongoose.model('User', UserSchema);

module.exports = { User }