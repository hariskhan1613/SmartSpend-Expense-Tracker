import { useEffect, useState } from 'react';
import API from '../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

/**
 * Color palette for the pie chart slices.
 */
const PIE_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

/**
 * Dashboard – overview page with summary cards and charts.
 */
export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const { data } = await API.get('/transactions');
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // ── Compute summary stats ──
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // ── Monthly chart data: aggregate income & expense per month ──
    const monthlyData = (() => {
        const map = {};
        transactions.forEach((t) => {
            const d = new Date(t.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!map[key]) map[key] = { month: key, income: 0, expense: 0 };
            if (t.type === 'income') map[key].income += t.amount;
            else map[key].expense += t.amount;
        });
        return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
    })();

    // ── Category-wise expense breakdown for the pie chart ──
    const categoryData = (() => {
        const map = {};
        transactions
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                map[t.category] = (map[t.category] || 0) + t.amount;
            });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    })();

    /**
     * Format a number as INR currency.
     */
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h2 className="page-title">📊 Dashboard</h2>

            {/* ── Summary Cards ── */}
            <div className="summary-cards">
                <div className="card card-income">
                    <div className="card-icon"><FiTrendingUp /></div>
                    <div className="card-content">
                        <span className="card-label">Total Income</span>
                        <span className="card-value">{formatCurrency(totalIncome)}</span>
                    </div>
                </div>

                <div className="card card-expense">
                    <div className="card-icon"><FiTrendingDown /></div>
                    <div className="card-content">
                        <span className="card-label">Total Expenses</span>
                        <span className="card-value">{formatCurrency(totalExpense)}</span>
                    </div>
                </div>

                <div className={`card card-balance ${balance >= 0 ? 'positive' : 'negative'}`}>
                    <div className="card-icon"><FiDollarSign /></div>
                    <div className="card-content">
                        <span className="card-label">Current Balance</span>
                        <span className="card-value">{formatCurrency(balance)}</span>
                    </div>
                </div>
            </div>

            {/* ── Charts ── */}
            <div className="charts-grid">
                {/* Monthly Income vs Expense Bar Chart */}
                <div className="chart-card">
                    <h3>Monthly Overview</h3>
                    {monthlyData.length ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                                    labelStyle={{ color: '#e2e8f0' }}
                                />
                                <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="chart-empty">No data yet. Add some transactions!</p>
                    )}
                </div>

                {/* Category-wise Expense Pie Chart */}
                <div className="chart-card">
                    <h3>Expense Breakdown</h3>
                    {categoryData.length ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="chart-empty">No expenses yet to break down.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
