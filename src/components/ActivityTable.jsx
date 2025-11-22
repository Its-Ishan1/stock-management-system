import { useState } from 'react';

const activityData = [
    {
        id: 1,
        type: 'receipt',
        typeLabel: 'Receipt',
        reference: '#RCP-001',
        product: 'Steel Rods',
        quantity: '100 kg',
        location: 'Main Warehouse',
        status: 'done',
        statusLabel: 'Done',
        date: '2025-11-22'
    },
    {
        id: 2,
        type: 'delivery',
        typeLabel: 'Delivery',
        reference: '#DEL-045',
        product: 'Office Chairs',
        quantity: '20 pcs',
        location: 'Warehouse 2',
        status: 'ready',
        statusLabel: 'Ready',
        date: '2025-11-22'
    },
    {
        id: 3,
        type: 'transfer',
        typeLabel: 'Transfer',
        reference: '#TRF-012',
        product: 'Steel Rods',
        quantity: '50 kg',
        location: 'Main → Production',
        status: 'waiting',
        statusLabel: 'Waiting',
        date: '2025-11-21'
    },
    {
        id: 4,
        type: 'adjustment',
        typeLabel: 'Adjustment',
        reference: '#ADJ-008',
        product: 'Steel Rods',
        quantity: '-3 kg',
        location: 'Production Floor',
        status: 'done',
        statusLabel: 'Done',
        date: '2025-11-21'
    },
    {
        id: 5,
        type: 'receipt',
        typeLabel: 'Receipt',
        reference: '#RCP-002',
        product: 'Wooden Planks',
        quantity: '200 pcs',
        location: 'Warehouse 1',
        status: 'draft',
        statusLabel: 'Draft',
        date: '2025-11-20'
    }
];

const ActivityTable = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = ['All', 'Receipts', 'Deliveries', 'Transfers'];

    return (
        <div className="activity-section">
            <div className="section-header">
                <h3>Recent Activity</h3>
                <div className="filter-chips">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            className={`chip ${activeFilter === filter.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter.toLowerCase())}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="activity-table">
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Reference</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activityData.map((activity) => (
                            <tr key={activity.id} className="table-row">
                                <td>
                                    <span className={`type-badge ${activity.type}`}>
                                        {activity.typeLabel}
                                    </span>
                                </td>
                                <td>{activity.reference}</td>
                                <td>{activity.product}</td>
                                <td>{activity.quantity}</td>
                                <td>{activity.location}</td>
                                <td>
                                    <span className={`status-badge ${activity.status}`}>
                                        {activity.statusLabel}
                                    </span>
                                </td>
                                <td>{activity.date}</td>
                                <td>
                                    <button className="action-btn">👁️</button>
                                    <button className="action-btn">✏️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActivityTable;
