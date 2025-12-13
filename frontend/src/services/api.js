import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Keeping our API calls tidy.
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getAnalytics = () => api.get('/users/analytics/regions');
export const notifyUser = (id, data) => api.post(`/users/${id}/notify`, data);

export default api;
