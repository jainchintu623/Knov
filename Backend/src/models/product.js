const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  price: { type: Number, required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
