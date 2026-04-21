const express = require('express');
const authenticateToken = require('../middleware/auth');
const { getConnection, sql } = require('../db');
const router = express.Router();
router.use(authenticateToken);

router.post('/', async (req, res) => {
  const { couponCode } = req.body;
  try {
    const pool = await getConnection();
    const cart = await pool.request().input('userId', req.user.userId)
      .query(`SELECT ci.productId, ci.quantity, p.name, p.price FROM CartItems ci JOIN Products p ON ci.productId = p.productId WHERE ci.userId = @userId`);
    if (cart.recordset.length === 0) return res.status(400).json({ error: 'Cart empty' });
    let subtotal = cart.recordset.reduce((s, i) => s + (i.price * i.quantity), 0);
    let discount = 0;
    if (couponCode === 'HUNGRY50') discount = Math.min(subtotal * 0.5, 100);
    else if (couponCode === 'SAVE20') discount = subtotal * 0.2;
    const finalAmount = subtotal - discount;
    const orderNumber = 'HF' + Date.now().toString().slice(-6);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    const orderResult = await transaction.request()
      .input('userId', req.user.userId).input('orderNumber', orderNumber).input('totalAmount', subtotal).input('discountAmount', discount).input('finalAmount', finalAmount)
      .query(`INSERT INTO Orders (userId, orderNumber, totalAmount, discountAmount, finalAmount) OUTPUT INSERTED.orderId VALUES (@userId, @orderNumber, @totalAmount, @discountAmount, @finalAmount)`);
    const orderId = orderResult.recordset[0].orderId;
    for (let item of cart.recordset) {
      await transaction.request().input('orderId', orderId).input('productId', item.productId).input('productName', item.name).input('price', item.price).input('quantity', item.quantity)
        .query(`INSERT INTO OrderItems (orderId, productId, productName, price, quantity) VALUES (@orderId, @productId, @productName, @price, @quantity)`);
    }
    await transaction.request().input('userId', req.user.userId).query('DELETE FROM CartItems WHERE userId = @userId');
    await transaction.commit();
    res.json({ orderId: orderNumber, finalAmount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/history', async (req, res) => {
  try {
    const pool = await getConnection();
    const orders = await pool.request().input('userId', req.user.userId)
      .query('SELECT orderId, orderNumber, totalAmount, discountAmount, finalAmount, status, placedAt FROM Orders WHERE userId = @userId ORDER BY placedAt DESC');
    res.json(orders.recordset);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
