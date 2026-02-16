import { useState, useEffect } from 'react';

/**
 * Predefined categories for income and expense transactions.
 */
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

/**
 * TransactionForm – reusable form for adding and editing transactions.
 *
 * Props:
 *   onSubmit    – callback receiving form data { type, category, amount, description, date }
 *   initialData – (optional) object of existing values when editing
 *   onCancel    – (optional) callback to cancel editing mode
 */
export default function TransactionForm({ onSubmit, initialData = null, onCancel = null }) {
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    // Pre-fill the form when editing
    useEffect(() => {
        if (initialData) {
            setType(initialData.type || 'expense');
            setCategory(initialData.category || '');
            setAmount(initialData.amount?.toString() || '');
            setDescription(initialData.description || '');
            setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        }
    }, [initialData]);

    // Category list changes based on selected type
    const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!category) return setError('Please select a category');
        if (!amount || parseFloat(amount) <= 0) return setError('Please enter a valid amount');

        onSubmit({
            type,
            category,
            amount: parseFloat(amount),
            description,
            date,
        });

        // Reset form only when adding (not editing)
        if (!initialData) {
            setCategory('');
            setAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    };

    return (
        <form className="transaction-form" onSubmit={handleSubmit}>
            <h3>{initialData ? '✏️ Edit Transaction' : '➕ Add Transaction'}</h3>

            {error && <div className="form-error">{error}</div>}

            {/* Type toggle */}
            <div className="type-toggle">
                <button
                    type="button"
                    className={`toggle-btn ${type === 'income' ? 'active income' : ''}`}
                    onClick={() => { setType('income'); setCategory(''); }}
                >
                    Income
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
                    onClick={() => { setType('expense'); setCategory(''); }}
                >
                    Expense
                </button>
            </div>

            {/* Category select */}
            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Amount */}
            <div className="form-group">
                <label htmlFor="amount">Amount (₹)</label>
                <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            {/* Description */}
            <div className="form-group">
                <label htmlFor="description">Description (optional)</label>
                <input
                    id="description"
                    type="text"
                    placeholder="e.g., Lunch with friends"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Date */}
            <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Update' : 'Add Transaction'}
                </button>
                {onCancel && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
