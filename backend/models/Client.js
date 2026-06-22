const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

clientSchema.index({ email: 1 });
clientSchema.index({ phone: 1 });

module.exports = mongoose.model('Client', clientSchema);

