const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    client: {
      fullName: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true }
    },
    service: {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
      code: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      durationMinutes: { type: Number, required: true }
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['efectivo', 'transferencia', 'tarjeta', 'mercado_pago']
    },
    status: {
      type: String,
      default: 'pendiente',
      enum: ['pendiente', 'confirmado', 'cancelado', 'realizado']
    },
    total: { type: Number, required: true },
    comments: { type: String, trim: true }
  },
  { timestamps: true }
);

appointmentSchema.index({ date: 1, time: 1, 'service.serviceId': 1 }, { unique: true });
appointmentSchema.index({ 'client.email': 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);

