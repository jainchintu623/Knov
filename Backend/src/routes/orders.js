const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const items = req.body.items;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });

    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map(p => [String(p._id), p]));

    let total = 0;
    const orderItems = items.map(i => {
      const p = productMap.get(String(i.productId));
      const qty = Number(i.qty) || 1;
      const price = p ? p.price : 0;
      total += price * qty;
      return { product: i.productId, qty, price };
    });

    const order = new Order({ user: req.user.id, items: orderItems, total });
    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
