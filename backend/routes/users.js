const express = require('express');
const pool = require('../db'); // adjust path as needed

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST a new user (example)
router.post('/', async (req, res) => {
  const { id, first_name, last_name, email, password_hash } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (id, first_name, last_name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [id, first_name, last_name, email, password_hash]
    );
    res.status(201).json({ success: true, message: 'User created' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
