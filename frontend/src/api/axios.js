import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/E-comerce/backend/api/', // trailing slash avoids redirect responses
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token from localStorage on startup (if present)
const token = localStorage.getItem('token');
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
