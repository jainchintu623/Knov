// seed to create admin, vendor, products
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db';
const SALT = Number(process.env.SALT_ROUNDS || 10);

async function main() {
  await mongoose.connect(MONGO);
  console.log('Connected to Mongo for seeding');

  const hashed = await bcrypt.hash('adminpass', SALT);
  let admin = await User.findOne({ email: 'admin@example.com' });
  if (!admin) {
    admin = new User({ email: 'admin@example.com', password: hashed, name: 'Admin', isAdmin: true });
    await admin.save();
  }

  let vendor = await Vendor.findOne({ email: 'vendor@example.com' });
  if (!vendor) {
    vendor = new Vendor({ name: 'Acme Co', email: 'vendor@example.com', phone: '1234567890' });
    await vendor.save();
  }

  const exist = await Product.findOne({ title: 'Product A' });
  if (!exist) {
    await Product.create([
      { title: 'Product A', description: 'Nice A', price: 10.5, vendor: vendor._id },
      { title: 'Product B', description: 'Nice B', price: 20, vendor: vendor._id },
      { title: 'Product C', description: 'Nice C', price: 5.99, vendor: vendor._id }
    ]);
  }

  console.log('Seed complete');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
