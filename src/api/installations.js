import api from './apiConfig';

export const fetchInstallations = () => api.get('/installations');
export const addInstallation = (data) => api.post('/installations', data);
export const updateInstallation = (id, data) => api.patch(`/installations/${id}`, data); // ✅ PATCH instead of PUT
export const deleteInstallation = (id) => api.delete(`/installations/${id}`);
