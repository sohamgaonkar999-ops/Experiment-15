import React, { useState, useEffect } from 'react';

const emptyForm = {
  vehicle_id: '',
  service_date: '',
  service_type: '',
  description: '',
  status: 'Pending',
  cost: '',
};

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

// Reusable form for Add Service and Edit Service
export default function ServiceForm({ editingService, vehicles, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingService) {
      setForm({
        vehicle_id: editingService.vehicle_id,
        service_date: editingService.service_date,
        service_type: editingService.service_type,
        description: editingService.description || '',
        status: editingService.status,
        cost: editingService.cost,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingService]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>{editingService ? 'Edit Service Record' : 'Add New Service Record'}</h3>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Vehicle *</label>
              <select name="vehicle_id" value={form.vehicle_id} onChange={handleChange} required>
                <option value="">-- Select vehicle --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicle_number} - {v.vehicle_model}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Service Date *</label>
              <input
                type="date"
                name="service_date"
                value={form.service_date ? String(form.service_date).slice(0, 10) : ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Service Type *</label>
              <input
                type="text"
                name="service_type"
                value={form.service_type}
                onChange={handleChange}
                placeholder="e.g. Periodic Service"
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Cost (Rs.) *</label>
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="e.g. 4500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group full">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Work done in this service"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingService ? 'Update Record' : 'Add Record'}
            </button>
            {editingService && (
              <button type="button" className="btn btn-light" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}