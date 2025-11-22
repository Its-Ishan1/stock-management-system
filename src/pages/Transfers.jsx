import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect } from '../components/FormComponents';

const Transfers = () => {
    const location = useLocation();
    const { transfers, setTransfers, products, warehouses, showToast } = useApp();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const [formData, setFormData] = useState({
        product: '',
        quantity: '',
        from: '',
        to: '',
        date: new Date().toISOString().split('T')[0],
    });

    // Auto-open modal when navigated from Quick Actions
    useEffect(() => {
        if (location.state?.openModal) {
            setIsAddModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            product: '',
            quantity: '',
            from: '',
            to: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const generateTransferId = () => {
        const lastId = transfers.length > 0 ? parseInt(transfers[transfers.length - 1].refId.split('-')[1]) : 11;
        return `TRF-${String(lastId + 1).padStart(3, '0')}`;
    };

    const handleAddTransfer = (e) => {
        e.preventDefault();
        if (formData.from === formData.to) {
            showToast('Source and destination cannot be the same!', 'error');
            return;
        }
        const newTransfer = {
            id: Date.now(),
            refId: generateTransferId(),
            ...formData,
            status: 'Draft',
        };
        setTransfers([...transfers, newTransfer]);
        showToast('Transfer created successfully!', 'success');
        setIsAddModalOpen(false);
        resetForm();
    };

    const handleEditClick = (transfer) => {
        setSelectedTransfer(transfer);
        setFormData({
            product: transfer.product,
            quantity: transfer.quantity,
            from: transfer.from,
            to: transfer.to,
            date: transfer.date,
        });
        setIsEditModalOpen(true);
    };

    const handleEditTransfer = (e) => {
        e.preventDefault();
        if (formData.from === formData.to) {
            showToast('Source and destination cannot be the same!', 'error');
            return;
        }
        setTransfers(transfers.map(t =>
            t.id === selectedTransfer.id ? { ...t, ...formData } : t
        ));
        showToast('Transfer updated successfully!', 'success');
        setIsEditModalOpen(false);
        resetForm();
    };

    const handleDeleteClick = (transfer) => {
        setSelectedTransfer(transfer);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteTransfer = () => {
        setTransfers(transfers.filter(t => t.id !== selectedTransfer.id));
        showToast('Transfer deleted successfully!', 'success');
        setSelectedTransfer(null);
    };

    const handleValidateTransfer = (transfer) => {
        setTransfers(transfers.map(t =>
            t.id === transfer.id ? { ...t, status: 'Done' } : t
        ));
        showToast(`Transfer ${transfer.refId} completed successfully!`, 'success');
    };

    const filteredTransfers = transfers.filter(transfer => {
        if (activeFilter === 'All') return true;
        return transfer.status === activeFilter;
    });

    const stats = {
        total: transfers.length,
        pending: transfers.filter(t => t.status === 'Waiting' || t.status === 'Draft').length,
        completed: transfers.filter(t => t.status === 'Done').length,
    };

    const locations = warehouses.map(w => ({ value: w.name, label: w.name }));

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Internal Transfers</h2>
                <p className="page-subtitle">Move stock between warehouses and locations</p>
            </div>

            <div className="page-actions">
                <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <span>➕</span> Create Transfer
                </button>
                <button className="btn-secondary" onClick={() => showToast('Bulk transfer coming soon!', 'info')}>
                    <span>🔄</span> Bulk Transfer
                </button>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>All Transfers ({filteredTransfers.length})</h3>
                    <div className="filter-chips">
                        {['All', 'Draft', 'Waiting', 'Done'].map(filter => (
                            <button
                                key={filter}
                                className={`chip ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
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
                                <th>Transfer ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransfers.map((transfer) => (
                                <tr key={transfer.id} className="table-row">
                                    <td><strong>{transfer.refId}</strong></td>
                                    <td>{transfer.product}</td>
                                    <td>{transfer.quantity}</td>
                                    <td>{transfer.from}</td>
                                    <td>{transfer.to}</td>
                                    <td>{transfer.date}</td>
                                    <td>
                                        <span className={`status-badge ${transfer.status.toLowerCase()}`}>
                                            {transfer.status}
                                        </span>
                                    </td>
                                    <td>
                                        {transfer.status !== 'Done' && (
                                            <>
                                                <button className="action-btn" onClick={() => handleEditClick(transfer)} title="Edit">✏️</button>
                                                <button className="action-btn" onClick={() => handleValidateTransfer(transfer)} title="Complete">✅</button>
                                            </>
                                        )}
                                        <button className="action-btn" onClick={() => handleDeleteClick(transfer)} title="Delete">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTransfers.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No transfers found for this filter.
                    </div>
                )}
            </div>

            <div className="info-cards-grid">
                <div className="info-card">
                    <div className="info-icon">🔄</div>
                    <div className="info-content">
                        <h4>Total Transfers</h4>
                        <p className="info-value">{stats.total}</p>
                        <p className="info-subtitle">All time</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">⏳</div>
                    <div className="info-content">
                        <h4>Pending</h4>
                        <p className="info-value">{stats.pending}</p>
                        <p className="info-subtitle">Scheduled</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">✅</div>
                    <div className="info-content">
                        <h4>Completed</h4>
                        <p className="info-value">{stats.completed}</p>
                        <p className="info-subtitle">Successfully transferred</p>
                    </div>
                </div>
            </div>

            {/* Add Transfer Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Create Transfer">
                <form onSubmit={handleAddTransfer}>
                    <div className="form-grid">
                        <FormSelect
                            label="Product"
                            name="product"
                            value={formData.product}
                            onChange={handleInputChange}
                            options={products.map(p => ({ value: p.name, label: p.name }))}
                            required
                        />
                        <FormInput
                            label="Quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            placeholder="e.g., 50 kg"
                            required
                        />
                        <FormSelect
                            label="From Location"
                            name="from"
                            value={formData.from}
                            onChange={handleInputChange}
                            options={locations}
                            required
                        />
                        <FormSelect
                            label="To Location"
                            name="to"
                            value={formData.to}
                            onChange={handleInputChange}
                            options={locations}
                            required
                        />
                        <div className="form-grid-full">
                            <FormInput
                                label="Transfer Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn-secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Create Transfer
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Transfer Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Transfer">
                <form onSubmit={handleEditTransfer}>
                    <div className="form-grid">
                        <FormSelect
                            label="Product"
                            name="product"
                            value={formData.product}
                            onChange={handleInputChange}
                            options={products.map(p => ({ value: p.name, label: p.name }))}
                            required
                        />
                        <FormInput
                            label="Quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                        />
                        <FormSelect
                            label="From Location"
                            name="from"
                            value={formData.from}
                            onChange={handleInputChange}
                            options={locations}
                            required
                        />
                        <FormSelect
                            label="To Location"
                            name="to"
                            value={formData.to}
                            onChange={handleInputChange}
                            options={locations}
                            required
                        />
                        <div className="form-grid-full">
                            <FormInput
                                label="Transfer Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn-secondary" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteTransfer}
                title="Delete Transfer"
                message={`Are you sure you want to delete transfer "${selectedTransfer?.refId}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default Transfers;
