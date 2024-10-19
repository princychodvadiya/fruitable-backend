const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        // address: {
        //     type: String,
        //     required: true,
        //     trim: true,
        // },
        email: {
            type: String,
            // required: true,
            trim: true,
            lowercase: true
        },
        role: {
            type: String,
            // required: true
        },
        password: {
            type: String
        },
        avtar: {
            type: {
                public_id: String,
                url: String
            }
        },
        // phone: {
        //     type: number,
        //     required: true
        // },
        RefreshToken: {
            type: String
        },
        // googleId: {
        //     type: String
        // },
        facebookId: {
            type: String
        },
        otp: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;


