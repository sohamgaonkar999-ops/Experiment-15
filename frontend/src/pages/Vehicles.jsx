import React, { useEffect, useState } from 'react';
import { getVehicles, getCustomers, addVehicle, updateVehicle, deleteVehicle } from '../api.js';
import VehicleForm from '../components/VehicleForm.jsx';
import VehicleTable from '../components/VehicleTable.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Alert from '../components/Alert.jsx';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]); // needed for the dropdown in the form
  const [search, setSearch] = useState('');
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadVehicles();
    loadCustomerList();
  }, [search]);

  async function loadVehicles(text = search) {
    try {
      const data = await getVehicles(text);
      setVehicles(data);
      setError('');
    } catch (err) {
      setError('Could not load vehicles. ' + err.message);
    }
  }

  async function loadCustomerList() {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Could not load customers. ' + err.message);
    }
  }

  async function handleSave(form) {
    try {
      // The form gives customer_id as text, MySQL needs a number
      const payload = { ...form, customer_id: Number(form.customer_id) };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, payload);
        setMessage('Vehicle updated successfully');
      } else {
        await addVehicle(payload);
        setMessage('Vehicle added successfully');
      }
      setEditingVehicle(null);
      setError('');
      await loadVehicles();
    } catch (err) {
      setMessage('');
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this vehicle? Its service records will also be deleted.')) {
      try {
        await deleteVehicle(id);
        setMessage('Vehicle deleted successfully');
        await loadVehicles();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  return (
    <div>
      <h2 className="page-title">Vehicle Management</h2>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by vehicle number, model, type or customer name..."
        />
      </div>

      <VehicleForm
        editingVehicle={editingVehicle}
        customers={customers}
        onSave={handleSave}
        onCancel={() => setEditingVehicle(null)}
      />

      <VehicleTable
        vehicles={vehicles}
        onEdit={(vehicle) => {
          setEditingVehicle(vehicle);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}