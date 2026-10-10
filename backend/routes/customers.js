const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Helper: sends an error response in the same format every time
function sendError(res, status, message) {
  return res.status(status).json({ success: false, message: message });
}

// Checks the data coming from the form before we save it
function validate(body) {
  if (!body.name || body.name.trim() === '') {
    return 'Customer name is required';
  }
  if (!body.phone || body.phone.trim() === '') {
    return 'Phone number is required';
  }
  if (!/^[0-9]{10}$/.test(body.phone.trim())) {
    return 'Phone number must be exactly 10 digits';
  }
  if (body.email && body.email.trim() !== '') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      return 'Email is not valid';
    }
  }
  return null;
}

// GET /api/customers  (+ optional search: ?search=rahul)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    let sql = 'SELECT * FROM customers';
    const params = [];

    if (search !== '') {
      sql += ' WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?';
      params.push('%' + search + '%', '%' + search + '%', '%' + search + '%');
    }
    sql += ' ORDER BY id DESC';

    const rows = await query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// GET /api/customers/1
router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return sendError(res, 404, 'Customer not found');
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// POST /api/customers   (create)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const problem = validate(req.body);
    if (problem) return sendError(res, 400, problem);

    const sql = 'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [
      name.trim(),
      phone.trim(),
      email ? email.trim() : null,
      address ? address.trim() : null,
    ]);

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      id: result.insertId,
    });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// PUT /api/customers/1   (update)
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const problem = validate(req.body);
    if (problem) return sendError(res, 400, problem);

    const sql =
      'UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?';
    const result = await query(sql, [
      name.trim(),
      phone.trim(),
      email ? email.trim() : null,
      address ? address.trim() : null,
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Customer not found');
    }
    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

// DELETE /api/customers/1
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return sendError(res, 404, 'Customer not found');
    }
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

module.exports = router;