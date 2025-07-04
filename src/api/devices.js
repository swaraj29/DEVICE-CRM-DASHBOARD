// src/api/devices.js
import api from './apiConfig';

// GET all devices
export const fetchDevices = () => api.get('/devices');

// ✅ PATCH (partial update) device instead of full PUT
export const updateDevice = (id, data) => api.patch(`/devices/${id}`, data);
