const express = require('express');
const { getConnection } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT categoryId, name, icon FROM Categories');
    res.json(result.recordset);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
