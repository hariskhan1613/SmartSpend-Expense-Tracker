const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// ──── Middleware ────
// Enable CORS for the React frontend (Vite runs on port 5173 by default)
app.use(cors({ origin: ['http://localhost:5173', 'https://smart-spend-expense-tracker-163vqok1g-hariskhan1613s-projects.vercel.app'], credentials: true }));
// Parse JSON request bodies
app.use(express.json());

// ──── Routes ────
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check route
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'SmartSpend API is running 🚀' });
});

// ──── Global error handler ────
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// ──── Start server ────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 SmartSpend API server running on http://localhost:${PORT}`);
    });
});
