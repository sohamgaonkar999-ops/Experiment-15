import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Vehicles from './pages/Vehicles.jsx';
import Services from './pages/Services.jsx';

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>

      <footer className="footer">
        Vehicle Service Management System &nbsp;|&nbsp; Full Stack Project (ISA 3)
      </footer>
    </div>
  );
}