import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data?.message || 'Erro ao fazer login';
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        window.location.replace('/login');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default authService;