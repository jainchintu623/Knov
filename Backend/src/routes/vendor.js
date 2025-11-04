const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// POST /api/vendor/add
router.post('/add', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name & email required' });
    const v = new Vendor({ name, email, phone });
    await v.save();
    res.status(201).json({ vendor: v });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Vendor email exists' });
    next(err);
  }
});

module.exports = router;
