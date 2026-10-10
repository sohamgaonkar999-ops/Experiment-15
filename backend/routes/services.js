const express = require('express');
const router = express.Router();
const { query } = require('../db');

function sendError(res, status, message) {
  return res.status(status).json({ success: false, message: message });
}

const VALID_STATUS = ['Pending', 'In Progress', 'Completed'];

function validate(body) {
  if (!body.vehicle_id) return 'Please select a vehicle';
  if (!body.service_date) return 'Service date is required';
  if (!body.service_type || body.service_type.trim() === '') {
    return 'Service type is required';
  }
  if (!body.status || !VALID_STATUS.includes(body.status)) {
    return 'Status must be Pending, In Progress or Completed';
  }
  if (body.cost === undefined || body.cost === null || body.cost === '') {
    return 'Cost is required';
  }
  if (isNaN(Number(body.cost)) || Number(body.cost) < 0) {
    return 'Cost must be a positive number';
  }
  return null;
}

// GET /api/services?search=&status=Pending
router.get('/', async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const status = req.query.status ? req.query.status.trim() : '';

    let sql = `SELECT s.*,
                      v.vehicle_number,
                      v.vehicle_model,
                      c.name AS customer_name
               FROM services s
               JOIN vehicles v ON s.vehicle_id = v.id
               JOIN customers c ON v.customer_id = c.id
               WHERE 1 = 1`;
    const params = [];

    if (search !== '') {
      sql += ' AND (s.service_type LIKE ? OR s.description LIKE ? OR v.vehicle_number LIKE ? OR c.name LIKE ?)';
      params.push('%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%');
    }
    if (status !== '') {
      sql += ' AND s.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY s.id DESC';

    const rows = await query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// GET /api/services/1
router.get('/:id', async (req, res) => {
  try {
    const sql = `SELECT s.*, v.vehicle_number, c.name AS customer_name
                 FROM services s
                 JOIN vehicles v ON s.vehicle_id = v.id
                 JOIN customers c ON v.customer_id = c.id
                 WHERE s.id = ?`;
    const rows = await query(sql, [req.params.id]);
    if (rows.length === 0) {
      return sendError(res, 404, 'Service record not found');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// POST /api/services
router.post('/', async (req, res) => {
  try {
    const { vehicle_id, service_date, service_type, description, status, cost } = req.body;
    const problem = validate(req.body);
    if (problem) return sendError(res, 400, problem);

    const vehicle = await query('SELECT id FROM vehicles WHERE id = ?', [vehicle_id]);
    if (vehicle.length === 0) {
      return sendError(res, 400, 'Selected vehicle does not exist');
    }

    const sql = `INSERT INTO services
                 (vehicle_id, service_date, service_type, description, status, cost)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await query(sql, [
      vehicle_id,
      service_date,
      service_type.trim(),
      description ? description.trim() : null,
      status,
      Number(cost).toFixed(2),
    ]);

    res.status(201).json({
      success: true,
      message: 'Service record added successfully',
      id: result.insertId,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// PUT /api/services/1
router.put('/:id', async (req, res) => {
  try {
    const { vehicle_id, service_date, service_type, description, status, cost } = req.body;
    const problem = validate(req.body);
    if (problem) return sendError(res, 400, problem);

    const sql = `UPDATE services
                 SET vehicle_id = ?, service_date = ?, service_type = ?, description = ?, status = ?, cost = ?
                 WHERE id = ?`;
    const result = await query(sql, [
      vehicle_id,
      service_date,
      service_type.trim(),
      description ? description.trim() : null,
      status,
      Number(cost).toFixed(2),
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Service record not found');
    }
    res.json({ success: true, message: 'Service record updated successfully' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// DELETE /api/services/1
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM services WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Service record not found');
    }
    res.json({ success: true, message: 'Service record deleted successfully' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

module.exports = router;