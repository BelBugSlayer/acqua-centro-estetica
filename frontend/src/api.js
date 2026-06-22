const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de conexion' }));
    throw new Error(error.message || 'Error de solicitud');
  }

  return response.json();
}

export const api = {
  getServices: () => request('/services'),
  getProducts: () => request('/products'),
  createAppointment: (payload) => request('/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  createOrder: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) })
};

