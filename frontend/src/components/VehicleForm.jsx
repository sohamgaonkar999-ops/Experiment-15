import React, { useState, useEffect } from 'react';

const emptyForm = {
  customer_id: '',
  vehicle_number: '',
  vehicle_model: '',
  vehicle_type: '',
};

const VEHICLE_TYPES = ['Car', 'SUV', 'Motorcycle', 'Truck', 'Bus', 'Van'];

// Reusable form for Add Vehicle and Edit Vehicle
export default function VehicleForm({
  editingVehicle,
  customers,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingVehicle) {
      setForm({
        customer_id: editingVehicle.customer_id,
        vehicle_number: editingVehicle.vehicle_number,
        vehicle_model: editingVehicle.vehicle_model,
        vehicle_type: editingVehicle.vehicle_type,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingVehicle]);

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
        <h3>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Customer *</label>
              <select name="customer_id" value={form.customer_id} onChange={handleChange} required>
                <option value="">-- Select customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Vehicle Number *</label>
              <input
                type="text"
                name="vehicle_number"
                value={form.vehicle_number}
                onChange={handleChange}
                placeholder="e.g. MH12AB1234"
                required
              />
            </div>

            <div className="form-group">
              <label>Vehicle Model *</label>
              <input
                type="text"
                name="vehicle_model"
                value={form.vehicle_model}
                onChange={handleChange}
                placeholder="e.g. Maruti Swift VXi"
                required
              />
            </div>

            <div className="form-group">
              <label>Vehicle Type *</label>
              <select name="vehicle_type" value={form.vehicle_type} onChange={handleChange} required>
                <option value="">-- Select type --</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
            {editingVehicle && (
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