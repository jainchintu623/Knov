const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

// POST /api/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '6h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
  } catch (err) {
    next(err);
  }
});

// Register demo user for convenience (not for production)
router.post('/register', async (req, res, next) => {
  try {
    const { email, password = 'password', name = 'Demo', isAdmin = false } = req.body;
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ email, password: hashed, name, isAdmin });
    await user.save();
    res.status(201).json({ user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    next(err);
  }
});

module.exports = router;
