const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('shabil_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(error.error || error.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
};

export const api = {
  // Auth
  signup: async (userData) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  // Products
  getProducts: async () => {
    const res = await fetch(`${API_URL}/products`);
    return handleResponse(res);
  },
  createProduct: async (productData) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },
  updateStock: async (productId, amount) => {
    const res = await fetch(`${API_URL}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ amount })
    });
    return handleResponse(res);
  },

  // Orders
  getOrders: async (userId) => {
    const url = userId ? `${API_URL}/orders?user_id=${userId}` : `${API_URL}/orders`;
    const res = await fetch(url, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },
  createOrder: async (orderData) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  }
};
