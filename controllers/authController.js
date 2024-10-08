// controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { PublicKey } = require('@solana/web3.js');

// Login function
exports.login = async (req, res) => {
    try {
        const { walletAddress } = req.body;

        // Log the request body for debugging
        console.log('Request body:', req.body);
        console.log('Received walletAddress:', walletAddress);

        // Check if walletAddress is provided
        if (!walletAddress) {
            return res.status(400).json({ message: 'walletAddress is required' });
        }

        // Validate walletAddress format
        if (!isValidWalletAddress(walletAddress)) {
            return res.status(400).json({ message: 'Invalid wallet address' });
        }

        // Find or create user
        let user = await User.findOne({ walletAddress });
        if (!user) {
            user = new User({ walletAddress });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Function to validate wallet address
function isValidWalletAddress(walletAddress) {
    try {
        new PublicKey(walletAddress);
        return true;
    } catch (error) {
        console.error('Invalid wallet address:', error);
        return false;
    }
}
