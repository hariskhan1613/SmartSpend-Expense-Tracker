import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Signup page – name, email & password form.
 * On success, user is auto-logged-in and redirected to the dashboard.
 */
export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await signup(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">💸</span>
                    <h1>Create Account</h1>
                    <p>Start tracking your finances with SmartSpend</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
