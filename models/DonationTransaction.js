// models/DonationTransaction.js

const mongoose = require('mongoose');

const donationTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  usdAmountDonated: {
    type: Number,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
  // Optionally, you can add fields for charity details
  charity: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('DonationTransaction', donationTransactionSchema);
