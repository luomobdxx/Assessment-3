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


/**
 * POST /api/ngos
 * create new NGO
 */
router.post('/', (req, res) => {
  const { ngo_name, hq_location, contact_email } = req.body;

  if (!ngo_name || !hq_location || !contact_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `INSERT INTO ngo (ngo_name, hq_location, contact_email) VALUES (?, ?, ?)`;
  conn.query(sql, [ngo_name, hq_location, contact_email], (e, result) => {
    if (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to create NGO' });
    }
    res.status(201).send();
  });
});

/**
 * PUT /api/ngos/:id
 * update NGO
 */
router.put('/:id', (req, res) => {
  const ngo_id = req.params.id;
  const { ngo_name, hq_location, contact_email } = req.body;

  if (!ngo_name || !hq_location || !contact_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    UPDATE ngo 
    SET ngo_name = ?, hq_location = ?, contact_email = ?
    WHERE ngo_id = ?
  `;
  conn.query(sql, [ngo_name, hq_location, contact_email, ngo_id], (e, result) => {
    if (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to update NGO' });
    }
    res.status(204).send();
  });
});

/**
 * DELETE /api/ngos/:id
 * delete NGO
 */
router.delete('/:id', (req, res) => {
  const ngo_id = req.params.id;

  // Check if there are any associated events
  const eventSql = `SELECT * FROM event WHERE ngo_id = ?`;
  conn.query(eventSql, [ngo_id], (eventErr, rows) => {
    if (eventErr) {
      console.error(eventErr);
      return res.status(500).json({ error: 'Failed to check related events' });
    }

    if (rows.length > 0) {
      return res.status(409).json({
        error: `Cannot delete this NGO because there are ${rows.length} related event(s).`,
      });
    }

    // delete NGO
    const deleteSql = `DELETE FROM ngo WHERE ngo_id = ?`;
    conn.query(deleteSql, [ngo_id], (deleteErr, result) => {
      if (deleteErr) {
        console.error(deleteErr);
        return res.status(500).json({ error: 'Failed to delete NGO' });
      }
      res.json({ message: 'success deleted' });
    });
  });
});

module.exports = router
