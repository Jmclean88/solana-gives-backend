const mongoose = require('mongoose');
const FundingTransaction = require('../models/FundingTransaction');
const DonationTransaction = require('../models/DonationTransaction');
const User = require('../models/User');

// Fund Transaction
const fundTransaction = async (req, res) => {
    try {
        const { originalToken, originalTokenPrice, originalTokenQuantity, usdcFunded, transactionId } = req.body;
        const userId = req.user; // From authMiddleware

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Create funding transaction
        const fundingTransaction = new FundingTransaction({
            user: userObjectId,
            originalToken,
            originalTokenPrice,
            originalTokenQuantity,
            usdcFunded,
            transactionId,
        });

        await fundingTransaction.save();

        res.status(201).json({ message: 'Funding transaction recorded.' });
    } catch (error) {
        console.error('Error recording funding transaction:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Donate Transaction
const donateTransaction = async (req, res) => {
    try {
        const { usdAmountDonated, charity } = req.body;
        const userId = req.user; // From authMiddleware

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Create donation transaction
        const donationTransaction = new DonationTransaction({
            user: userObjectId,
            usdAmountDonated,
            charity,
        });

        await donationTransaction.save();

        res.status(201).json({ message: 'Donation transaction recorded.' });
    } catch (error) {
        console.error('Error recording donation transaction:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get Balance
const getBalance = async (req, res) => {
    try {
        const userId = req.user;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Aggregate funding transactions
        const totalFunded = await FundingTransaction.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, total: { $sum: '$usdcFunded' } } },
        ]);

        // Aggregate donation transactions
        const totalDonated = await DonationTransaction.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, total: { $sum: '$usdAmountDonated' } } },
        ]);

        const funded = totalFunded.length > 0 ? totalFunded[0].total : 0;
        const donated = totalDonated.length > 0 ? totalDonated[0].total : 0;

        const balance = funded - donated;

        res.json({ balance });
    } catch (error) {
        console.error('Error calculating balance:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const userId = req.user; // From authMiddleware
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Fetch funding transactions for the user
        const fundingTransactions = await FundingTransaction.find({ user: userObjectId })
            .populate('user', 'walletAddress')
            .lean();

        // Add type property to funding transactions
        const fundingTransactionsWithType = fundingTransactions.map((tx) => ({
            ...tx,
            type: 'funding',
        }));

        // Fetch donation transactions for the user
        const donationTransactions = await DonationTransaction.find({ user: userObjectId })
            .populate('user', 'walletAddress')
            .lean();

        // Add type property to donation transactions
        const donationTransactionsWithType = donationTransactions.map((tx) => ({
            ...tx,
            type: 'donation',
        }));

        // Combine and sort transactions by dateTime descending
        const allTransactions = [...fundingTransactionsWithType, ...donationTransactionsWithType].sort(
            (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
        );

        res.json({ transactions: allTransactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


module.exports = {
    fundTransaction,
    donateTransaction,
    getBalance,
    getAllTransactions,
};

