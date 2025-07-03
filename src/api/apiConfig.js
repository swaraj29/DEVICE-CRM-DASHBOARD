// src/api/apiConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://device-crm-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
