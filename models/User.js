const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    // Add other fields if needed
});

module.exports = mongoose.model('User', userSchema);
