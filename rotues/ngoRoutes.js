const express = require('express');
const db = require('../event_db');
const conn = db.getConnection();
conn.connect();

const router = express.Router();

/**
 * GET /api/ngos
 * Used for dropdown filtering：return all NGO
 */
router.get('/', (req, res) => {
  conn.query(
    `SELECT ngo_id, ngo_name, hq_location, contact_email FROM ngo ORDER BY ngo_name ASC`,
    (e, rows) => {
      if (e) {
        console.error(e);
        res.status(500).send({ error: 'Failed to Query NGOs' });
      } else {
        res.json(rows);
      }
    }
  );
});

module.exports = router
