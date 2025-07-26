const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool    = require('../db');

const router = express.Router();

// GET /api/trainers
router.get('/trainers', async (req, res) => {
  const result = await pool.query('SELECT id, first_name, last_name, headline, rating FROM trainers WHERE is_active = true');
  res.json(result.rows);
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

// POST /api/bookings
router.post('/bookings', async (req, res) => {
  const userId = req.user.id; // assumes JWT or session middleware sets req.user
  const id = uuidv4();
  const { slotId, programId, notes } = req.body;

  // 1. Check if slot exists and is available
  const slotResult = await pool.query(
    'SELECT * FROM appointment_slots WHERE id = $1 AND is_booked = false',
    [slotId]
  );
  if (slotResult.rows.length === 0) {
    return res.status(400).json({ success: false, message: 'This slot is already booked or unavailable.' });
  }

  // 2. Book the slot (transaction)
  try {
    await pool.query('BEGIN');

    // Update slot to booked
    await pool.query(
      'UPDATE appointment_slots SET is_booked = true WHERE id = $1',
      [slotId]
    );

    // Create the session
    const sessionResult = await pool.query(
      `INSERT INTO sessions (id, user_id, slot_id, program_id, notes, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'booked', NOW())
       RETURNING *`,
      [id, userId, slotId, programId, notes || null]
    );

    await pool.query('COMMIT');

    res.json({ success: true, session: sessionResult.rows[0] });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ success: false, message: 'Booking failed. Please try again.' });
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
