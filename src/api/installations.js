import api from './apiConfig';

export const fetchInstallations = () => api.get('/installations');
export const addInstallation = (data) => api.post('/installations', data);
