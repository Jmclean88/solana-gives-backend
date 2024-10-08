// models/FundingTransaction.js

const mongoose = require('mongoose');

const fundingTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    originalToken: {
        type: String,
        required: true,
    },
    originalTokenPrice: {
        type: Number,
        required: true,
    },
    originalTokenQuantity: {
        type: Number,
        required: true,
    },
    usdcFunded: {
        type: Number,
        required: true,
    },
    dateTime: {
        type: Date,
        default: Date.now,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('FundingTransaction', fundingTransactionSchema);
