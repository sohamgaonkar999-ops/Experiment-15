import React from 'react';

// One small box on the dashboard (Total Customers, Pending Services, ...)
export default function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-value" style={{ color: color }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}