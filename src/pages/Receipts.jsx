import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect, FormNumber } from '../components/FormComponents';

const Receipts = () => {
    const { receipts, setReceipts, products, showToast } = useApp();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const location = useLocation();
    const [activeFilter, setActiveFilter] = useState('All');

    const [formData, setFormData] = useState({
        supplier: '',
        product: '',
        quantity: '',
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
            supplier: '',
            product: '',
            quantity: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const generateReceiptId = () => {
        const lastId = receipts.length > 0 ? parseInt(receipts[receipts.length - 1].refId.split('-')[1]) : 0;
        return `RCP-${String(lastId + 1).padStart(3, '0')}`;
    };

    const handleAddReceipt = (e) => {
        e.preventDefault();
        const newReceipt = {
            id: Date.now(),
            refId: generateReceiptId(),
            ...formData,
            status: 'Draft',
        };
        setReceipts([...receipts, newReceipt]);
        showToast('Receipt created successfully!', 'success');
        setIsAddModalOpen(false);
        resetForm();
    };

    const handleEditClick = (receipt) => {
        setSelectedReceipt(receipt);
        setFormData({
            supplier: receipt.supplier,
            product: receipt.product,
            quantity: receipt.quantity,
            date: receipt.date,
        });
        setIsEditModalOpen(true);
    };

    const handleEditReceipt = (e) => {
        e.preventDefault();
        setReceipts(receipts.map(r =>
            r.id === selectedReceipt.id ? { ...r, ...formData } : r
        ));
        showToast('Receipt updated successfully!', 'success');
        setIsEditModalOpen(false);
        resetForm();
    };

    const handleDeleteClick = (receipt) => {
        setSelectedReceipt(receipt);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteReceipt = () => {
        setReceipts(receipts.filter(r => r.id !== selectedReceipt.id));
        showToast('Receipt deleted successfully!', 'success');
        setSelectedReceipt(null);
    };

    const handleValidateReceipt = (receipt) => {
        setReceipts(receipts.map(r =>
            r.id === receipt.id ? { ...r, status: 'Done' } : r
        ));
        showToast(`Receipt ${receipt.refId} validated successfully!`, 'success');
    };

    const filteredReceipts = receipts.filter(receipt => {
        if (activeFilter === 'All') return true;
        return receipt.status === activeFilter;
    });

    const stats = {
        total: receipts.length,
        pending: receipts.filter(r => r.status === 'Waiting' || r.status === 'Draft').length,
        completed: receipts.filter(r => r.status === 'Done').length,
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Receipts (Incoming Stock)</h2>
                <p className="page-subtitle">Manage incoming goods from suppliers</p>
            </div>

            <div className="page-actions">
                <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <span>➕</span> Create New Receipt
                </button>
                <button className="btn-secondary" onClick={() => showToast('Bulk import coming soon!', 'info')}>
                    <span>📥</span> Bulk Import
                </button>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>All Receipts ({filteredReceipts.length})</h3>
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
                                <th>Receipt ID</th>
                                <th>Supplier</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReceipts.map((receipt) => (
                                <tr key={receipt.id} className="table-row">
                                    <td><strong>{receipt.refId}</strong></td>
                                    <td>{receipt.supplier}</td>
                                    <td>{receipt.product}</td>
                                    <td>{receipt.quantity}</td>
                                    <td>{receipt.date}</td>
                                    <td>
                                        <span className={`status-badge ${receipt.status.toLowerCase()}`}>
                                            {receipt.status}
                                        </span>
                                    </td>
                                    <td>
                                        {receipt.status !== 'Done' && (
                                            <>
                                                <button className="action-btn" onClick={() => handleEditClick(receipt)} title="Edit">✏️</button>
                                                <button className="action-btn" onClick={() => handleValidateReceipt(receipt)} title="Validate">✅</button>
                                            </>
                                        )}
                                        <button className="action-btn" onClick={() => handleDeleteClick(receipt)} title="Delete">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredReceipts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No receipts found for this filter.
                    </div>
                )}
            </div>

            <div className="info-cards-grid">
                <div className="info-card">
                    <div className="info-icon">📦</div>
                    <div className="info-content">
                        <h4>Total Receipts</h4>
                        <p className="info-value">{stats.total}</p>
                        <p className="info-subtitle">All time</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">⏳</div>
                    <div className="info-content">
                        <h4>Pending</h4>
                        <p className="info-value">{stats.pending}</p>
                        <p className="info-subtitle">Awaiting validation</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">✅</div>
                    <div className="info-content">
                        <h4>Completed</h4>
                        <p className="info-value">{stats.completed}</p>
                        <p className="info-subtitle">Successfully received</p>
                    </div>
                </div>
            </div>

            {/* Add Receipt Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Create New Receipt">
                <form onSubmit={handleAddReceipt}>
                    <div className="form-grid">
                        <FormInput
                            label="Supplier Name"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleInputChange}
                            placeholder="e.g., Steel Corp"
                            required
                        />
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
                            placeholder="e.g., 100 kg"
                            required
                        />
                        <FormInput
                            label="Receipt Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn-secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Create Receipt
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Receipt Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Receipt">
                <form onSubmit={handleEditReceipt}>
                    <div className="form-grid">
                        <FormInput
                            label="Supplier Name"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleInputChange}
                            required
                        />
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
                        <FormInput
                            label="Receipt Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                        />
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
                onConfirm={handleDeleteReceipt}
                title="Delete Receipt"
                message={`Are you sure you want to delete receipt "${selectedReceipt?.refId}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default Receipts;
