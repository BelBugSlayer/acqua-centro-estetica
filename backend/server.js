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

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'Acqua Centro de Estetica' });
});

// Endpoint para hacer seed
app.post('/api/seed', async (req, res) => {
  try {
    const Service = require('./models/Service');
    const Product = require('./models/Product');
    const Appointment = require('./models/Appointment');
    const Order = require('./models/Order');

    // Limpiar colecciones
    await Promise.all([
      Service.deleteMany({}),
      Product.deleteMany({}),
      Appointment.deleteMany({}),
      Order.deleteMany({})
    ]);

    const services = [
      {
        code: 'SER-LABIOS',
        name: 'Relleno de labios',
        description: 'Armonizacion y definicion del labio con enfoque natural, evaluacion previa y seguimiento.',
        category: 'inyectables',
        price: 85000,
        durationMinutes: 45,
        imageUrl: '/assets/services/relleno-labios.jpeg',
        featured: true
      },
      {
        code: 'SER-RINO',
        name: 'Rinomodelacion',
        description: 'Correccion estetica no quirurgica del perfil nasal mediante tecnica minimamente invasiva.',
        category: 'inyectables',
        price: 110000,
        durationMinutes: 50,
        imageUrl: '/assets/services/rinomodelacion.jpeg',
        featured: true
      },
      {
        code: 'SER-BOTOX',
        name: 'Toxina botulinica',
        description: 'Tratamiento para suavizar lineas de expresion y lograr un aspecto descansado.',
        category: 'inyectables',
        price: 95000,
        durationMinutes: 40,
        imageUrl: '/assets/services/toxina-botulinica.jpeg',
        featured: true
      },
      {
        code: 'SER-PLASMA',
        name: 'Plasma facial',
        description: 'Bioestimulacion con plasma rico en plaquetas para mejorar luminosidad y textura de la piel.',
        category: 'facial',
        price: 65000,
        durationMinutes: 60,
        imageUrl: '/assets/services/plasma-facial.png'
      },
      {
        code: 'SER-HIDROXI',
        name: 'Bioestimulador hidroxiapatita de calcio',
        description: 'Tratamiento para estimular colageno, mejorar firmeza y calidad cutanea.',
        category: 'facial',
        price: 130000,
        durationMinutes: 60,
        imageUrl: '/assets/services/bioestimulador.png'
      },
      {
        code: 'SER-CORP',
        name: 'Tratamientos corporales',
        description: 'Plan corporal personalizado segun objetivo estetico, zona y evaluacion inicial.',
        category: 'corporal',
        price: 42000,
        durationMinutes: 50,
        imageUrl: '/assets/services/tratamiento-corporal.png'
      },
      {
        code: 'SER-CRIO',
        name: 'Criolipolisis',
        description: 'Tratamiento corporal para reduccion localizada mediante frio controlado.',
        category: 'corporal',
        price: 78000,
        durationMinutes: 70,
        imageUrl: '/assets/services/criolipolisis.png'
      },
      {
        code: 'SER-LIMPIEZA',
        name: 'Limpieza facial profunda',
        description: 'Higiene facial, extraccion, hidratacion y mascara final segun biotipo cutaneo.',
        category: 'facial',
        price: 38000,
        durationMinutes: 60,
        imageUrl: '/assets/services/limpieza-facial.jpeg'
      },
      {
        code: 'SER-MASAJES',
        name: 'Masajes',
        description: 'Sesion de bienestar orientada a relajacion, drenaje o descontractura.',
        category: 'bienestar',
        price: 30000,
        durationMinutes: 50,
        imageUrl: '/assets/services/masajes.jpeg'
      },
      {
        code: 'SER-UNAS',
        name: 'Servicio de unas',
        description: 'Manicuria, esmaltado y cuidado estetico de manos.',
        category: 'unas',
        price: 22000,
        durationMinutes: 75,
        imageUrl: '/assets/services/unas.png'
      },
      {
        code: 'SER-DEPI',
        name: 'Depilacion definitiva',
        description: 'Sesion por zona con tecnologia de depilacion progresiva.',
        category: 'depilacion',
        price: 25000,
        durationMinutes: 35,
        imageUrl: '/assets/services/depilacion.jpeg'
      }
    ];

    const products = [
      {
        code: 'PRO-CREMA-HIDRA',
        name: 'Crema facial hidratante',
        description: 'Crema de uso diario para mantener hidratacion y barrera cutanea.',
        category: 'cremas',
        price: 18500,
        stock: 18,
        imageUrl: '/assets/products/crema-nutritiva.jpeg'
      },
      {
        code: 'PRO-CREMA-ANTIAGE',
        name: 'Crema facial antiage',
        description: 'Formula orientada a mejorar textura, elasticidad y luminosidad.',
        category: 'skincare',
        price: 24000,
        stock: 12,
        imageUrl: '/assets/products/crema-dline.jpeg'
      },
      {
        code: 'PRO-COLAGENO',
        name: 'Colageno hidrolizado',
        description: 'Suplemento para acompanar rutinas de cuidado de piel, cabello y unas.',
        category: 'suplementos',
        price: 29500,
        stock: 20,
        imageUrl: '/assets/products/colageno.jpeg'
      }
    ];

    // Insertar datos
    await Service.insertMany(services);
    await Product.insertMany(products);

    res.json({ message: '✅ Seed completado correctamente' });
  } catch (error) {
    console.error('Error en seed:', error);
    res.status(500).json({ error: error.message });
  }
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
