const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getConnection } = require('../db');
const router = express.Router();
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().input('userId', req.user.userId)
      .query(`SELECT ci.cartItemId, ci.quantity, p.productId, p.name, p.price, p.imageEmoji FROM CartItems ci JOIN Products p ON ci.productId = p.productId WHERE ci.userId = @userId`);
    res.json(result.recordset);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    const pool = await getConnection();
    const existing = await pool.request().input('userId', req.user.userId).input('productId', productId)
      .query('SELECT * FROM CartItems WHERE userId = @userId AND productId = @productId');
    if (existing.recordset.length > 0) {
      await pool.request().input('cartItemId', existing.recordset[0].cartItemId).input('quantity', quantity)
        .query('UPDATE CartItems SET quantity = quantity + @quantity WHERE cartItemId = @cartItemId');
    } else {
      await pool.request().input('userId', req.user.userId).input('productId', productId).input('quantity', quantity)
        .query('INSERT INTO CartItems (userId, productId, quantity) VALUES (@userId, @productId, @quantity)');
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:cartItemId', async (req, res) => {
  const { quantity } = req.body;
  try {
    const pool = await getConnection();
    await pool.request().input('cartItemId', req.params.cartItemId).input('quantity', quantity)
      .query('UPDATE CartItems SET quantity = @quantity WHERE cartItemId = @cartItemId');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:cartItemId', async (req, res) => {
  try {
    const pool = await getConnection();
    await pool.request().input('cartItemId', req.params.cartItemId).query('DELETE FROM CartItems WHERE cartItemId = @cartItemId');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/clear/all', async (req, res) => {
  try {
    const pool = await getConnection();
    await pool.request().input('userId', req.user.userId).query('DELETE FROM CartItems WHERE userId = @userId');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
