import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useApp();

    const isAdmin = user?.role === 'admin';

    const navItems = [
        { id: 'dashboard', path: '/dashboard', icon: '📊', text: 'Dashboard' },
        // Admin sees "Products" (Management), User sees "Marketplace" (Shopping)
        { id: 'products', path: '/products', icon: isAdmin ? '📦' : '🛒', text: isAdmin ? 'Products' : 'Marketplace' },
        // Admin only items
        ...(isAdmin ? [
            { id: 'receipts', path: '/receipts', icon: '📥', text: 'Receipts' },
            { id: 'deliveries', path: '/deliveries', icon: '📤', text: 'Deliveries' },
            { id: 'transfers', path: '/transfers', icon: '🔄', text: 'Transfers' },
            { id: 'adjustments', path: '/adjustments', icon: '⚙️', text: 'Adjustments' },
            { id: 'history', path: '/history', icon: '📜', text: 'Move History' },
        ] : [
            // User only items (subset)
            { id: 'orders', path: '/receipts', icon: '🛍️', text: 'My Orders' }, // Reusing receipts page for orders for now
            // Maybe deliveries for tracking?
            { id: 'deliveries', path: '/deliveries', icon: '🚚', text: 'My Deliveries' },
        ]),
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="logo">
                    <div className="logo-icon">📦</div>
                    <h1>StockMaster</h1>
                </div>

                <nav className="nav-menu">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => window.innerWidth <= 1024 && onClose()}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.text}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">👤</div>
                        <div className="user-info">
                            <p className="user-name">{user?.name || 'User'}</p>
                            <p className="user-role">{user?.role || 'Staff'}</p>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={logout}>
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
