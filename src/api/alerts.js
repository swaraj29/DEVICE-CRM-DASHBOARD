// src/api/alerts.js
import api from './apiConfig';

export const fetchAlerts = () => api.get('/alerts');
export const addAlert = (data) => api.post('/alerts', data);
export const updateAlert = (id, data) => api.patch(`/alerts/${id}`, data);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);
