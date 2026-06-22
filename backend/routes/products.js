const express = require('express');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const filter = req.query.category ? { category: req.query.category, active: true } : { active: true };
  const products = await Product.find(filter).sort({ category: 1, name: 1 });
  res.json(products);
}));

router.post('/', asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json({ message: 'Producto desactivado', product });
}));

module.exports = router;
