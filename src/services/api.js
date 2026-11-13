export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }
  // When running on live domain coderharbor.com, automatically route to api.coderharbor.com via HTTPS
  if (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return 'https://api.coderharbor.com/api';
  }
  return '/api';

  
};

const API_BASE_URL = getApiBaseUrl();

export const getFullImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80';
  }
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Route relative /uploads/... to backend domain
  const apiBase = getApiBaseUrl().replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${apiBase}${cleanPath}`;
};

export const getAuthToken = () => localStorage.getItem('coderharbor_token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('coderharbor_token', token);
  else localStorage.removeItem('coderharbor_token');
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // If body is FormData, delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const authAPI = {
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),
};

export const publicAPI = {
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const query = searchParams.toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },
  getFeaturedProducts: () => apiRequest('/products/featured'),
  getProductBySlug: (slug) => apiRequest(`/products/${slug}`),
  getCategories: () => apiRequest('/categories'),
  getTechnologies: () => apiRequest('/technologies'),
  getSettings: () => apiRequest('/settings'),
};

export const aiAPI = {
  matchProject: (data) =>
    apiRequest('/ai/match-project', { method: 'POST', body: JSON.stringify(data) }),
  analyzeArchitecture: (slug) => apiRequest(`/ai/analyze-project/${slug}`),
  generateBlueprint: (data) =>
    apiRequest('/ai/generate-blueprint', { method: 'POST', body: JSON.stringify(data) }),
};

export const customerAPI = {
  getProfile: () => apiRequest('/customer/profile'),
  updateProfile: (data) =>
    apiRequest('/customer/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  getMyProjects: () => apiRequest('/customer/projects'),
  getMyOrders: () => apiRequest('/customer/orders'),
  getMyDownloads: () => apiRequest('/customer/downloads'),
  downloadFreeFile: async (fileId, filename) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/customer/downloads/${fileId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Download failed');
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export const supportAPI = {
  getTickets: () => apiRequest('/support/tickets'),
  getTicketById: (id) => apiRequest(`/support/tickets/${id}`),
  createTicket: (data) =>
    apiRequest('/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
  addMessage: (ticketId, message) =>
    apiRequest(`/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  updateStatus: (ticketId, status, priority) =>
    apiRequest(`/support/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, priority }),
    }),
};

export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => apiRequest(`/admin/products/${id}`),
  createProduct: (data) =>
    apiRequest('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    apiRequest(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (id) =>
    apiRequest(`/admin/products/${id}`, { method: 'DELETE' }),

  getCategories: () => apiRequest('/admin/categories'),
  createCategory: (data) =>
    apiRequest('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) =>
    apiRequest(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCategory: (id) =>
    apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }),

  getTechnologies: () => apiRequest('/admin/technologies'),
  createTechnology: (data) =>
    apiRequest('/admin/technologies', { method: 'POST', body: JSON.stringify(data) }),
  deleteTechnology: (id) =>
    apiRequest(`/admin/technologies/${id}`, { method: 'DELETE' }),

  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/customers${query ? `?${query}` : ''}`);
  },
  toggleCustomerStatus: (id, status) =>
    apiRequest(`/admin/customers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getOrders: () => apiRequest('/admin/orders'),
  getSettings: () => apiRequest('/admin/settings'),
  updateSetting: (key, value, description) =>
    apiRequest('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify({ key, value, description }),
    }),

  uploadImage: (formData) =>
    apiRequest('/admin/upload/image', { method: 'POST', body: formData }),
  uploadProjectFile: (formData) =>
    apiRequest('/admin/upload/project-file', { method: 'POST', body: formData }),
  importGithubRepo: (productId, githubUrl, backendGithubUrl = '', githubToken = '') =>
    apiRequest('/admin/upload/github-link', {
      method: 'POST',
      body: JSON.stringify({ productId, githubUrl, backendGithubUrl, githubToken }),
    }),
  rebuildPreview: (id) =>
    apiRequest(`/admin/products/${id}/preview/rebuild`, { method: 'POST' }),
  togglePreview: (id, enable) =>
    apiRequest(`/admin/products/${id}/preview/toggle`, { method: 'PATCH', body: JSON.stringify({ enable }) }),
  getPreviewLogs: (id) =>
    apiRequest(`/admin/products/${id}/preview/logs`),
};
