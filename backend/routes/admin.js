const express = require('express');
const router = express.Router();
const pool = require('../db'); // Your PostgreSQL connection

// --- PROGRAMS ---
router.post('/programs', async (req, res) => {
  const { name, description, duration_min, duration_max, intensity, icon } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO programs (id, name, description, duration_min, duration_max, intensity, icon, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [name, description, duration_min, duration_max, intensity, icon]
    );
    res.json({ success: true, program: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- TRAINERS ---
router.post('/trainers', async (req, res) => {
  const { first_name, last_name, photo_url, headline, bio, rating, clients_count, start_date, is_active } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO trainers (id, first_name, last_name, photo_url, headline, bio, rating, clients_count, start_date, is_active, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [first_name, last_name, photo_url, headline, bio, rating, clients_count, start_date, is_active]
    );
    res.json({ success: true, trainer: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SLOTS ---
router.post('/slots', async (req, res) => {
  const { trainer_id, slot_start, slot_end } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO appointment_slots (id, trainer_id, slot_start, slot_end, is_booked, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, false, NOW()) RETURNING *`,
      [trainer_id, slot_start, slot_end]
    );
    res.json({ success: true, slot: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- (OPTIONAL) Delete program/trainer/slot, update, etc. ---

module.exports = router;
