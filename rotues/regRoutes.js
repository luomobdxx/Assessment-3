const express = require('express');
const db = require('../event_db');
const conn = db.getConnection();
conn.connect();

const router = express.Router();

/**
 * GET /api/registrations
 * get all registrations
 */
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      r.registration_id,
      r.event_id,
      e.name,
      r.full_name,
      r.email,
      r.phone,
      r.tickets,
      r.registered_at
    FROM registration r
    LEFT JOIN event e ON r.event_id = e.event_id
    ORDER BY r.registered_at DESC
  `;

  conn.query(sql, (e, rows) => {
    if (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to fetch registrations' });
    }
    res.json(rows);
  });
});


/**
 * DELETE /api/registrations/:id
 * delete registration
 */
router.delete('/:id', (req, res) => {
  const registration_id = req.params.id;

  const sql = `DELETE FROM registration WHERE registration_id = ?`;
  conn.query(sql, [registration_id], (e, result) => {
    if (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to delete registration' });
    }
    res.json({ message: 'success deleted ' });
  });
});

module.exports = router
