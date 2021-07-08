const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    locked: {
        type: Boolean
    },
    email :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    dateOfAccountCreation:{
        type : Date,
        default : Date.now
    },
    following: {
        type: []
    },
    followers: {
        type: []
    }

})

const User = mongoose.model('User',UserSchema);

module.exports = User;