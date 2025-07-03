// src/api/devices.js
import api from './apiConfig';

// GET all devices
export const fetchDevices = () => api.get('/devices');

// POST new device
export const addDevice = (data) => api.post('/devices', data);

// ✅ PATCH (partial update) device instead of full PUT
export const updateDevice = (id, data) => api.patch(`/devices/${id}`, data);

// DELETE device
export const deleteDevice = (id) => api.delete(`/devices/${id}`);
