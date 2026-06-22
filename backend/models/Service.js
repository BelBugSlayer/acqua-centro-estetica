const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['facial', 'corporal', 'inyectables', 'bienestar', 'unas', 'depilacion']
    },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, required: true, min: 15 },
    imageUrl: { type: String, default: '' },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, active: 1 });

module.exports = mongoose.model('Service', serviceSchema);
