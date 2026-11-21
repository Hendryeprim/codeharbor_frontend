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

export const getFullPreviewUrl = (url) => {
  if (!url || typeof url !== 'string') return '';

  // If already an absolute URL:
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // In production on live domain, ensure preview requests ALWAYS target api.coderharbor.com
    // so they never hit the CodeHarbor frontend SPA fallback!
    if (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      if (url.includes('coderharbor.com') && !url.includes('api.coderharbor.com')) {
        return url.replace('//coderharbor.com', '//api.coderharbor.com');
      }
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return url.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, 'https://api.coderharbor.com');
      }
    }
    return url;
  }

  // If relative path (e.g. /previews/..., /api/preview/..., /api/proxy/...)
  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  // In production (live domain coderharbor.com), MUST route directly to BACKEND (https://api.coderharbor.com)
  // so the iframe NEVER falls through to CodeHarbor's Nginx / React Router SPA fallback!
  if (typeof window !== 'undefined' && window.location.hostname && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return `https://api.coderharbor.com${cleanPath}`;
  }

  // In local development, route to backend (or current API base)
  const apiBase = getApiBaseUrl().replace(/\/api\/?$/, '');
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
  getDashboard: () => apiRequest('/admin/marketplace-dashboard'),
  getMarketplaceDashboard: () => apiRequest('/admin/marketplace-dashboard'),
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

export const adminPortalAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),
  getEmployees: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/employees${query ? `?${query}` : ''}`);
  },
  createEmployee: (data) =>
    apiRequest('/admin/employees', { method: 'POST', body: JSON.stringify(data) }),
  getEmployeeById: (id) => apiRequest(`/admin/employees/${id}`),
  updateEmployee: (id, data) =>
    apiRequest(`/admin/employees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  toggleEmployeeStatus: (id) =>
    apiRequest(`/admin/employees/${id}/status`, { method: 'PATCH' }),
  getEmployeePerformance: () => apiRequest('/admin/employees/performance'),
  getEmployeeSkills: () => apiRequest('/admin/employees/skills'),

  getProjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/managed-projects${query ? `?${query}` : ''}`);
  },
  createProject: (data) =>
    apiRequest('/admin/managed-projects', { method: 'POST', body: JSON.stringify(data) }),
  getProjectById: (id) => apiRequest(`/admin/managed-projects/${id}`),
  updateProject: (id, data) =>
    apiRequest(`/admin/managed-projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id) =>
    apiRequest(`/admin/managed-projects/${id}`, { method: 'DELETE' }),

  getReviews: () => apiRequest('/admin/project-reviews'),
  getReviewById: (submissionId) => apiRequest(`/admin/project-reviews/${submissionId}`),
  runExecution: (versionId) =>
    apiRequest(`/admin/project-reviews/${versionId}/run`, { method: 'POST' }),
  stopExecution: (versionId) =>
    apiRequest(`/admin/project-reviews/${versionId}/stop`, { method: 'POST' }),
  submitFeedback: (submissionId, data) =>
    apiRequest(`/admin/project-reviews/${submissionId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/tasks${query ? `?${query}` : ''}`);
  },
  createTask: (data) =>
    apiRequest('/admin/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) =>
    apiRequest(`/admin/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id) =>
    apiRequest(`/admin/tasks/${id}`, { method: 'DELETE' }),

  getExecutions: () => apiRequest('/admin/executions'),
  getExecutionById: (id) => apiRequest(`/admin/executions/${id}`),
  getProjectExecution: (versionId) => apiRequest(`/admin/project-reviews/${versionId}/execution`),
  rerunExecution: (versionId) => apiRequest(`/admin/project-reviews/${versionId}/run`, { method: 'POST' }),

  getNotifications: () => apiRequest('/admin/notifications'),
  markNotificationRead: (id) =>
    apiRequest(`/admin/notifications/${id}/read`, { method: 'PATCH' }),
  getAuditLogs: () => apiRequest('/admin/audit-logs'),
};

export const employeeAPI = {
  getDashboard: () => apiRequest('/employee/dashboard'),
  getProjects: (status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiRequest(`/employee/projects${query}`);
  },
  getProjectById: (id) => apiRequest(`/employee/projects/${id}`),
  deleteProject: (id) => apiRequest(`/employee/projects/${id}`, { method: 'DELETE' }),
  startProject: (id) => apiRequest(`/employee/projects/${id}/start`, { method: 'PATCH' }),
  updateProgress: (id, data) =>
    apiRequest(`/employee/projects/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  uploadSubmission: (id, formData) =>
    apiRequest(`/employee/projects/${id}/upload`, {
      method: 'POST',
      body: formData,
    }),
  uploadDirectProject: (formData) =>
    apiRequest('/employee/projects/upload', {
      method: 'POST',
      body: formData,
    }),

  getTasks: () => apiRequest('/employee/tasks'),
  updateTaskStatus: (id, status) =>
    apiRequest(`/employee/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getSubmissions: () => apiRequest('/employee/submissions'),
  deleteSubmission: (submissionId) => apiRequest(`/employee/submissions/${submissionId}`, { method: 'DELETE' }),
  getSubmissionExecution: (versionId) => apiRequest(`/employee/submissions/${versionId}/execution`),
  rerunSubmissionExecution: (versionId) => apiRequest(`/employee/submissions/${versionId}/run`, { method: 'POST' }),
  getNotifications: () => apiRequest('/employee/notifications'),
  markNotificationRead: (id) =>
    apiRequest(`/employee/notifications/${id}/read`, { method: 'PATCH' }),

  getProfile: () => apiRequest('/employee/profile'),
  updateProfile: (data) =>
    apiRequest('/employee/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// ─── SKILL-BASED CURRICULUM & TASK APIs ───────────────────────────────────────
export const employeeCurriculumAPI = {
  getMySkills: () => apiRequest('/employee/curriculum/skills'),
  getSkillTasks: (skillSlug, level) =>
    apiRequest(`/employee/curriculum/skills/${skillSlug}/tasks?level=${encodeURIComponent(level || 'BASIC')}`),
  getTaskDetails: (taskId) => apiRequest(`/employee/curriculum/tasks/${taskId}`),
  runCode: (taskId, data) =>
    apiRequest(`/employee/curriculum/tasks/${taskId}/run`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submitTask: (taskId, data) =>
    apiRequest(`/employee/curriculum/tasks/${taskId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const adminCurriculumAPI = {
  getSkills: () => apiRequest('/admin/curriculum/skills'),
  createSkill: (data) =>
    apiRequest('/admin/curriculum/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getTasks: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/admin/curriculum/tasks${q ? `?${q}` : ''}`);
  },
  createTask: (data) =>
    apiRequest('/admin/curriculum/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (taskId, data) =>
    apiRequest(`/admin/curriculum/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTask: (taskId) =>
    apiRequest(`/admin/curriculum/tasks/${taskId}`, {
      method: 'DELETE',
    }),
  assignSkills: (employeeProfileId, skillIds) =>
    apiRequest(`/admin/curriculum/employees/${employeeProfileId}/skills`, {
      method: 'POST',
      body: JSON.stringify({ skillIds }),
    }),
  getSubmissions: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiRequest(`/admin/curriculum/submissions${q ? `?${q}` : ''}`);
  },
  runSubmissionCode: (submissionId) =>
    apiRequest(`/admin/curriculum/submissions/${submissionId}/run`, {
      method: 'POST',
    }),
  reviewSubmission: (submissionId, data) =>
    apiRequest(`/admin/curriculum/submissions/${submissionId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getProgressMatrix: () => apiRequest('/admin/curriculum/progress-matrix'),
  getStats: () => apiRequest('/admin/curriculum/stats'),
};




