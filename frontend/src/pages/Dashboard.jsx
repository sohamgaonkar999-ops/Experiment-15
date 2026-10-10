import React, { useEffect, useState } from 'react';
import { getDashboard } from '../api.js';
import StatCard from '../components/StatCard.jsx';
import Alert from '../components/Alert.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  // Runs once when the page loads
  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboard();
      setStats(data);
      setError('');
    } catch (err) {
      setError(
        'Could not load dashboard. Is the backend running on port 5000? (' +
          err.message +
          ')'
      );
    }
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      {!stats ? (
        <p className="empty-text">Loading...</p>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Total Customers" value={stats.totalCustomers} color="#2563eb" />
            <StatCard label="Total Vehicles" value={stats.totalVehicles} color="#7c3aed" />
            <StatCard label="Pending Services" value={stats.pendingServices} color="#f59e0b" />
            <StatCard label="Completed Services" value={stats.completedServices} color="#16a34a" />
            <StatCard label="In Progress Services" value={stats.inProgressServices} color="#0ea5e9" />
            <StatCard
              label="Revenue (Completed)"
              value={'Rs. ' + Number(stats.totalRevenue).toFixed(2)}
              color="#dc2626"
            />
          </div>

          <div className="card">
            <div className="card-header">
              <h3>How this page works</h3>
            </div>
            <div className="card-body">
              <p>
                When this page opens, React calls <b>GET http://localhost:5000/dashboard</b>.
                Express runs SQL <b>COUNT(*)</b> queries on MySQL and sends the numbers back.
                React then shows them inside these cards.
              </p>
              <button className="btn btn-light" onClick={loadStats}>
                Refresh
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}