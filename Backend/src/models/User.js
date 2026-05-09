// Import Mongoose
const mongoose = require('mongoose');

// Create User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    passwordHash: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required if googleId is not present
        },
    },
    profileImage: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        default: null
    }
}, {timestamps: true});

//Export User model
module.exports = mongoose.model('User', userSchema);
