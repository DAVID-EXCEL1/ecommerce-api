const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter a name'],
        },
        email: {
            type: String,
            required: [true, 'Please enter an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please enter a password'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model('User', userSchema);
