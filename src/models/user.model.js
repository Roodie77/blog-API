const mongoose = require('mongoose');


const userschema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    profilePicture: {
        url: { type: String, default: null },
        publicId: { type: String, default: null }
    },
},
{    timestamps: true
});



const User = mongoose.model('User', userschema);
module.exports = UserModel = User
;