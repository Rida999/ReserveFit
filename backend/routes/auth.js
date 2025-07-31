// backend/routes/auth.js
require('dotenv').config();
const express = require('express');
const bcrypt  = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');

const router = express.Router();
const { SALT_ROUNDS, JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// ── SIGN UP ───────────────────────────────────────────────────────────────
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

    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ success: false, message: 'Passwords do not match.' });
    }

    if (!agreeToTerms) {
      return res
        .status(400)
        .json({ success: false, message: 'You must agree to the Terms of Service.' });
    }

    const existing = await pool.query(
      'SELECT 1 FROM users WHERE email = $1',
      [email]
    );
    if (existing.rows.length) {
      return res
        .status(409)
        .json({ success: false, message: 'Email already in use.' });
    }

    const salt = parseInt(SALT_ROUNDS, 10);
    const password_hash = await bcrypt.hash(password, salt);

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

    // Generate JWT
    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res
      .status(201)
      .json({ success: true, message: 'Account created successfully!', token });
  } catch (err) {
    console.error('Signup error:', err);
    res
      .status(500)
      .json({ success: false, message: 'Internal server error.' });
  }
});

// ── SIGN IN ───────────────────────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required.' });
    }

    const userRes = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (userRes.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials.' });
    }

    const user = userRes.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials.' });
    }

    // Create token payload & sign
    const payload = { id: user.id, email: user.email };
    const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: payload
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
