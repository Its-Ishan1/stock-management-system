import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { notificationsAPI } from '../services/api';

const TopBar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { notifications: contextNotifications, setNotifications } = useApp();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: [],
        warehouse: [],
        dateRange: '',
        category: []
    });

    const notificationRef = useRef(null);
    const filterRef = useRef(null);
    const unreadCount = (contextNotifications || []).filter(n => !n.read).length;
    const activeFilterCount = Object.values(filters).flat().filter(Boolean).length;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };

        if (showNotifications || showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications, showFilters]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowFilters(false);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
        setShowNotifications(false);
    };

    const handleNotificationClick = async (notification) => {
        await markAsRead(notification.id);

        if (notification.message.includes('Order')) {
            navigate('/receipts'); // Receipts page usually handles orders
        } else if (notification.message.includes('Transfer')) {
            navigate('/transfers');
        } else if (notification.message.includes('Stock') || notification.message.includes('Product')) {
            navigate('/products');
        } else if (notification.message.includes('Delivery')) {
            navigate('/deliveries');
        }

        setShowNotifications(false);
    };

    const markAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(contextNotifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(contextNotifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'warning': return '⚠️';
            case 'success': return '✅';
            case 'info': return 'ℹ️';
            default: return '🔔';
        }
    };

    const handleFilterChange = (category, value) => {
        setFilters(prev => {
            const currentValues = prev[category];
            if (Array.isArray(currentValues)) {
                const newValues = currentValues.includes(value)
                    ? currentValues.filter(v => v !== value)
                    : [...currentValues, value];
                return { ...prev, [category]: newValues };
            } else {
                return { ...prev, [category]: value };
            }
        });
    };

    const clearFilters = () => {
        setFilters({
            status: [],
            warehouse: [],
            dateRange: '',
            category: []
        });
    };

    const applyFilters = () => {
        // Here you would typically apply the filters to your data
        console.log('Applying filters:', filters);
        setShowFilters(false);
    };

    return (
        <div className="top-bar">
            <button className="menu-toggle" onClick={onMenuClick}>
                <span className="menu-icon">☰</span>
            </button>
            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input type="text" placeholder="Search products, SKU, transactions..." />
            </div>
            <div className="top-bar-actions">
                <div className="notification-container" ref={notificationRef}>
                    <button
                        className={`notification-btn ${showNotifications ? 'active' : ''}`}
                        onClick={toggleNotifications}
                    >
                        🔔
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notification-header">
                                <h3>Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        className="mark-all-read"
                                        onClick={markAllAsRead}
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="notification-list">
                                {(contextNotifications || []).map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                        onClick={() => handleNotificationClick(notification)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="notification-icon">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="notification-content">
                                            <h4>{notification.title}</h4>
                                            <p>{notification.message}</p>
                                            <span className="notification-time">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {!notification.read && <div className="unread-dot"></div>}
                                    </div>
                                ))}
                                {(!contextNotifications || contextNotifications.length === 0) && (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No notifications yet
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="filter-container" ref={filterRef}>
                    <button
                        className={`filter-btn ${showFilters ? 'active' : ''}`}
                        onClick={toggleFilters}
                    >
                        <span>⚙️</span> Filters
                        {activeFilterCount > 0 && <span className="badge">{activeFilterCount}</span>}
                    </button>

                    {showFilters && (
                        <div className="filter-dropdown">
                            <div className="filter-header">
                                <h3>Filter Options</h3>
                                {activeFilterCount > 0 && (
                                    <button className="clear-filters" onClick={clearFilters}>
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="filter-content">
                                {/* Status Filter */}
                                <div className="filter-group">
                                    <label className="filter-label">Status</label>
                                    <div className="filter-options">
                                        {['Done', 'Ready', 'Waiting', 'Draft'].map(status => (
                                            <label key={status} className="filter-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.status.includes(status)}
                                                    onChange={() => handleFilterChange('status', status)}
                                                />
                                                <span>{status}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Warehouse Filter */}
                                <div className="filter-group">
                                    <label className="filter-label">Warehouse</label>
                                    <div className="filter-options">
                                        {['Warehouse A', 'Warehouse B', 'Warehouse C', 'Main Storage'].map(warehouse => (
                                            <label key={warehouse} className="filter-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.warehouse.includes(warehouse)}
                                                    onChange={() => handleFilterChange('warehouse', warehouse)}
                                                />
                                                <span>{warehouse}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Date Range Filter */}
                                <div className="filter-group">
                                    <label className="filter-label">Date Range</label>
                                    <select
                                        className="filter-select"
                                        value={filters.dateRange}
                                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                    >
                                        <option value="">All Time</option>
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                        <option value="quarter">This Quarter</option>
                                    </select>
                                </div>

                                {/* Category Filter */}
                                <div className="filter-group">
                                    <label className="filter-label">Product Category</label>
                                    <div className="filter-options">
                                        {['Electronics', 'Accessories', 'Computers', 'Mobile Devices'].map(category => (
                                            <label key={category} className="filter-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.category.includes(category)}
                                                    onChange={() => handleFilterChange('category', category)}
                                                />
                                                <span>{category}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="filter-actions">
                                <button className="btn-secondary" onClick={clearFilters}>
                                    Clear
                                </button>
                                <button className="btn-primary" onClick={applyFilters}>
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;

