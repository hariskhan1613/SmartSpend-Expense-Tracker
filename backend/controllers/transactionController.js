const { validationResult, body } = require('express-validator');
const Transaction = require('../models/Transaction');

/**
 * Validation rules for creating / updating a transaction
 */
const transactionValidation = [
    body('type').isIn(['income', 'expense']).withMessage('Type must be "income" or "expense"'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
];

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for the logged-in user with optional filters & sorting
 * @access  Private
 *
 * Query params:
 *   type       – "income" or "expense"
 *   category   – category name
 *   startDate  – ISO date string (inclusive)
 *   endDate    – ISO date string (inclusive)
 *   sortBy     – field to sort by (default: "date")
 *   order      – "asc" or "desc" (default: "desc")
 */
const getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, sortBy = 'date', order = 'desc' } = req.query;

        // Build query filter – always scoped to the current user
        const filter = { user: req.user.id };

        if (type) filter.type = type;
        if (category) filter.category = category;

        // Date range filter
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        // Build sort object
        const sortOrder = order === 'asc' ? 1 : -1;
        const sort = { [sortBy]: sortOrder };

        const transactions = await Transaction.find(filter).sort(sort);

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error.message);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
};

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
const createTransaction = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { type, category, amount, description, date } = req.body;

        const transaction = await Transaction.create({
            user: req.user.id,
            type,
            category,
            amount,
            description: description || '',
            date: date || Date.now(),
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Create transaction error:', error.message);
        res.status(500).json({ message: 'Server error creating transaction' });
    }
};

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update an existing transaction (only if it belongs to the user)
 * @access  Private
 */
const updateTransaction = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        // Find the transaction and ensure it belongs to the current user
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update allowed fields
        const { type, category, amount, description, date } = req.body;
        if (type !== undefined) transaction.type = type;
        if (category !== undefined) transaction.category = category;
        if (amount !== undefined) transaction.amount = amount;
        if (description !== undefined) transaction.description = description;
        if (date !== undefined) transaction.date = date;

        await transaction.save();

        res.json(transaction);
    } catch (error) {
        console.error('Update transaction error:', error.message);
        res.status(500).json({ message: 'Server error updating transaction' });
    }
};

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction (only if it belongs to the user)
 * @access  Private
 */
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Delete transaction error:', error.message);
        res.status(500).json({ message: 'Server error deleting transaction' });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    transactionValidation,
};
