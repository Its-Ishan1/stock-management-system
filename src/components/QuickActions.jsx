import { useNavigate } from 'react-router-dom';

const quickActions = [
    { id: 1, icon: '➕', text: 'New Product', path: '/products' },
    { id: 2, icon: '📥', text: 'Create Receipt', path: '/receipts' },
    { id: 3, icon: '📤', text: 'New Delivery', path: '/deliveries' },
    { id: 4, icon: '🔄', text: 'Transfer Stock', path: '/transfers' }
];

const QuickActions = () => {
    const navigate = useNavigate();

    const handleActionClick = (path) => {
        navigate(path, { state: { openModal: true } });
    };

    return (
        <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-grid">
                {quickActions.map((action) => (
                    <button
                        key={action.id}
                        className="action-card"
                        onClick={() => handleActionClick(action.path)}
                    >
                        <span className="action-icon">{action.icon}</span>
                        <span className="action-text">{action.text}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
