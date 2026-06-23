require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const servicesRoutes = require('./routes/services');
const productsRoutes = require('./routes/products');
const appointmentsRoutes = require('./routes/appointments');
const ordersRoutes = require('./routes/orders');

const app = express();

connectDB();

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || origin.includes('belbuglayer.github.io') || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  }
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'Acqua Centro de Estetica' });
});

app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/orders', ordersRoutes);

app.use((error, req, res, next) => {
  if (error.code === 11000) {
    return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
  }
  console.error(error);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor Acqua en http://localhost:${PORT}`);
});
