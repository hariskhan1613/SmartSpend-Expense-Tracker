import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute – wraps routes that require authentication.
 * While the auth state is loading (initial token check) it shows a spinner.
 * If the user is not logged in, it redirects to /login.
 */
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
