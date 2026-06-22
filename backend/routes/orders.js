const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
}));

router.post('/', async (req, res) => {
  try {
    const productsPayload = req.body.products || [];
    if (!productsPayload.length) throw new Error('El pedido necesita al menos un producto');

    const productIds = productsPayload.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, active: true });

    const items = productsPayload.map((item) => {
      const product = products.find((entry) => entry._id.toString() === item.productId);
      if (!product) throw new Error('Producto no encontrado');
      if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

      return {
        productId: product._id,
        code: product.code,
        name: product.name,
        category: product.category,
        unitPrice: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    for (const item of items) {
      const result = await Product.updateOne(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (result.modifiedCount !== 1) throw new Error(`No se pudo actualizar stock de ${item.name}`);
    }

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const order = await Order.create({
      client: req.body.client,
      products: items,
      paymentMethod: req.body.paymentMethod,
      total
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id/status', asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  res.json(order);
}));

module.exports = router;
