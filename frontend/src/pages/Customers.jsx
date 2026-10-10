import React, { useEffect, useState } from 'react';
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '../api.js';
import CustomerForm from '../components/CustomerForm.jsx';
import CustomerTable from '../components/CustomerTable.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Alert from '../components/Alert.jsx';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load the list every time the search text changes
  useEffect(() => {
    loadCustomers();
  }, [search]);

  async function loadCustomers(text = search) {
    try {
      const data = await getCustomers(text);
      setCustomers(data);
      setError('');
    } catch (err) {
      setError('Could not load customers. ' + err.message);
    }
  }

  // ADD and UPDATE both come here
  async function handleSave(form) {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, form);
        setMessage('Customer updated successfully');
      } else {
        await addCustomer(form);
        setMessage('Customer added successfully');
      }
      setEditingCustomer(null);
      setError('');
      await loadCustomers();
    } catch (err) {
      setMessage('');
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this customer? Their vehicles and services will also be deleted.')) {
      try {
        await deleteCustomer(id);
        setMessage('Customer deleted successfully');
        await loadCustomers();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  return (
    <div>
      <h2 className="page-title">Customer Management</h2>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by customer name, phone or email..."
        />
      </div>

      <CustomerForm
        editingCustomer={editingCustomer}
        onSave={handleSave}
        onCancel={() => setEditingCustomer(null)}
      />

      <CustomerTable
        customers={customers}
        onEdit={(customer) => {
          setEditingCustomer(customer);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}