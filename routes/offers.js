const express = require('express');
const { getConnection } = require('../db');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const offers = await pool.request().query('SELECT * FROM Offers WHERE (validUntil IS NULL OR validUntil >= GETDATE())');
    res.json(offers.recordset);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
