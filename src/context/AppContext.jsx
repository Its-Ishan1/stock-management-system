import { createContext, useContext, useState, useEffect } from 'react';
import { initializeSocket, disconnectSocket, getSocket } from '../services/socket';
import { productsAPI, ordersAPI, deliveriesAPI, transfersAPI, notificationsAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // User State
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    // Data State
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);

    // Legacy states for compatibility
    const [receipts, setReceipts] = useState([]);
    const [adjustments, setAdjustments] = useState([]);

    // Toast State
    const [toasts, setToasts] = useState([]);

    // Toast Functions
    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    // Auth Functions
    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);

        // Initialize WebSocket connection
        initializeSocket(token);
        setupSocketListeners();

        // Load initial data
        loadAllData();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        disconnectSocket();

        // Clear all data
        setProducts([]);
        setOrders([]);
        setDeliveries([]);
        setTransfers([]);
        setNotifications([]);
    };

    // Load all data from API
    const loadAllData = async () => {
        try {
            const [productsRes, ordersRes, deliveriesRes, transfersRes, notificationsRes] = await Promise.all([
                productsAPI.getAll(),
                ordersAPI.getAll(),
                deliveriesAPI.getAll(),
                transfersAPI.getAll(),
                notificationsAPI.getAll()
            ]);

            setProducts(productsRes.data);
            setOrders(ordersRes.data);
            setDeliveries(deliveriesRes.data);
            setTransfers(transfersRes.data);
            setNotifications(notificationsRes.data);
        } catch (error) {
            console.error('Failed to load data:', error);
            showToast('Failed to load data', 'error');
        }
    };

    // Setup WebSocket listeners for real-time updates
    const setupSocketListeners = () => {
        const socket = getSocket();
        if (!socket) return;

        // Product events
        socket.on('product:created', (product) => {
            setProducts(prev => [product, ...prev]);
            showToast(`New product added: ${product.name}`, 'success');
        });

        socket.on('product:updated', (product) => {
            setProducts(prev => prev.map(p => p.id === product.id ? product : p));
            showToast(`Product updated: ${product.name}`, 'info');
        });

        socket.on('product:deleted', ({ id }) => {
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Product deleted', 'info');
        });

        // Order events
        socket.on('order:created', (order) => {
            setOrders(prev => [order, ...prev]);
            showToast(`New order: ${order.orderNumber}`, 'success');
        });

        socket.on('order:updated', (order) => {
            setOrders(prev => prev.map(o => o.id === order.id ? order : o));
        });

        // Delivery events
        socket.on('delivery:created', (delivery) => {
            setDeliveries(prev => [delivery, ...prev]);
            showToast(`New delivery: ${delivery.trackingNumber}`, 'success');
        });

        socket.on('delivery:updated', (delivery) => {
            setDeliveries(prev => prev.map(d => d.id === delivery.id ? delivery : d));
        });

        // Transfer events
        socket.on('transfer:created', (transfer) => {
            setTransfers(prev => [transfer, ...prev]);
            showToast('New transfer created', 'success');
        });

        socket.on('transfer:updated', (transfer) => {
            setTransfers(prev => prev.map(t => t.id === transfer.id ? transfer : t));
        });

        // Notification events
        socket.on('notification:new', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            showToast(notification.title, notification.type);
        });
    };

    // Initialize on mount if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (user && token) {
            initializeSocket(token);
            setupSocketListeners();
            loadAllData();
        }

        return () => {
            disconnectSocket();
        };
    }, []);

    const value = {
        user,
        login,
        logout,
        products,
        setProducts,
        orders,
        setOrders,
        deliveries,
        setDeliveries,
        transfers,
        setTransfers,
        notifications,
        setNotifications,
        dashboardStats,
        setDashboardStats,
        receipts,
        setReceipts,
        adjustments,
        setAdjustments,
        toasts,
        showToast,
        loadAllData
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
