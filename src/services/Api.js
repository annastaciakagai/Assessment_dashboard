import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

export const login = async (email, password) => {
  const response = await axiosClient.post('/auth/login', { email, password });
  const data = response?.data || {};
  return data.token || data.accessToken || (data.data && data.data.token) || '';
};

export const fetchOpportunities = async (token) => {
  const response = await axiosClient.get('/opportunities', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};