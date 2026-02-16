import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and provides:
 * - user / token state
 * - login, signup, logout functions
 * - loading state while checking token on mount
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On mount (or when token changes), verify the token by hitting /api/auth/me
    useEffect(() => {
        const verifyUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await API.get('/auth/me');
                setUser(data.user);
            } catch {
                // Token expired or invalid – clear everything
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, [token]);

    /**
     * Login: POST credentials and store the returned token + user.
     */
    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    /**
     * Signup: POST name/email/password and auto-login on success.
     */
    const signup = async (name, email, password) => {
        const { data } = await API.post('/auth/signup', { name, email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data;
    };

    /**
     * Logout: clear token from storage and reset state.
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom hook to access auth context from any component.
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
