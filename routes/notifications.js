const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getConnection } = require('../db');
const router = express.Router();
router.use(authenticateToken);
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const notifs = await pool.request().input('userId', req.user.userId)
      .query('SELECT * FROM Notifications WHERE userId = @userId ORDER BY createdAt DESC');
    res.json(notifs.recordset);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
