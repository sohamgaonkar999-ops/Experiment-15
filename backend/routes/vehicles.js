const express = require('express');
const router = express.Router();
const { query } = require('../db');

function sendError(res, status, message) {
  return res.status(status).json({ success: false, message: message });
}

function validate(body) {
  if (!body.customer_id) return 'Please select a customer';
  if (!body.vehicle_number || body.vehicle_number.trim() === '') {
    return 'Vehicle number is required';
  }
  if (!body.vehicle_model || body.vehicle_model.trim() === '') {
    return 'Vehicle model is required';
  }
  if (!body.vehicle_type || body.vehicle_type.trim() === '') {
    return 'Vehicle type is required';
  }
  return null;
}

// GET /api/vehicles?search=MH12   (search by vehicle number, model or type)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    let sql = `SELECT v.*, c.name AS customer_name, c.phone AS customer_phone
               FROM vehicles v
               JOIN customers c ON v.customer_id = c.id`;
    const params = [];

    if (search !== '') {
      sql += ' WHERE v.vehicle_number LIKE ? OR v.vehicle_model LIKE ? OR v.vehicle_type LIKE ? OR c.name LIKE ?';
      params.push('%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%');
    }
    sql += ' ORDER BY v.id DESC';

    const rows = await query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// GET /api/vehicles/1
router.get('/:id', async (req, res) => {
  try {
    const sql = `SELECT v.*, c.name AS customer_name
                 FROM vehicles v
                 JOIN customers c ON v.customer_id = c.id
                 WHERE v.id = ?`;
    const rows = await query(sql, [req.params.id]);
    if (rows.length === 0) {
      return sendError(res, 404, 'Vehicle not found');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// POST /api/vehicles
router.post('/', async (req, res) => {
  try {
    const { customer_id, vehicle_number, vehicle_model, vehicle_type } = req.body;
    const problem = validate(req.body);
    if (problem) return sendError(res, 400, problem);

    // Vehicle number must be unique -> we check it manually to give a clear message
    const existing = await query('SELECT id FROM vehicles WHERE vehicle_number = ?', [
      vehicle_number.trim(),
    ]);
    if (existing.length > 0) {
      return sendError(res, 409, 'This vehicle number already exists');
    }

    // Check that the customer really exists (foreign key)
    const customer = await query('SELECT id FROM customers WHERE id = ?', [customer_id]);
    if (customer.length === 0) {
      return sendError(res, 400, 'Selected customer does not exist');
    }

    const sql =
      'INSERT INTO vehicles (customer_id, vehicle_number, vehicle_model, vehicle_type) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [
      customer_id,
      vehicle_number.trim().toUpperCase(),
      vehicle_model.trim(),
      vehicle_type.trim(),
    ]);

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      id: result.insertId,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// PUT /api/vehicles/1
router.put('/:id', async (req, res) => {
  try {
    const { customer_id, vehicle_number, vehicle_model, vehicle_type } = req.body;
    const problem = validate(req.body);
    if (problem) return sendError(res, 400, problem);

    const existing = await query('SELECT id FROM vehicles WHERE vehicle_number = ? AND id <> ?', [
      vehicle_number.trim(),
      req.params.id,
    ]);
    if (existing.length > 0) {
      return sendError(res, 409, 'This vehicle number already exists');
    }

    const sql =
      'UPDATE vehicles SET customer_id = ?, vehicle_number = ?, vehicle_model = ?, vehicle_type = ? WHERE id = ?';
    const result = await query(sql, [
      customer_id,
      vehicle_number.trim().toUpperCase(),
      vehicle_model.trim(),
      vehicle_type.trim(),
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Vehicle not found');
    }
    res.json({ success: true, message: 'Vehicle updated successfully' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// DELETE /api/vehicles/1
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM vehicles WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Vehicle not found');
    }
    res.json({ success: true, message: 'Vehicle deleted successfully' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

module.exports = router;