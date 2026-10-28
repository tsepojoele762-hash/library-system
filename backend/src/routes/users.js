const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM users ORDER BY id DESC');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { name, membership_id, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, membership_id, role) VALUES ($1, $2, $3) RETURNING *',
      [name, membership_id, role]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  const { membership_id } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE membership_id = $1', [membership_id]);
  if(result.rows.length > 0) {
    res.json({ success: true, user: result.rows[0] });
  } else {
    res.json({ success: false });
  }
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;