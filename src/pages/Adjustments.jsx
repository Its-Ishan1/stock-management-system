import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect, FormNumber } from '../components/FormComponents';

const Adjustments = () => {
  const location = useLocation();
  const { adjustments, setAdjustments, products, warehouses, showToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    product: '',
    recorded: '',
    counted: '',
    unit: 'kg',
    reason: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Auto-open modal when navigated from Quick Actions
  useEffect(() => {
    if (location.state?.openModal) {
      setIsAddModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const reasons = [
    { value: 'Damaged', label: 'Damaged' },
    { value: 'Missing', label: 'Missing' },
    { value: 'Found', label: 'Found' },
    { value: 'Recount', label: 'Recount' },
    { value: 'Expired', label: 'Expired' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-select unit when product is selected
    if (name === 'product') {
      const selectedProduct = products.find(p => p.name === value);
      if (selectedProduct) {
        setFormData(prev => ({ ...prev, unit: selectedProduct.unit }));
      }
    }
  };

  const calculateDifference = () => {
    const recorded = parseFloat(formData.recorded) || 0;
    const counted = parseFloat(formData.counted) || 0;
    const diff = counted - recorded;
    return diff >= 0 ? `+${diff}` : `${diff}`;
  };

  const resetForm = () => {
    setFormData({
      product: '',
      recorded: '',
      counted: '',
      unit: 'kg',
      reason: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const generateAdjustmentId = () => {
    const lastId = adjustments.length > 0 ? parseInt(adjustments[adjustments.length - 1].refId.split('-')[1]) : 7;
    return `ADJ-${String(lastId + 1).padStart(3, '0')}`;
  };

  const handleAddAdjustment = (e) => {
    e.preventDefault();
    const difference = calculateDifference();
    const newAdjustment = {
      id: Date.now(),
      refId: generateAdjustmentId(),
      ...formData,
      difference,
      status: 'Draft',
    };
    setAdjustments([...adjustments, newAdjustment]);
    showToast('Adjustment created successfully!', 'success');
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleDeleteClick = (adjustment) => {
    setSelectedAdjustment(adjustment);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAdjustment = () => {
    setAdjustments(adjustments.filter(a => a.id !== selectedAdjustment.id));
    showToast('Adjustment deleted successfully!', 'success');
    setSelectedAdjustment(null);
  };

  const handleValidateAdjustment = (adjustment) => {
    setAdjustments(adjustments.map(a => 
      a.id === adjustment.id ? { ...a, status: 'Done' } : a
    ));
    showToast(`Adjustment ${adjustment.refId} applied successfully!`, 'success');
  };

  const filteredAdjustments = adjustments.filter(adjustment => {
    if (activeFilter === 'All') return true;
    return adjustment.status === activeFilter;
  });

  const stats = {
    total: adjustments.length,
    negative: adjustments.filter(a => a.difference.startsWith('-')).length,
    positive: adjustments.filter(a => a.difference.startsWith('+')).length,
  };

  const locations = warehouses.map(w => ({ value: w.name, label: w.name }));

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Stock Adjustments</h2>
        <p className="page-subtitle">Fix discrepancies between recorded and physical stock</p>
      </div>

      <div className="page-actions">
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <span>➕</span> Create Adjustment
        </button>
        <button className="btn-secondary" onClick={() => showToast('Physical count feature coming soon!', 'info')}>
          <span>📊</span> Physical Count
        </button>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h3>All Adjustments ({filteredAdjustments.length})</h3>
          <div className="filter-chips">
            {['All', 'Draft', 'Done'].map(filter => (
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
                <th>Adjustment ID</th>
                <th>Product</th>
                <th>Recorded</th>
                <th>Counted</th>
                <th>Difference</th>
                <th>Reason</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdjustments.map((adj) => (
                <tr key={adj.id} className="table-row">
                  <td><strong>{adj.refId}</strong></td>
                  <td>{adj.product}</td>
                  <td>{adj.recorded} {adj.unit}</td>
                  <td>{adj.counted} {adj.unit}</td>
                  <td>
                    <span className={adj.difference.startsWith('+') ? 'text-success' : 'text-danger'}>
                      {adj.difference} {adj.unit}
                    </span>
                  </td>
                  <td>{adj.reason}</td>
                  <td>{adj.location}</td>
                  <td>{adj.date}</td>
                  <td>
                    <span className={`status-badge ${adj.status.toLowerCase()}`}>
                      {adj.status}
                    </span>
                  </td>
                  <td>
                    {adj.status !== 'Done' && (
                      <button className="action-btn" onClick={() => handleValidateAdjustment(adj)} title="Apply">✅</button>
                    )}
                    <button className="action-btn" onClick={() => handleDeleteClick(adj)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAdjustments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No adjustments found for this filter.
          </div>
        )}
      </div>

      <div className="info-cards-grid">
        <div className="info-card">
          <div className="info-icon">⚙️</div>
          <div className="info-content">
            <h4>Total Adjustments</h4>
            <p className="info-value">{stats.total}</p>
            <p className="info-subtitle">All time</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📉</div>
          <div className="info-content">
            <h4>Negative Adjustments</h4>
            <p className="info-value">{stats.negative}</p>
            <p className="info-subtitle">Stock reduced</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📈</div>
          <div className="info-content">
            <h4>Positive Adjustments</h4>
            <p className="info-value">{stats.positive}</p>
            <p className="info-subtitle">Stock increased</p>
          </div>
        </div>
      </div>

      {/* Add Adjustment Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); resetForm(); }} title="Create Stock Adjustment">
        <form onSubmit={handleAddAdjustment}>
          <div className="form-grid">
            <FormSelect
              label="Product"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
              options={products.map(p => ({ value: p.name, label: p.name }))}
              required
            />
            <FormSelect
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              options={locations}
              required
            />
            <FormNumber
              label="Recorded Quantity"
              name="recorded"
              value={formData.recorded}
              onChange={handleInputChange}
              min={0}
              placeholder="0"
              required
            />
            <FormNumber
              label="Counted Quantity"
              name="counted"
              value={formData.counted}
              onChange={handleInputChange}
              min={0}
              placeholder="0"
              required
            />
            <FormSelect
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              options={reasons}
              required
            />
            <FormInput
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {formData.recorded && formData.counted && (
            <div style={{ 
              padding: '1rem', 
              background: 'var(--glass-bg)', 
              borderRadius: '8px', 
              marginTop: '1rem',
              border: '1px solid var(--glass-border)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Calculated Difference:
              </p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: calculateDifference().startsWith('+') ? 'var(--success)' : 'var(--danger)'
              }}>
                {calculateDifference()} {formData.unit}
              </p>
            </div>
          )}

          <div className="modal-form-actions">
            <button type="button" className="btn-secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Adjustment
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAdjustment}
        title="Delete Adjustment"
        message={`Are you sure you want to delete adjustment "${selectedAdjustment?.refId}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Adjustments;
