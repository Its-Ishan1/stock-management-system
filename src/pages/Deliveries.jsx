import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect } from '../components/FormComponents';

const Deliveries = () => {
    const location = useLocation();
    const { deliveries, setDeliveries, products, showToast } = useApp();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const [formData, setFormData] = useState({
        customer: '',
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
            customer: '',
            product: '',
            quantity: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const generateDeliveryId = () => {
        const lastId = deliveries.length > 0 ? parseInt(deliveries[deliveries.length - 1].refId.split('-')[1]) : 44;
        return `DEL-${String(lastId + 1).padStart(3, '0')}`;
    };

    const handleAddDelivery = (e) => {
        e.preventDefault();
        const newDelivery = {
            id: Date.now(),
            refId: generateDeliveryId(),
            ...formData,
            status: 'Draft',
        };
        setDeliveries([...deliveries, newDelivery]);
        showToast('Delivery order created successfully!', 'success');
        setIsAddModalOpen(false);
        resetForm();
    };

    const handleEditClick = (delivery) => {
        setSelectedDelivery(delivery);
        setFormData({
            customer: delivery.customer,
            product: delivery.product,
            quantity: delivery.quantity,
            date: delivery.date,
        });
        setIsEditModalOpen(true);
    };

    const handleEditDelivery = (e) => {
        e.preventDefault();
        setDeliveries(deliveries.map(d =>
            d.id === selectedDelivery.id ? { ...d, ...formData } : d
        ));
        showToast('Delivery updated successfully!', 'success');
        setIsEditModalOpen(false);
        resetForm();
    };

    const handleDeleteClick = (delivery) => {
        setSelectedDelivery(delivery);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteDelivery = () => {
        setDeliveries(deliveries.filter(d => d.id !== selectedDelivery.id));
        showToast('Delivery deleted successfully!', 'success');
        setSelectedDelivery(null);
    };

    const handleMarkAsReady = (delivery) => {
        setDeliveries(deliveries.map(d =>
            d.id === delivery.id ? { ...d, status: 'Ready' } : d
        ));
        showToast(`Delivery ${delivery.refId} marked as ready!`, 'success');
    };

    const handleShip = (delivery) => {
        setDeliveries(deliveries.map(d =>
            d.id === delivery.id ? { ...d, status: 'Done' } : d
        ));
        showToast(`Delivery ${delivery.refId} shipped successfully!`, 'success');
    };

    const filteredDeliveries = deliveries.filter(delivery => {
        if (activeFilter === 'All') return true;
        return delivery.status === activeFilter;
    });

    const stats = {
        total: deliveries.length,
        ready: deliveries.filter(d => d.status === 'Ready').length,
        delivered: deliveries.filter(d => d.status === 'Done').length,
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Delivery Orders (Outgoing Stock)</h2>
                <p className="page-subtitle">Manage outgoing shipments to customers</p>
            </div>

            <div className="page-actions">
                <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <span>➕</span> Create Delivery Order
                </button>
                <button className="btn-secondary" onClick={() => showToast('Batch picking coming soon!', 'info')}>
                    <span>📦</span> Batch Picking
                </button>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>All Delivery Orders ({filteredDeliveries.length})</h3>
                    <div className="filter-chips">
                        {['All', 'Draft', 'Ready', 'Done'].map(filter => (
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
                                <th>Delivery ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map((delivery) => (
                                <tr key={delivery.id} className="table-row">
                                    <td><strong>{delivery.refId}</strong></td>
                                    <td>{delivery.customer}</td>
                                    <td>{delivery.product}</td>
                                    <td>{delivery.quantity}</td>
                                    <td>{delivery.date}</td>
                                    <td>
                                        <span className={`status-badge ${delivery.status.toLowerCase()}`}>
                                            {delivery.status}
                                        </span>
                                    </td>
                                    <td>
                                        {delivery.status === 'Draft' && (
                                            <>
                                                <button className="action-btn" onClick={() => handleEditClick(delivery)} title="Edit">✏️</button>
                                                <button className="action-btn" onClick={() => handleMarkAsReady(delivery)} title="Mark as Ready">📦</button>
                                            </>
                                        )}
                                        {delivery.status === 'Ready' && (
                                            <button className="action-btn" onClick={() => handleShip(delivery)} title="Ship">🚚</button>
                                        )}
                                        {delivery.status !== 'Done' && (
                                            <button className="action-btn" onClick={() => handleDeleteClick(delivery)} title="Delete">🗑️</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredDeliveries.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No deliveries found for this filter.
                    </div>
                )}
            </div>

            <div className="info-cards-grid">
                <div className="info-card">
                    <div className="info-icon">📤</div>
                    <div className="info-content">
                        <h4>Total Deliveries</h4>
                        <p className="info-value">{stats.total}</p>
                        <p className="info-subtitle">All time</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">🚚</div>
                    <div className="info-content">
                        <h4>Ready to Ship</h4>
                        <p className="info-value">{stats.ready}</p>
                        <p className="info-subtitle">Packed and ready</p>
                    </div>
                </div>
                <div className="info-card">
                    <div className="info-icon">✅</div>
                    <div className="info-content">
                        <h4>Delivered</h4>
                        <p className="info-value">{stats.delivered}</p>
                        <p className="info-subtitle">Successfully shipped</p>
                    </div>
                </div>
            </div>

            {/* Add Delivery Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Create Delivery Order">
                <form onSubmit={handleAddDelivery}>
                    <div className="form-grid">
                        <FormInput
                            label="Customer Name"
                            name="customer"
                            value={formData.customer}
                            onChange={handleInputChange}
                            placeholder="e.g., ABC Corp"
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
                            placeholder="e.g., 20 pcs"
                            required
                        />
                        <FormInput
                            label="Delivery Date"
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
                            Create Delivery
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Delivery Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Delivery Order">
                <form onSubmit={handleEditDelivery}>
                    <div className="form-grid">
                        <FormInput
                            label="Customer Name"
                            name="customer"
                            value={formData.customer}
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
                            label="Delivery Date"
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
                onConfirm={handleDeleteDelivery}
                title="Delete Delivery"
                message={`Are you sure you want to delete delivery "${selectedDelivery?.refId}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default Deliveries;
