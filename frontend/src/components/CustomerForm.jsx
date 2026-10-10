import React, { useState, useEffect } from 'react';

const emptyForm = { name: '', phone: '', email: '', address: '' };

// Reusable form for Add Customer and Edit Customer
export default function CustomerForm({ editingCustomer, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  // Whenever we click "Edit", fill the form with that customer's data
  useEffect(() => {
    if (editingCustomer) {
      setForm({
        name: editingCustomer.name,
        phone: editingCustomer.phone,
        email: editingCustomer.email || '',
        address: editingCustomer.address || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingCustomer]);

  // Handles typing in any input box
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
        <h3>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. rahul@example.com"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="e.g. 12 MG Road, Pune"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </button>
            {editingCustomer && (
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