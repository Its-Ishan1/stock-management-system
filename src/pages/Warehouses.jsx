import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormNumber } from '../components/FormComponents';

import { warehousesAPI } from '../services/api';

const Warehouses = () => {
    const { warehouses, setWarehouses, showToast } = useApp();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ name: '', location: '', capacity: '' });
    };

    const handleAddWarehouse = async (e) => {
        e.preventDefault();
        try {
            const warehouseData = {
                ...formData,
                capacity: parseInt(formData.capacity.replace(/[^0-9]/g, '')) || 1000 // Handle string capacity
            };
            const response = await warehousesAPI.create(warehouseData);
            setWarehouses([...warehouses, response.data]);
            showToast('Warehouse added successfully!', 'success');
            setIsAddModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to add warehouse:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (error.message === 'Network Error' ? 'Cannot connect to server. Please ensure the backend is running.' :
                    'Failed to add warehouse. Please try again.');
            showToast(errorMessage, 'error');
        }
    };

    const handleEditClick = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setFormData({
            name: warehouse.name,
            location: warehouse.location,
            capacity: warehouse.capacity,
        });
        setIsEditModalOpen(true);
    };

    const handleEditWarehouse = async (e) => {
        e.preventDefault();
        try {
            const warehouseData = {
                ...formData,
                capacity: parseInt(formData.capacity.replace(/[^0-9]/g, '')) || 1000
            };
            const response = await warehousesAPI.update(selectedWarehouse.id, warehouseData);
            setWarehouses(warehouses.map(w =>
                w.id === selectedWarehouse.id ? response.data : w
            ));
            showToast('Warehouse updated successfully!', 'success');
            setIsEditModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Failed to update warehouse:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (error.message === 'Network Error' ? 'Cannot connect to server. Please ensure the backend is running.' :
                    'Failed to update warehouse. Please try again.');
            showToast(errorMessage, 'error');
        }
    };

    const handleDeleteClick = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteWarehouse = async () => {
        try {
            await warehousesAPI.delete(selectedWarehouse.id);
            setWarehouses(warehouses.filter(w => w.id !== selectedWarehouse.id));
            showToast('Warehouse deleted successfully!', 'success');
            setSelectedWarehouse(null);
        } catch (error) {
            console.error('Failed to delete warehouse:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                (error.message === 'Network Error' ? 'Cannot connect to server. Please ensure the backend is running.' :
                    'Failed to delete warehouse. Please try again.');
            showToast(errorMessage, 'error');
        }
    };

    const handleViewClick = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setIsViewModalOpen(true);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Warehouse Management</h2>
                <p className="page-subtitle">Manage warehouse locations and configurations</p>
            </div>

            <div className="page-actions">
                <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <span>➕</span> Add Warehouse
                </button>
                <button className="btn-secondary" onClick={() => showToast('Location configuration coming soon!', 'info')}>
                    <span>⚙️</span> Configure Locations
                </button>
            </div>

            <div className="warehouses-grid">
                {(warehouses || []).map((warehouse) => (
                    <div key={warehouse.id} className="warehouse-card">
                        <div className="warehouse-header">
                            <div>
                                <h3>{warehouse.name}</h3>
                                <p className="warehouse-location">📍 {warehouse.location}</p>
                            </div>
                            <span className="status-badge done">{warehouse.status}</span>
                        </div>

                        <div className="warehouse-stats">
                            <div className="stat-item">
                                <span className="stat-label">Capacity</span>
                                <span className="stat-value">{warehouse.capacity}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Utilization</span>
                                <span className="stat-value">{warehouse.utilization}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Products</span>
                                <span className="stat-value">{warehouse.products}</span>
                            </div>
                        </div>

                        <div className="utilization-bar">
                            <div
                                className="utilization-fill"
                                style={{ width: warehouse.utilization }}
                            ></div>
                        </div>

                        <div className="warehouse-actions">
                            <button className="btn-secondary-small" onClick={() => handleViewClick(warehouse)}>
                                👁️ View Details
                            </button>
                            <button className="btn-secondary-small" onClick={() => handleEditClick(warehouse)}>
                                ✏️ Edit
                            </button>
                            <button className="btn-secondary-small" onClick={() => showToast('Reports coming soon!', 'info')}>
                                📊 Reports
                            </button>
                        </div>
                    </div>
                ))}
                {(!warehouses || warehouses.length === 0) && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No warehouses found. Add a new warehouse to get started.
                    </div>
                )}
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>Warehouse Locations</h3>
                </div>

                <div className="activity-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Warehouse</th>
                                <th>Location</th>
                                <th>Capacity</th>
                                <th>Utilization</th>
                                <th>Products</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(warehouses || []).map((warehouse) => (
                                <tr key={warehouse.id} className="table-row">
                                    <td><strong>{warehouse.name}</strong></td>
                                    <td>{warehouse.location}</td>
                                    <td>{warehouse.capacity}</td>
                                    <td>{warehouse.utilization}</td>
                                    <td>{warehouse.products}</td>
                                    <td>
                                        <span className="status-badge done">{warehouse.status}</span>
                                    </td>
                                    <td>
                                        <button className="action-btn" onClick={() => handleViewClick(warehouse)} title="View">👁️</button>
                                        <button className="action-btn" onClick={() => handleEditClick(warehouse)} title="Edit">✏️</button>
                                        <button className="action-btn" onClick={() => handleDeleteClick(warehouse)} title="Delete">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Warehouse Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Add New Warehouse">
                <form onSubmit={handleAddWarehouse}>
                    <div className="form-grid">
                        <FormInput
                            label="Warehouse Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Warehouse 3"
                            required
                        />
                        <FormInput
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Building D, Floor 1"
                            required
                        />
                        <div className="form-grid-full">
                            <FormInput
                                label="Capacity"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleInputChange}
                                placeholder="e.g., 8,000 m²"
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn-secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Add Warehouse
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Warehouse Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title="Edit Warehouse">
                <form onSubmit={handleEditWarehouse}>
                    <div className="form-grid">
                        <FormInput
                            label="Warehouse Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <FormInput
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            required
                        />
                        <div className="form-grid-full">
                            <FormInput
                                label="Capacity"
                                name="capacity"
                                value={formData.capacity}
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

            {/* View Warehouse Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Warehouse Details">
                {selectedWarehouse && (
                    <div>
                        <div className="form-group">
                            <label className="form-label">Warehouse Name</label>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600' }}>
                                {selectedWarehouse.name}
                            </p>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <p style={{ color: 'var(--text-secondary)' }}>📍 {selectedWarehouse.location}</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Capacity</label>
                                <p style={{ color: 'var(--text-secondary)' }}>{selectedWarehouse.capacity}</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Utilization</label>
                                <p style={{ color: 'var(--text-secondary)' }}>{selectedWarehouse.utilization}</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Products</label>
                                <p style={{ color: 'var(--text-secondary)' }}>{selectedWarehouse.products}</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <span className="status-badge done">{selectedWarehouse.status}</span>
                            </div>
                        </div>

                        <div className="utilization-bar" style={{ marginTop: '1.5rem' }}>
                            <div
                                className="utilization-fill"
                                style={{ width: selectedWarehouse.utilization }}
                            ></div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            Capacity Utilization: {selectedWarehouse.utilization}
                        </p>

                        <div className="modal-form-actions">
                            <button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>
                                Close
                            </button>
                            <button className="btn-primary" onClick={() => {
                                setIsViewModalOpen(false);
                                handleEditClick(selectedWarehouse);
                            }}>
                                Edit Warehouse
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteWarehouse}
                title="Delete Warehouse"
                message={`Are you sure you want to delete "${selectedWarehouse?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default Warehouses;
