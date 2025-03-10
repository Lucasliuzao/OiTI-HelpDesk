import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    console.log('User from localStorage:', user);
    if (user) {
      const userData = JSON.parse(user);
      console.log('Parsed user data:', userData);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
        console.log('Authorization header set:', config.headers.Authorization);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;