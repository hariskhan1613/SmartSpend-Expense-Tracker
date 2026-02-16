import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBarChart2, FiList, FiLogOut } from 'react-icons/fi';

/**
 * Navbar – top navigation bar
 * Shows logo, nav links (Dashboard / Transactions), user greeting, and logout.
 */
export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="logo-icon">💸</span>
                <span className="logo-text">SmartSpend</span>
            </div>

            <div className="navbar-links">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                    <FiBarChart2 /> Dashboard
                </NavLink>
                <NavLink
                    to="/transactions"
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                    <FiList /> Transactions
                </NavLink>
            </div>

            <div className="navbar-user">
                <span className="user-greeting">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                <button className="btn-logout" onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </div>
        </nav>
    );
}
