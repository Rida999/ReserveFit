const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db'); // adjust path if needed

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      password,
      confirm_password,
      fitness_level,
      primary_goal,
      agreeToTerms
    } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !password || !confirm_password || !fitness_level || !primary_goal) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }
    if (!agreeToTerms) {
      return res.status(400).json({ success: false, message: 'You must agree to the Terms of Service and Privacy Policy.' });
    }

    // Check if email already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email is already in use.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const id = uuidv4();
    await pool.query(
      `INSERT INTO users 
        (id, first_name, last_name, email, phone_number, password_hash, fitness_level, primary_goal, created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())`,
      [id, first_name, last_name, email, phone_number, hashedPassword, fitness_level, primary_goal]
    );

    res.status(201).json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
