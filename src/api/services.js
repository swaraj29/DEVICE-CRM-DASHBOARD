// src/api/services.js
import api from './apiConfig';

export const fetchServices = () => api.get('/services');
export const addService = (data) => api.post('/services', data);
