const express = require('express');
const { getConnection } = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const { category, subcategory, sort, page = 1, limit = 20, search } = req.query;
  const offset = (page - 1) * limit;
  let sqlQuery = `SELECT p.productId, p.name, p.price, p.rating, p.imageEmoji, p.discountPercent, p.isPopular, c.name as categoryName, s.name as subcategoryName
    FROM Products p JOIN Categories c ON p.categoryId = c.categoryId LEFT JOIN Subcategories s ON p.subcategoryId = s.subcategoryId WHERE 1=1`;
  const params = [];
  if (category) { sqlQuery += ` AND c.name = @category`; params.push({ name: 'category', value: category }); }
  if (subcategory && subcategory !== 'all') { sqlQuery += ` AND s.name = @subcategory`; params.push({ name: 'subcategory', value: subcategory }); }
  if (search) { sqlQuery += ` AND p.name LIKE @search`; params.push({ name: 'search', value: `%${search}%` }); }
  if (sort === 'price-low') sqlQuery += ` ORDER BY p.price ASC`;
  else if (sort === 'price-high') sqlQuery += ` ORDER BY p.price DESC`;
  else if (sort === 'rating') sqlQuery += ` ORDER BY p.rating DESC`;
  else sqlQuery += ` ORDER BY p.isPopular DESC, p.productId`;
  sqlQuery += ` OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;
  params.push({ name: 'offset', value: offset }, { name: 'limit', value: parseInt(limit) });
  try {
    const pool = await getConnection();
    const request = pool.request();
    params.forEach(p => request.input(p.name, p.value));
    const result = await request.query(sqlQuery);
    const countRes = await pool.request().query('SELECT COUNT(*) as total FROM Products');
    const total = countRes.recordset[0].total;
    res.json({ products: result.recordset, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/trending', async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  try {
    const pool = await getConnection();
    const result = await pool.request().input('limit', limit).query(`SELECT TOP (@limit) p.*, c.name as categoryName FROM Products p JOIN Categories c ON p.categoryId = c.categoryId WHERE p.isPopular = 1 ORDER BY p.productId`);
    res.json(result.recordset);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
module.exports = router;
