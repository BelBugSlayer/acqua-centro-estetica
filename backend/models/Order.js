const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    client: {
      fullName: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      phone: { type: String, required: true },
      address: { type: String, required: true }
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        code: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true }
      }
    ],
    paymentMethod: {
      type: String,
      required: true,
      enum: ['efectivo', 'transferencia', 'tarjeta', 'mercado_pago']
    },
    status: {
      type: String,
      default: 'pendiente',
      enum: ['pendiente', 'pagado', 'preparado', 'entregado', 'cancelado']
    },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'client.email': 1 });

module.exports = mongoose.model('Order', orderSchema);

