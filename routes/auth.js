const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const pool = await getConnection();
    const result = await pool.request().input('mobile', mobile).query('SELECT * FROM Users WHERE mobile = @mobile');
    const user = result.recordset[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.userId, mobile: user.mobile }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, mobile: user.mobile, address: user.address } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
