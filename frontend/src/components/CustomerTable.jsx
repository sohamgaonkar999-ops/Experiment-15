import React from 'react';

// Reusable table that shows the customer list
export default function CustomerTable({ customers, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>Customer List</h3>
      </div>

      <div className="card-body">
        {customers.length === 0 ? (
          <p className="empty-text">No customers found.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td className="strong">{c.name}</td>
                    <td>{c.phone}</td>
                    <td>{c.email || '-'}</td>
                    <td>{c.address || '-'}</td>
                    <td className="row-actions">
                      <button className="btn btn-sm btn-edit" onClick={() => onEdit(c)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-delete" onClick={() => onDelete(c.id)}>
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