import { useState } from 'react';

const MoveHistory = () => {
    const [history] = useState([
        { id: 1, type: 'Receipt', ref: 'RCP-001', product: 'Steel Rods', quantity: '+100 kg', location: 'Main Warehouse', user: 'John Doe', date: '2025-11-22 10:30', status: 'Done' },
        { id: 2, type: 'Delivery', ref: 'DEL-045', product: 'Office Chairs', quantity: '-20 pcs', location: 'Warehouse 2', user: 'Jane Smith', date: '2025-11-22 09:15', status: 'Done' },
        { id: 3, type: 'Transfer', ref: 'TRF-012', product: 'Steel Rods', quantity: '50 kg', location: 'Main → Production', user: 'Mike Johnson', date: '2025-11-21 14:20', status: 'Waiting' },
        { id: 4, type: 'Adjustment', ref: 'ADJ-008', product: 'Steel Rods', quantity: '-3 kg', location: 'Production Floor', user: 'Sarah Williams', date: '2025-11-21 11:45', status: 'Done' },
        { id: 5, type: 'Receipt', ref: 'RCP-002', product: 'Wooden Planks', quantity: '+200 pcs', location: 'Warehouse 1', user: 'John Doe', date: '2025-11-20 16:00', status: 'Draft' },
        { id: 6, type: 'Transfer', ref: 'TRF-013', product: 'Paint Cans', quantity: '20 L', location: 'WH1 → WH2', user: 'Mike Johnson', date: '2025-11-22 08:30', status: 'Done' },
    ]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Move History</h2>
                <p className="page-subtitle">Complete audit trail of all stock movements</p>
            </div>

            <div className="page-actions">
                <button className="btn-secondary">
                    <span>📥</span> Export History
                </button>
                <button className="btn-secondary">
                    <span>🔍</span> Advanced Search
                </button>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>Stock Movement Ledger</h3>
                    <div className="filter-chips">
                        <button className="chip active">All</button>
                        <button className="chip">Receipts</button>
                        <button className="chip">Deliveries</button>
                        <button className="chip">Transfers</button>
                        <button className="chip">Adjustments</button>
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
                                <th>User</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id} className="table-row">
                                    <td>
                                        <span className={`type-badge ${item.type.toLowerCase()}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td><strong>{item.ref}</strong></td>
                                    <td>{item.product}</td>
                                    <td>
                                        <span className={item.quantity.startsWith('+') ? 'text-success' : item.quantity.startsWith('-') ? 'text-danger' : ''}>
                                            {item.quantity}
                                        </span>
                                    </td>
                                    <td>{item.location}</td>
                                    <td>{item.user}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="action-btn">👁️</button>
                                        <button className="action-btn">📄</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="info-cards-grid">
                <div className="info-card">
                    <div className="info-icon">📜</div>
                    <div className="info-content">
                        <h4>Total Movements</h4>
                        <p className="info-value">1,247</p>
                        <p className="info-subtitle">All time</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">📅</div>
                    <div className="info-content">
                        <h4>Today</h4>
                        <p className="info-value">23</p>
                        <p className="info-subtitle">Movements today</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">📊</div>
                    <div className="info-content">
                        <h4>This Month</h4>
                        <p className="info-value">456</p>
                        <p className="info-subtitle">Total movements</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoveHistory;
