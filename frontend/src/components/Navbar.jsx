import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-left">
        <span className="logo">VSM</span>
        <span className="nav-title">Vehicle Service Management System</span>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/customers" className="nav-link">
          Customers
        </NavLink>
        <NavLink to="/vehicles" className="nav-link">
          Vehicles
        </NavLink>
        <NavLink to="/services" className="nav-link">
          Services
        </NavLink>
      </nav>
    </header>
  );
}