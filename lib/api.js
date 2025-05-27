const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const getApiUrl = (endpoint) => {
  return `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export default {
  devices: {
    getAll: () => getApiUrl('devices'),
    sync: (deviceId) => getApiUrl(`devices/${deviceId}/sync`),
  },
  errors: {
    getAll: () => getApiUrl('errors'),
  },
  refresh: () => getApiUrl('refresh'),
};