// src/api/alerts.js
import api from './apiConfig';

export const fetchAlerts = () => api.get('/alerts');
export const addAlert = (data) => api.post('/alerts', data);
