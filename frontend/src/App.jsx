import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import './App.css';

/**
 * App – root component with route definitions.
 * Auth pages (login/signup) are public.
 * Dashboard and Transactions are wrapped in ProtectedRoute.
 */
export default function App() {
    const { user, loading } = useAuth();

    // Show a loading spinner while the auth state is being resolved
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="app">
            {/* Show navbar only when user is logged in */}
            {user && <Navbar />}

            <main className={user ? 'main-content' : ''}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                    <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <ProtectedRoute>
                                <Transactions />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all: redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </div>
    );
}
