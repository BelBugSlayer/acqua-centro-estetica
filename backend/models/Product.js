const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['cremas', 'suplementos', 'skincare'] },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ category: 1, active: 1 });

module.exports = mongoose.model('Product', productSchema);
