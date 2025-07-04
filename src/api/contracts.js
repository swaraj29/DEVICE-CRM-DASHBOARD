// src/api/contracts.js
import api from './apiConfig';

export const fetchContracts = () => api.get('/contracts');
