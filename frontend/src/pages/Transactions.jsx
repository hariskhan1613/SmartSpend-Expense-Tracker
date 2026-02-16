import { useEffect, useState } from 'react';
import API from '../api/axios';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

/**
 * Transactions page – full transaction management with add/edit/delete and filters.
 */
export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // transaction being edited (or null)

    // ── Filter & Sort state ──
    const [filterType, setFilterType] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterType, filterCategory, startDate, endDate, sortBy, sortOrder]);

    /**
     * Fetch transactions with current filter/sort params.
     */
    const fetchTransactions = async () => {
        try {
            const params = {};
            if (filterType) params.type = filterType;
            if (filterCategory) params.category = filterCategory;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            params.sortBy = sortBy;
            params.order = sortOrder;

            const { data } = await API.get('/transactions', { params });
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Add a new transaction.
     */
    const handleAdd = async (formData) => {
        try {
            await API.post('/transactions', formData);
            fetchTransactions();
        } catch (error) {
            console.error('Failed to add transaction:', error);
            alert(error.response?.data?.message || 'Failed to add transaction');
        }
    };

    /**
     * Update an existing transaction.
     */
    const handleUpdate = async (formData) => {
        try {
            await API.put(`/transactions/${editing._id}`, formData);
            setEditing(null);
            fetchTransactions();
        } catch (error) {
            console.error('Failed to update transaction:', error);
            alert(error.response?.data?.message || 'Failed to update transaction');
        }
    };

    /**
     * Delete a transaction by ID.
     */
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;
        try {
            await API.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    /**
     * Reset all filters.
     */
    const handleResetFilters = () => {
        setFilterType('');
        setFilterCategory('');
        setStartDate('');
        setEndDate('');
        setSortBy('date');
        setSortOrder('desc');
    };

    // Gather unique categories from current transactions for the filter dropdown
    const uniqueCategories = [...new Set(transactions.map((t) => t.category))].sort();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="transactions-page">
            <h2 className="page-title">💰 Transactions</h2>

            <div className="transactions-layout">
                {/* ── Left side: Add / Edit form ── */}
                <div className="transactions-form-panel">
                    <TransactionForm
                        onSubmit={editing ? handleUpdate : handleAdd}
                        initialData={editing}
                        onCancel={editing ? () => setEditing(null) : null}
                    />
                </div>

                {/* ── Right side: Filters + List ── */}
                <div className="transactions-list-panel">
                    {/* Filters bar */}
                    <div className="filters-bar">
                        <h3>🔍 Filters</h3>
                        <div className="filters-row">
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <option value="">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="">All Categories</option>
                                {uniqueCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Start date"
                            />

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="End date"
                            />

                            <select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
                                const [s, o] = e.target.value.split('-');
                                setSortBy(s);
                                setSortOrder(o);
                            }}>
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="amount-desc">Amount: High → Low</option>
                                <option value="amount-asc">Amount: Low → High</option>
                            </select>

                            <button className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Transaction table */}
                    <TransactionList
                        transactions={transactions}
                        onEdit={(txn) => setEditing(txn)}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
}
