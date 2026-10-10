import React from 'react';

// Reusable table that shows the vehicle list (customer name comes from JOIN in the API)
export default function VehicleTable({ vehicles, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Vehicle List</h3>
      </div>

      <div className="card-body">
        {vehicles.length === 0 ? (
          <p className="empty-text">No vehicles found.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Vehicle Number</th>
                  <th>Vehicle Model</th>
                  <th>Vehicle Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td className="strong">{v.customer_name}</td>
                    <td>{v.vehicle_number}</td>
                    <td>{v.vehicle_model}</td>
                    <td>
                      <span className="tag">{v.vehicle_type}</span>
                    </td>
                    <td className="row-actions">
                      <button className="btn btn-sm btn-edit" onClick={() => onEdit(v)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => onDelete(v.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}