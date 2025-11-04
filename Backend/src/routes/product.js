const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const redisClient = require('../config/redisClient'); // wrapper file below

// GET /api/products?limit=10&page=1
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.max(1, Number(req.query.limit || 10));
    const page = Math.max(1, Number(req.query.page || 1));
    const skip = (page - 1) * limit;

    const cacheKey = `products:page=${page}:limit=${limit}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const products = await Product.find()
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    await redisClient.set(cacheKey, JSON.stringify(products), { EX: 30 });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const cacheKey = `product:${id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const product = await Product.findById(id).populate('vendor', 'name email').lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await redisClient.set(cacheKey, JSON.stringify(product), { EX: 30 });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res, next) => {
  try {
    const { title, description, price, vendorId } = req.body;
    if (!title || !price || !vendorId) return res.status(400).json({ error: 'title, price, vendorId required' });
    const p = new Product({ title, description, price: Number(price), vendor: vendorId });
    await p.save();

    // invalidate list caches (simple)
    const keys = await redisClient.keys('products:*');
    if (keys.length) await redisClient.del(keys);

    res.status(201).json({ product: p });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
