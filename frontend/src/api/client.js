import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://digital-services-platform-slnw.onrender.com/api/v1';

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for clear errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.response) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response.data === 'object') {
        // Collect field errors
        const messages = Object.entries(error.response.data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('\n');
        errorMessage = messages || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'Could not connect to the server. Please check your internet connection or verify the backend server is running.';
    }
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response ? error.response.status : null;
    enhancedError.data = error.response ? error.response.data : null;
    return Promise.reject(enhancedError);
  }
);

export const serviceAPI = {
  getCategories: () => apiClient.get('/categories/'),
  getServices: (params) => apiClient.get('/services/', { params }),
  getServiceBySlug: (slug) => apiClient.get(`/services/${slug}/`),
};

export const requestAPI = {
  createRequest: (formData) => apiClient.post('/requests/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  checkStatus: (ref, token) => apiClient.get('/requests/status/', {
    params: { ref, token },
  }),
};

export const posterAPI = {
  getCategories: () => apiClient.get('/posters/categories/'),
  getTemplates: (params) => apiClient.get('/posters/templates/', { params }),
  getTemplateBySlug: (slug) => apiClient.get(`/posters/templates/${slug}/`),
  createOrder: (formData, onUploadProgress) => apiClient.post('/posters/orders/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  }),
  getOrderStatus: (reference, email) => apiClient.get(`/posters/orders/${reference}/`, {
    params: { email },
  }),
};

export const blogAPI = {
  getCategories: () => apiClient.get('/blog/categories/'),
  getPosts: (params) => apiClient.get('/blog/posts/', { params }),
  getPostBySlug: (slug) => apiClient.get(`/blog/posts/${slug}/`),
};

export const waasAPI = {
  getCategories: () => apiClient.get('/websites/categories/'),
  getPackages: () => apiClient.get('/websites/packages/'),
  getTemplates: (params) => apiClient.get('/websites/templates/', { params }),
  createOrder: (formData) => apiClient.post('/websites/orders/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getOrderStatus: (params) => apiClient.get('/websites/orders/status/', { params }),
  triggerExport: (orderRef, data) => apiClient.post(`/websites/orders/${orderRef}/export/`, data),
  getAdminOrders: () => apiClient.get('/websites/admin/orders/'),
  updateAdminOrder: (orderRef, data) => apiClient.patch(`/websites/admin/orders/${orderRef}/`, data),
};

export default apiClient;
