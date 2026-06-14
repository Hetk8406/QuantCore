export const API_BASE_URL = `http://${window.location.hostname}:8000`;
// Fallback if hostname is localhost/127.0.0.1 on phone
export const getApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
