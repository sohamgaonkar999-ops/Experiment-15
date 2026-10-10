import React, { useEffect, useState } from 'react';
import {
  getServices,
  getVehicles,
  addService,
  updateService,
  deleteService,
} from '../api.js';
import ServiceForm from '../components/ServiceForm.jsx';
import ServiceTable from '../components/ServiceTable.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Alert from '../components/Alert.jsx';

const STATUS_FILTERS = ['', 'Pending', 'In Progress', 'Completed'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]); // needed for the dropdown in the form
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, [search, statusFilter]);

  useEffect(() => {
    loadVehicleList();
  }, []);

  async function loadServices(text = search, status = statusFilter) {
    try {
      const data = await getServices(text, status);
      setServices(data);
      setError('');
    } catch (err) {
      setError('Could not load service records. ' + err.message);
    }
  }

  async function loadVehicleList() {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError('Could not load vehicles. ' + err.message);
    }
  }

  async function handleSave(form) {
    try {
      const payload = {
        ...form,
        vehicle_id: Number(form.vehicle_id),
        cost: Number(form.cost),
      };

      if (editingService) {
        await updateService(editingService.id, payload);
        setMessage('Service record updated successfully');
      } else {
        await addService(payload);
        setMessage('Service record added successfully');
      }
      setEditingService(null);
      setError('');
      await loadServices();
    } catch (err) {
      setMessage('');
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this service record?')) {
      try {
        await deleteService(id);
        setMessage('Service record deleted successfully');
        await loadServices();
      } catch (err) {
        setError(err.message);
      }
    }
  }

  return (
    <div>
      <h2 className="page-title">Service Management</h2>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by service type, vehicle number or customer name..."
        />

        <div className="status-filter">
          <span className="filter-label">Status:</span>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              className={
                'btn btn-sm ' + (statusFilter === status ? 'btn-primary' : 'btn-light')
              }
              onClick={() => setStatusFilter(status)}
            >
              {status === '' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      <ServiceForm
        editingService={editingService}
        vehicles={vehicles}
        onSave={handleSave}
        onCancel={() => setEditingService(null)}
      />

      <ServiceTable
        services={services}
        onEdit={(service) => {
          setEditingService(service);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}