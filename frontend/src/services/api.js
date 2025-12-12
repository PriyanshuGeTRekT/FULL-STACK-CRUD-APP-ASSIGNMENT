import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Simple API wrapper
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getAnalytics = () => api.get('/users/analytics/regions');

export default api;
