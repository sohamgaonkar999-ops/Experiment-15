import React from 'react';

// Small helper that gives each status a different colour
export function StatusBadge({ status }) {
  let className = 'badge';
  if (status === 'Completed') className += ' badge-green';
  else if (status === 'In Progress') className += ' badge-blue';
  else className += ' badge-orange';

  return <span className={className}>{status}</span>;
}

// Reusable table that shows the service records
export default function ServiceTable({ services, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Service Records</h3>
      </div>

      <div className="card-body">
        {services.length === 0 ? (
          <p className="empty-text">No service records found.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Vehicle Number</th>
                  <th>Service Date</th>
                  <th>Service Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Cost (Rs.)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td className="strong">{s.customer_name}</td>
                    <td>{s.vehicle_number}</td>
                    <td>{String(s.service_date).slice(0, 10)}</td>
                    <td>{s.service_type}</td>
                    <td className="desc-cell">{s.description || '-'}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td>{Number(s.cost).toFixed(2)}</td>
                    <td className="row-actions">
                      <button className="btn btn-sm btn-edit" onClick={() => onEdit(s)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => onDelete(s.id)}>
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