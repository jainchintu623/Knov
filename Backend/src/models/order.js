const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: { type: Number, default: 1 },
  price: { type: Number }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], default: [] },
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
