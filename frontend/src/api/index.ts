import api from './client';

// Auth
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

// Products
export const productsAPI = {
  getAll: (category?: string) => api.get('/products', { params: { category } }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  getMine: () => api.get('/products/mine'),
};

// Services
export const servicesAPI = {
  getAll: (category?: string) => api.get('/services', { params: { category } }),
  getById: (id: string) => api.get(`/services/${id}`),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
  getMine: () => api.get('/services/mine'),
};

// Orders
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getMine: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string) => api.patch(`/orders/${id}/cancel`),
  updateStatus: (id: string, status: string) => api.patch(`/orders/${id}/status`, { status }),
};

// Reviews
export const reviewsAPI = {
  create: (data: any) => api.post('/reviews', data),
  forProduct: (id: string) => api.get(`/reviews/product/${id}`),
  forService: (id: string) => api.get(`/reviews/service/${id}`),
};

// Search
export const searchAPI = {
  search: (q: string, type?: string, category?: string) =>
    api.get('/search', { params: { q, type, category } }),
};

// Admin
export const adminAPI = {
  stats: () => api.get('/admin/stats'),
  users: () => api.get('/admin/users'),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

// Profiles
export const profilesAPI = {
  createVendor: (data: any) => api.post('/profiles/vendor', data),
  getMyVendor: () => api.get('/profiles/vendor/me'),
  createProvider: (data: any) => api.post('/profiles/provider', data),
  getMyProvider: () => api.get('/profiles/provider/me'),
};
