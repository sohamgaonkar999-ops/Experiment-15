const express = require('express');
const router = express.Router();
const { query } = require('../db');

// GET /api/dashboard
// Runs all four counting queries and sends the numbers to React in one call.
router.get('/', async (req, res) => {
  try {
    const customers = await query('SELECT COUNT(*) AS total FROM customers');
    const vehicles = await query('SELECT COUNT(*) AS total FROM vehicles');
    const services = await query(
      "SELECT COUNT(*) AS total FROM services WHERE status = 'Pending'"
    );
    const completed = await query(
      "SELECT COUNT(*) AS total FROM services WHERE status = 'Completed'"
    );
    const inProgress = await query(
      "SELECT COUNT(*) AS total FROM services WHERE status = 'In Progress'"
    );
    const revenue = await query(
      "SELECT COALESCE(SUM(cost), 0) AS total FROM services WHERE status = 'Completed'"
    );

    res.json({
      success: true,
      data: {
        totalCustomers: customers[0].total,
        totalVehicles: vehicles[0].total,
        pendingServices: services[0].total,
        completedServices: completed[0].total,
        inProgressServices: inProgress[0].total,
        totalRevenue: revenue[0].total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;