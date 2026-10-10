/*
  VEHICLE SERVICE MANAGEMENT SYSTEM - BACKEND SERVER
  Tech: Node.js + Express.js + MySQL (mysql2)
  Port: 5000
*/

const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');

// Import our route files (each one handles one table)
const customerRoutes = require('./routes/customers');
const vehicleRoutes = require('./routes/vehicles');
const serviceRoutes = require('./routes/services');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// cors lets the React frontend (port 3000) send requests to this server (port 5000)
app.use(cors());

// express.json lets us read the JSON data sent by React in POST / PUT requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route - just to check that the server is alive
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Vehicle Service Management System API is running',
    endpoints: [
      'GET    /customers',
      'POST   /customers',
      'PUT    /customers/:id',
      'DELETE /customers/:id',
      'GET    /vehicles',
      'POST   /vehicles',
      'PUT    /vehicles/:id',
      'DELETE /vehicles/:id',
      'GET    /services',
      'POST   /services',
      'PUT    /services/:id',
      'DELETE /services/:id',
      'GET    /dashboard',
    ],
  });
});

// REST APIs.
// The same router is mounted twice: once with /api and once without,
// so both http://localhost:5000/customers and http://localhost:5000/api/customers work.
app.use('/api/dashboard', dashboardRoutes);
app.use('/dashboard', dashboardRoutes);

app.use('/api/customers', customerRoutes);
app.use('/customers', customerRoutes);

app.use('/api/vehicles', vehicleRoutes);
app.use('/vehicles', vehicleRoutes);

app.use('/api/services', serviceRoutes);
app.use('/services', serviceRoutes);

// If someone opens a URL that does not exist (404 error)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Last error handler - catches any error that was not handled above
app.use((error, req, res, next) => {
  console.error('Server error:', error.message);
  res.status(500).json({ success: false, message: 'Server error: ' + error.message });
});

// Start the server
const server = app.listen(PORT, async () => {
  console.log('----------------------------------------');
  console.log('  Server running at: http://localhost:' + PORT);
  console.log('----------------------------------------');
  try {
    await testConnection();
  } catch (error) {
    console.error('MySQL connection FAILED:', error.message);
    console.error('Check backend/.env -> DB_USER, DB_PASSWORD, and that MySQL server is ON.');
  }
});

// If port 5000 is already used by another program, show a friendly message
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('');
    console.error('ERROR: Port ' + PORT + ' is already in use.');
    console.error('Fix 1: close the other program (on macOS Control Center / AirPlay uses port 5000).');
    console.error('Fix 2: open backend/.env and change PORT=5000 to PORT=5050,');
    console.error('       then also change BASE_URL in frontend/src/api.js to http://localhost:5050');
    console.error('');
  } else {
    console.error('Server error:', error.message);
  }
  process.exit(1);
});