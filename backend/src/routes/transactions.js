const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { book_id, type, quantity } = req.body;
  
  try {
    // ACID Transaction Control Implementation 
    await pool.query('BEGIN');
    const bookRes = await pool.query('SELECT quantity FROM books WHERE id = $1', [book_id]);
    
    if (bookRes.rows.length === 0) throw new Error("Target core asset not indexed.");
    let currentQty = bookRes.rows[0].quantity;

    if (type === 'borrow') {
      if (currentQty < quantity) throw new Error("Database state warning: Insufficient units.");
      await pool.query('UPDATE books SET quantity = quantity - $1 WHERE id = $2', [quantity, book_id]);
    } else {
      await pool.query('UPDATE books SET quantity = quantity + $1 WHERE id = $2', [quantity, book_id]);
    }

    await pool.query('INSERT INTO transactions (book_id, type, quantity) VALUES ($1, $2, $3)', [book_id, type, quantity]);
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;