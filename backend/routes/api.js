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
        photo_url,         -- for your <img>
        headline,          -- optional subtitle
        bio,               -- fallback if no description
        rating,
        clients_count,     -- number of clients
        start_date,        -- for years of experience if you like
        created_at,        -- to sort by newest
        description        -- ← your new column
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
  const result = await pool.query('SELECT id, name FROM programs');
  res.json(result.rows);
});

// GET /api/slots
router.get('/slots', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, trainer_id, slot_start, slot_end, is_booked FROM appointment_slots'
    );
    res.json(result.rows); // returns an array of slots
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch slots' });
  }
});


// GET /api/trainers/:trainerId/slots?date=YYYY-MM-DD
router.get('/trainers/:trainerId/slots', async (req, res) => {
  const { trainerId } = req.params;
  const { date } = req.query;

  // Only fetch slots for the selected date and where is_booked is false
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

// POST /admin/slots
router.post('/slots', async (req, res) => {
  const { trainer_id, slot_start, slot_end } = req.body;
  if (!trainer_id || !slot_start || !slot_end) {
    return res.status(400).json({ success: false, error: "Missing data" });
  }
  try {
    // Convert to Date objects
    let start = new Date(slot_start);
    const end = new Date(slot_end);
    if (start >= end) return res.status(400).json({ success: false, error: "End time must be after start time" });

    // Prepare slot creation
    const slots = [];
    while (start < end) {
      const slotEnd = new Date(start);
      slotEnd.setHours(slotEnd.getHours() + 1);
      if (slotEnd > end) break;
      slots.push({ start: new Date(start), end: new Date(slotEnd) });
      start = slotEnd;
    }
    if (slots.length === 0) {
      return res.status(400).json({ success: false, error: "No slots generated. Choose a longer time range." });
    }

    // Insert all slots
    const results = [];
    for (const s of slots) {
      const result = await pool.query(
        `INSERT INTO appointment_slots (trainer_id, slot_start, slot_end, is_booked)
         VALUES ($1, $2, $3, false) RETURNING *`,
        [trainer_id, s.start, s.end]
      );
      results.push(result.rows[0]);
    }

    res.json({ success: true, slots: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to create slots" });
  }
});


// GET /api/my-sessions.  (get all user bookings)
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



module.exports = router;
