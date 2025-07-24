// backend/routes/auth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool    = require('../db');

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
      agreeToTerms,
    } = req.body;

    // 1) Basic required-field checks
    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !confirm_password ||
      !fitness_level ||
      !primary_goal
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required.' });
    }

    // 2) Password match
    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ success: false, message: 'Passwords do not match.' });
    }

    // 3) Terms checkbox
    if (!agreeToTerms) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'You must agree to the Terms of Service.',
        });
    }

    // 4) Email uniqueness
    const existing = await pool.query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length) {
      return res
        .status(409)
        .json({ success: false, message: 'Email already in use.' });
    }

    // 5) Hash password
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 6) Insert
    const id = uuidv4();
    await pool.query(
      `INSERT INTO users
        (id, first_name, last_name, email, phone_number,
         password_hash, fitness_level, primary_goal, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())`,
      [
        id,
        first_name,
        last_name,
        email,
        phone_number,
        password_hash,
        fitness_level,
        primary_goal,
      ]
    );

    res
      .status(201)
      .json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    console.error('Signup error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Internal server error.' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user by email
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = userRes.rows[0];
    // Check password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // (Optionally: generate and return JWT or session token here)
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        fitness_level: user.fitness_level,
        primary_goal: user.primary_goal,
      }
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
