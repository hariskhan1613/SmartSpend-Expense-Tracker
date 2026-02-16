const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    transactionValidation,
} = require('../controllers/transactionController');

// All transaction routes are protected – user must be logged in
router.use(auth);

router.get('/', getTransactions);
router.post('/', transactionValidation, createTransaction);
router.put('/:id', transactionValidation, updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
