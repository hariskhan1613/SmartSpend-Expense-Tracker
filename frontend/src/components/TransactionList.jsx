import { FiEdit2, FiTrash2 } from 'react-icons/fi';

/**
 * TransactionList – renders a table of transactions with edit/delete actions.
 *
 * Props:
 *   transactions – array of transaction objects
 *   onEdit       – callback receiving the transaction to edit
 *   onDelete     – callback receiving the transaction id to delete
 */
export default function TransactionList({ transactions, onEdit, onDelete }) {
    if (!transactions.length) {
        return (
            <div className="empty-state">
                <p>📭 No transactions found. Start by adding one!</p>
            </div>
        );
    }

    /**
     * Format a number as currency (Indian Rupees).
     */
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    /**
     * Format a date string into a readable format.
     */
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="transaction-table-wrapper">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn) => (
                        <tr key={txn._id}>
                            <td className="td-date">{formatDate(txn.date)}</td>
                            <td className="td-desc">{txn.description || '—'}</td>
                            <td>
                                <span className="category-badge">{txn.category}</span>
                            </td>
                            <td>
                                <span className={`type-badge ${txn.type}`}>
                                    {txn.type === 'income' ? '↑ Income' : '↓ Expense'}
                                </span>
                            </td>
                            <td className={`td-amount ${txn.type}`}>
                                {txn.type === 'income' ? '+' : '-'} {formatCurrency(txn.amount)}
                            </td>
                            <td className="td-actions">
                                <button className="btn-icon edit" onClick={() => onEdit(txn)} title="Edit">
                                    <FiEdit2 />
                                </button>
                                <button className="btn-icon delete" onClick={() => onDelete(txn._id)} title="Delete">
                                    <FiTrash2 />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
