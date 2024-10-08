const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes below
router.use(authMiddleware);


router.post('/fund', transactionController.fundTransaction);
router.post('/donate', transactionController.donateTransaction);

router.get('/balance', transactionController.getBalance);
router.get('/all', transactionController.getAllTransactions);

// Export the router
module.exports = router;
