import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CalendarDays,
  CreditCard,
  Instagram,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Store,
  Timer
} from 'lucide-react';
import { api } from './api';
import './styles.css';

const mercadoPagoDemoUrl = 'https://www.mercadopago.com.ar/';
const transferData = {
  cbu: '0000003100012345678901',
  alias: 'ACQUA.ESTETICA.MP',
  holder: 'Acqua Centro de Estetica'
};

const fallbackServices = [
  {
    _id: '1',
    name: 'Relleno de labios',
    description: 'Definicion y volumen con resultado natural.',
    category: 'inyectables',
    price: 85000,
    durationMinutes: 45,
    imageUrl: '/assets/services/relleno-labios.jpeg'
  },
  {
    _id: '2',
    name: 'Rinomodelacion',
    description: 'Perfilado nasal no quirurgico.',
    category: 'inyectables',
    price: 110000,
    durationMinutes: 50,
    imageUrl: '/assets/services/rinomodelacion.jpeg'
  },
  {
    _id: '3',
    name: 'Toxina botulinica',
    description: 'Tratamiento para suavizar lineas de expresion.',
    category: 'inyectables',
    price: 95000,
    durationMinutes: 40,
    imageUrl: '/assets/services/toxina-botulinica.jpeg'
  },
  {
    _id: '4',
    name: 'Plasma facial',
    description: 'Bioestimulacion para mejorar luminosidad y textura.',
    category: 'facial',
    price: 65000,
    durationMinutes: 60,
    imageUrl: '/assets/services/plasma-facial.png'
  },
  {
    _id: '5',
    name: 'Criolipolisis',
    description: 'Reduccion localizada mediante frio controlado.',
    category: 'corporal',
    price: 78000,
    durationMinutes: 70,
    imageUrl: '/assets/services/criolipolisis.png'
  }
];

const fallbackProducts = [
  {
    _id: 'p1',
    name: 'Crema facial nutritiva',
    description: 'Crema facial para cuidado diario y piel sana.',
    category: 'cremas',
    price: 18500,
    stock: 18,
    imageUrl: '/assets/products/crema-nutritiva.jpeg'
  },
  {
    _id: 'p2',
    name: 'Crema D-line antiage',
    description: 'Crema antiage para acompanar la rutina facial.',
    category: 'skincare',
    price: 24000,
    stock: 12,
    imageUrl: '/assets/products/crema-dline.jpeg'
  },
  {
    _id: 'p3',
    name: 'Colageno hidrolizado',
    description: 'Suplemento con calcio, magnesio y vitamina C.',
    category: 'suplementos',
    price: 29500,
    stock: 20,
    imageUrl: '/assets/products/colageno.jpeg'
  }
];

const paymentMethods = [
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'mercado_pago', label: 'Mercado Pago' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'efectivo', label: 'Efectivo' }
];

const times = ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00', '18:00'];

function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(value);
}

function App() {
  const [view, setView] = useState('inicio');
  const [services, setServices] = useState(fallbackServices);
  const [products, setProducts] = useState(fallbackProducts);
  const [selectedService, setSelectedService] = useState(fallbackServices[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [client, setClient] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [cart, setCart] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, productsData] = await Promise.all([api.getServices(), api.getProducts()]);
        if (servicesData.length) {
          setServices(servicesData);
          setSelectedService(servicesData[0]);
        }
        if (productsData.length) setProducts(productsData);
      } catch {
        setMessage('Demo local: iniciar backend y MongoDB para guardar datos reales.');
      }
    }

    loadData();
  }, []);

  const cartItems = useMemo(() => {
    return products
      .filter((product) => cart[product._id])
      .map((product) => ({
        ...product,
        quantity: cart[product._id],
        subtotal: product.price * cart[product._id]
      }));
  }, [cart, products]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  function updateClient(field, value) {
    setClient((current) => ({ ...current, [field]: value }));
  }

  function updateCart(productId, amount) {
    setCart((current) => {
      const nextQuantity = Math.max((current[productId] || 0) + amount, 0);
      const next = { ...current };
      if (nextQuantity === 0) delete next[productId];
      else next[productId] = nextQuantity;
      return next;
    });
  }

  async function reserveAppointment(event) {
    event.preventDefault();
    setMessage('');

    try {
      await api.createAppointment({
        serviceId: selectedService._id,
        client: {
          fullName: client.fullName,
          email: client.email,
          phone: client.phone
        },
        date: selectedDate,
        time: selectedTime,
        paymentMethod,
        comments: 'Reserva creada desde la web'
      });
      setMessage('Turno registrado. Puede verse en MongoDB Compass dentro de appointments.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createOrder() {
    setMessage('');

    try {
      await api.createOrder({
        client,
        paymentMethod,
        products: cartItems.map((item) => ({ productId: item._id, quantity: item.quantity }))
      });
      setCart({});
      setMessage('Compra registrada. Puede verse en MongoDB Compass dentro de orders y products.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => setView('inicio')}>
          <img src="/assets/acqua-logo.jpeg" alt="Acqua Centro de Estetica" />
          <span>Acqua</span>
        </button>
        <nav>
          <button type="button" onClick={() => setView('servicios')}>Servicios</button>
          <button type="button" onClick={() => setView('productos')}>Productos</button>
          <button type="button" onClick={() => setView('turnos')}>Turnos</button>
          <button type="button" onClick={() => setView('carrito')}>
            <ShoppingCart size={16} /> Carrito ({cartItems.length})
          </button>
        </nav>
      </header>

      {view === 'inicio' && (
        <section className="hero">
          <div className="hero-copy">
            <img className="hero-logo" src="/assets/acqua-logo.jpeg" alt="Acqua Centro de Estetica" />
            <p className="eyebrow">Medicina estetica y bienestar</p>
            <h1>Acqua Centro de Estetica</h1>
            <p>
              Espacio dedicado a tratamientos faciales, corporales e inyectables, con atencion personalizada,
              productos de cuidado domiciliario y turnos organizados para cada paciente.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={() => setView('turnos')}>
                Solicitar turno
              </button>
              <button className="ghost-button" type="button" onClick={() => setView('productos')}>
                Ver productos
              </button>
            </div>
          </div>
          <div className="doctor-card">
            <img src="/assets/dr-leo.jpeg" alt="Dr. Leo Grabauska" />
            <div>
              <p className="eyebrow">Medico encargado</p>
              <h2>Dr. Leo Grabauska</h2>
              <p>
                Responsable de la evaluacion y seguimiento de tratamientos esteticos, priorizando resultados
                naturales y un plan adecuado a cada paciente.
              </p>
            </div>
          </div>
          <div className="home-summary">
            <strong>Atencion profesional</strong>
            <span>Turnos, consultas, productos y formas de pago en un mismo lugar.</span>
          </div>
        </section>
      )}

      {view === 'servicios' && (
        <section className="section">
          <PageTitle icon={<CalendarDays />} title="Servicios" subtitle="Tratamientos disponibles para solicitar turno en Acqua." />
          <div className="card-grid">
            {services.map((service) => (
              <article className="catalog-card" key={service._id}>
                <img src={service.imageUrl || '/assets/services/default-service.svg'} alt={service.name} />
                <div>
                  <span className="tag">{service.category}</span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <footer>
                    <span><Timer size={16} /> {service.durationMinutes} min</span>
                    <strong>{formatPrice(service.price)}</strong>
                  </footer>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                      setView('turnos');
                    }}
                  >
                    Reservar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === 'productos' && (
        <section className="section">
          <PageTitle icon={<Store />} title="Productos" subtitle="Productos de cuidado domiciliario disponibles para comprar." />
          <div className="card-grid">
            {products.map((product) => (
              <article className="catalog-card" key={product._id}>
                <img src={product.imageUrl || '/assets/services/default-service.svg'} alt={product.name} />
                <div>
                  <span className="tag">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{formatPrice(product.price)}</strong>
                  <small>Stock disponible: {product.stock}</small>
                  <div className="stepper">
                    <button type="button" aria-label="Quitar" onClick={() => updateCart(product._id, -1)}><Minus size={16} /></button>
                    <span>{cart[product._id] || 0}</span>
                    <button type="button" aria-label="Agregar" onClick={() => updateCart(product._id, 1)}><Plus size={16} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {view === 'turnos' && (
        <section className="section narrow">
          <PageTitle icon={<CalendarDays />} title="Solicitar turno" subtitle="Elegir servicio, fecha, horario y forma de pago." />
          <form className="form-panel" onSubmit={reserveAppointment}>
            <label>
              Servicio
              <select value={selectedService?._id || ''} onChange={(event) => setSelectedService(services.find((item) => item._id === event.target.value))}>
                {services.map((service) => (
                  <option value={service._id} key={service._id}>{service.name} - {formatPrice(service.price)}</option>
                ))}
              </select>
            </label>
            <label>
              Fecha
              <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} required />
            </label>
            <label>
              Horario
              <select value={selectedTime} onChange={(event) => setSelectedTime(event.target.value)}>
                {times.map((time) => <option value={time} key={time}>{time}</option>)}
              </select>
            </label>
            <ClientFields client={client} updateClient={updateClient} includeAddress={false} />
            <label>
              Metodo de pago
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                {paymentMethods.map((method) => <option value={method.value} key={method.value}>{method.label}</option>)}
              </select>
            </label>
            <button className="primary-button" type="submit">
              <CreditCard size={18} /> Confirmar turno
            </button>
          </form>
        </section>
      )}

      {view === 'carrito' && (
        <section className="section narrow">
          <PageTitle icon={<ShoppingCart />} title="Carrito de compras" subtitle="Revisar productos, datos de contacto y forma de pago." />
          <div className="cart-panel">
            {cartItems.length === 0 ? (
              <p>No hay productos agregados.</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-row" key={item._id}>
                  <span>{item.name} x{item.quantity}</span>
                  <strong>{formatPrice(item.subtotal)}</strong>
                </div>
              ))
            )}
            <div className="cart-total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
            <ClientFields client={client} updateClient={updateClient} includeAddress />
            <label>
              Metodo de pago
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                {paymentMethods.map((method) => <option value={method.value} key={method.value}>{method.label}</option>)}
              </select>
            </label>
            {paymentMethod === 'transferencia' && (
              <div className="payment-box">
                <strong>Datos para transferencia</strong>
                <span>CBU: {transferData.cbu}</span>
                <span>Alias: {transferData.alias}</span>
                <span>Titular: {transferData.holder}</span>
              </div>
            )}
            {paymentMethod === 'mercado_pago' && (
              <div className="payment-box">
                <strong>Mercado Pago</strong>
                <span>El boton abre Mercado Pago como enlace demostrativo.</span>
              </div>
            )}
            <div className="button-row">
              <button className="primary-button" type="button" disabled={!cartItems.length} onClick={createOrder}>
                Registrar compra
              </button>
              <a className="mercado-button" href={mercadoPagoDemoUrl} target="_blank" rel="noreferrer">
                Ir a Mercado Pago
              </a>
            </div>
          </div>
        </section>
      )}

      {message && <p className="toast">{message}</p>}

      <footer className="footer">
        <div>
          <h2>Acqua Centro de Estetica</h2>
          <p>Tratamientos esteticos, bienestar y cuidado facial.</p>
        </div>
        <a href="https://www.instagram.com/acqua.lr?igsh=aXh0aTJoNmp6Ynpz" target="_blank" rel="noreferrer">
          <Instagram size={18} /> Instagram
        </a>
        <span><Phone size={18} /> 3804 258049</span>
        <span><MapPin size={18} /> Benjamin de la Vega 214</span>
      </footer>
    </main>
  );
}

function PageTitle({ icon, title, subtitle }) {
  return (
    <div className="page-title">
      <span>{icon}</span>
      <div>
        <p className="eyebrow">Acqua Centro de Estetica</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function ClientFields({ client, updateClient, includeAddress }) {
  return (
    <>
      <label>
        Nombre y apellido
        <input value={client.fullName} onChange={(event) => updateClient('fullName', event.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={client.email} onChange={(event) => updateClient('email', event.target.value)} required />
      </label>
      <label>
        Telefono
        <input value={client.phone} onChange={(event) => updateClient('phone', event.target.value)} required />
      </label>
      {includeAddress && (
        <label>
          Direccion
          <input value={client.address} onChange={(event) => updateClient('address', event.target.value)} required />
        </label>
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
