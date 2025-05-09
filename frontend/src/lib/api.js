const API_BASE_URL = `http://localhost:5000/api`;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials) => request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    signup: (userData) => request('/users/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    getProfile: () => request('/users/profile'),
    forgotPassword: (email) => request('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
    resetPassword: (token, password) => request('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  },
  portfolios: {
    create: (data) => request('/portfolios', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: () => request('/portfolios'),
    getById: (id) => request(`/portfolios/${id}`),
    update: (id, data) => request(`/portfolios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id) => request(`/portfolios/${id}`, {
      method: 'DELETE',
    }),
    getBySlug: (slug) => request(`/portfolios/public/${slug}`),
  },
  admin: {
    getAllUsers: () => request('/admin/users', {
      method: 'GET',
    }),
  },
};