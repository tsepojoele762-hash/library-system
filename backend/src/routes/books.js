const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM books ORDER BY id DESC');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO books (title, author, genre, isbn, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author, genre, isbn, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  const { title, author, genre, isbn, quantity } = req.body;
  await pool.query(
    'UPDATE books SET title=$1, author=$2, genre=$3, isbn=$4, quantity=$5 WHERE id=$6',
    [title, author, genre, isbn, quantity, req.params.id]
  );
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;