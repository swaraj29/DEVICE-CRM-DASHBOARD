// src/api/services.js
import api from './apiConfig';

export const fetchServices = () => api.get('/services');
export const addService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
