import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Policy API
export const policyAPI = {
  uploadPolicy: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getReport: async (policyId) => {
    const response = await api.get(`/${policyId}/report`);
    return response.data;
  },

  getStatus: async (policyId) => {
    const response = await api.get(`/${policyId}/status`);
    return response.data;
  }
};

export const authAPI = {
  // Mocked for compatibility
  getCurrentUser: async () => {
    return { user_id: '0000', email: 'demo@example.com', full_name: 'Demo User', role: 'ADMIN' };
  }
};

export default api;
