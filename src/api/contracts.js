// src/api/contracts.js
import api from './apiConfig';

export const fetchContracts = () => api.get('/contracts');
export const addContract = (data) => api.post('/contracts', data);
export const updateContract = (id, data) => api.put(`/contracts/${id}`, data);
export const deleteContract = (id) => api.delete(`/contracts/${id}`);
