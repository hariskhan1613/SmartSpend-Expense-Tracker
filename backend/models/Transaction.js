const mongoose = require('mongoose');

/**
 * Transaction Schema
 * Each transaction belongs to a user (via the `user` ref).
 * `type` distinguishes income from expense.
 * `category` groups transactions for charting & filtering.
 */
const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Speeds up per-user queries
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: [true, 'Transaction type is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound index for efficient querying by user + date range
transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
