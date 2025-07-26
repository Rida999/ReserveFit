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
// POST /admin/slots
router.post('/slots', async (req, res) => {
  const { trainer_id, slot_start, slot_end, splitSlots } = req.body;
  if (!trainer_id || !slot_start || !slot_end) {
    return res.status(400).json({ success: false, error: "Missing data" });
  }
  try {
    let start = new Date(slot_start);
    const end = new Date(slot_end);
    if (start >= end) return res.status(400).json({ success: false, error: "End time must be after start time" });

    const slots = [];
    if (splitSlots) {
      while (start < end) {
        const slotEnd = new Date(start);
        slotEnd.setHours(slotEnd.getHours() + 1);
        if (slotEnd > end) slotEnd.setTime(end.getTime());
        slots.push({ start: new Date(start), end: new Date(slotEnd) });
        start = new Date(slotEnd);
      }
    } else {
      slots.push({ start, end });
    }

    if (slots.length === 0) {
      return res.status(400).json({ success: false, error: "No slots generated. Choose a longer time range." });
    }

    // Insert all slots
    const results = [];
    for (const s of slots) {
      const result = await pool.query(
        `INSERT INTO appointment_slots (id, trainer_id, slot_start, slot_end, is_booked)
         VALUES (gen_random_uuid(), $1, $2, $3, false) RETURNING *`,
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


module.exports = router;
