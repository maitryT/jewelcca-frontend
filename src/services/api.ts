import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jewelcca_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jewelcca_token');
      localStorage.removeItem('jewelcca_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (firstName: string, lastName: string, email: string, password: string) =>
    api.post('/auth/register', { firstName, lastName, email, password }),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
  create: (category: any) => api.post('/categories', category),
  update: (id: string, category: any) => api.put(`/categories/${id}`, category),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Products API
export const productsAPI = {
  getAll: (page = 0, size = 20) => api.get(`/products?page=${page}&size=${size}`),
  getById: (id: string) => api.get(`/products/${id}`),
  getByCategory: (categorySlug: string, page = 0, size = 20) =>
    api.get(`/products/category/${categorySlug}?page=${page}&size=${size}`),
  search: (keyword: string, page = 0, size = 20) =>
    api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}`),
  getByPriceRange: (minPrice: number, maxPrice: number, page = 0, size = 20) =>
    api.get(`/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}`),
  getFeatured: () => api.get('/products/featured'),
  getTopRated: () => api.get('/products/top-rated'),
  create: (product: any) => api.post('/products', product),
  update: (id: string, product: any) => api.put(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
  getItems: () => api.get('/cart'),
  addItem: (productId: number, quantity: number) =>
    api.post('/cart/add', { productId, quantity }),
  updateItem: (productId: number, quantity: number) =>
    api.put(`/cart/update/${productId}`, { quantity }),
  removeItem: (productId: number) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete('/cart/clear'),
};

// Wishlist API
export const wishlistAPI = {
  getItems: () => api.get('/wishlist'),
  addItem: (productId: number) => api.post(`/wishlist/add/${productId}`),
  removeItem: (productId: number) => api.delete(`/wishlist/remove/${productId}`),
  checkItem: (productId: number) => api.get(`/wishlist/check/${productId}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getByOrderNumber: (orderNumber: string) => api.get(`/orders/order-number/${orderNumber}`),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
  updateTracking: (id: string, trackingNumber: string) => api.put(`/orders/${id}/tracking`, { trackingNumber }),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId: string, page = 0, size = 10) =>
    api.get(`/reviews/product/${productId}?page=${page}&size=${size}`),
  addReview: (productId: string, rating: number, comment: string) =>
    api.post(`/reviews/product/${productId}`, { rating, comment }),
  updateReview: (reviewId: string, rating: number, comment: string) =>
    api.put(`/reviews/${reviewId}`, { rating, comment }),
  deleteReview: (reviewId: string) => api.delete(`/reviews/${reviewId}`),
};

// Offers API
export const offersAPI = {
  getAll: () => api.get('/offers'),
  getById: (id: string) => api.get(`/offers/${id}`),
  getByCode: (code: string) => api.get(`/offers/code/${code}`),
  create: (offer: any) => api.post('/offers', offer),
  update: (id: string, offer: any) => api.put(`/offers/${id}`, offer),
  delete: (id: string) => api.delete(`/offers/${id}`),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  getAllUsers: (page = 0, size = 20) => api.get(`/users/admin/all?page=${page}&size=${size}`),
  getUserById: (id: string) => api.get(`/users/admin/${id}`),
  updateUser: (id: string, userData: any) => api.put(`/users/admin/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/admin/${id}`),
};

// Payment API
export const paymentAPI = {
  createOrder: (orderId: number) => api.post('/payment/create-order', { orderId }),
  verifyPayment: (paymentData: any) => api.post('/payment/verify', paymentData),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getSalesChart: (days = 30) => api.get(`/admin/dashboard/sales-chart?days=${days}`),
  getCategorySales: () => api.get('/admin/dashboard/category-sales'),
  getRecentOrders: () => api.get('/admin/dashboard/recent-orders'),
  getTopProducts: () => api.get('/admin/dashboard/top-products'),
  getRevenueChart: (months = 12) => api.get(`/admin/dashboard/revenue-chart?months=${months}`),
  
  // User Management
  getAllUsers: (page = 0, size = 20) => api.get(`/admin/users?page=${page}&size=${size}`),
  searchUsers: (keyword: string, page = 0, size = 20) => 
    api.get(`/admin/users/search?keyword=${keyword}&page=${page}&size=${size}`),
  updateUserStatus: (id: number, enabled: boolean) => 
    api.put(`/admin/users/${id}/status`, { enabled }),
  updateUserRole: (id: number, role: string) => 
    api.put(`/admin/users/${id}/role`, { role }),
  
  // Order Management
  getAllOrders: (page = 0, size = 20) => api.get(`/admin/orders?page=${page}&size=${size}`),
  searchOrders: (keyword: string, page = 0, size = 20) => 
    api.get(`/admin/orders/search?keyword=${keyword}&page=${page}&size=${size}`),
  filterOrders: (filters: any, page = 0, size = 20) => 
    api.get(`/admin/orders/filter`, { params: { ...filters, page, size } }),
  
  // Product Management
  getAllProducts: (page = 0, size = 20) => api.get(`/admin/products?page=${page}&size=${size}`),
  getLowStockProducts: () => api.get('/admin/products/low-stock'),
  updateProductStock: (id: number, stock: number) => 
    api.put(`/admin/products/${id}/stock`, { stock }),
  
  // Analytics
  getCustomerInsights: () => api.get('/admin/analytics/customer-insights'),
  getInventoryReport: () => api.get('/admin/analytics/inventory-report'),
  getFinancialSummary: (startDate?: string, endDate?: string) => 
    api.get('/admin/analytics/financial-summary', { params: { startDate, endDate } }),
};

export default api;