const express = require('express');
const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const filter = req.query.category ? { category: req.query.category, active: true } : { active: true };
  const services = await Service.find(filter).sort({ featured: -1, category: 1, name: 1 });
  res.json(services);
}));

router.post('/', asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
  res.json(service);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!service) return res.status(404).json({ message: 'Servicio no encontrado' });
  res.json({ message: 'Servicio desactivado', service });
}));

module.exports = router;
