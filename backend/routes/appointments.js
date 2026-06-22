const express = require('express');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.date) filter.date = req.query.date;
  if (req.query.email) filter['client.email'] = req.query.email.toLowerCase();
  const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });
  res.json(appointments);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { serviceId, client, date, time, paymentMethod, comments } = req.body;
  const service = await Service.findById(serviceId);

  if (!service || !service.active) {
    return res.status(404).json({ message: 'Servicio no disponible' });
  }

  const appointment = await Appointment.create({
    client,
    service: {
      serviceId: service._id,
      code: service.code,
      name: service.name,
      price: service.price,
      durationMinutes: service.durationMinutes
    },
    date,
    time,
    paymentMethod,
    total: service.price,
    comments
  });

  res.status(201).json(appointment);
}));

router.patch('/:id/status', asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!appointment) return res.status(404).json({ message: 'Turno no encontrado' });
  res.json(appointment);
}));

module.exports = router;
