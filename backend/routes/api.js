const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool    = require('../db');

const router = express.Router();

// GET /api/trainers
router.get('/trainers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        first_name,
        last_name,
        photo_url,
        headline,
        bio,
        rating,
        clients_count,
        start_date,
        created_at,
        description
      FROM trainers
      WHERE is_active = true
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load trainers" });
  }
});

// GET /api/programs
router.get('/programs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        description,
        duration_min,
        duration_max,
        intensity,
        icon,
        features
      FROM programs
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching programs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/slots
router.get('/slots', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, trainer_id, slot_start, slot_end, is_booked FROM appointment_slots'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch slots' });
  }
});

// GET /api/trainers/:trainerId/slots?date=YYYY-MM-DD
router.get('/trainers/:trainerId/slots', async (req, res) => {
  const { trainerId } = req.params;
  const { date } = req.query;

  const result = await pool.query(
    `SELECT id, slot_start, slot_end
     FROM appointment_slots
     WHERE trainer_id = $1 AND is_booked = false
       AND DATE(slot_start) = $2
     ORDER BY slot_start ASC`,
    [trainerId, date]
  );
  res.json(result.rows);
});

// POST /api/bookings
router.post('/bookings', async (req, res) => {
  const { slotId, programId, notes } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      INSERT INTO sessions
        (id, user_id, slot_id, program_id, notes, status, created_at)
      VALUES
        (gen_random_uuid(), $1, $2, $3, $4, 'booked', NOW())
      RETURNING *;
      `,
      [userId, slotId, programId, notes]
    );
    res.json({ success: true, session: result.rows[0] });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
});

// GET /api/my-sessions
router.get('/my-sessions', async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query(
    `SELECT s.id, s.notes, s.status, s.created_at,
            a.slot_start, a.slot_end,
            t.first_name AS trainer_first, t.last_name AS trainer_last,
            p.name AS program
     FROM sessions s
     JOIN appointment_slots a ON s.slot_id = a.id
     JOIN trainers t ON a.trainer_id = t.id
     JOIN programs p ON s.program_id = p.id
     WHERE s.user_id = $1
     ORDER BY a.slot_start DESC`,
    [userId]
  );
  res.json(result.rows);
});


// ——— NEW: Users API ———

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone_number,
        fitness_level,
        primary_goal,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// GET /api/users/:userId
router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone_number,
        fitness_level,
        primary_goal,
        created_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to load user' });
  }
});

module.exports = router;
