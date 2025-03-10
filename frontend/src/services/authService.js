import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            
            // Armazenar o usuário com o token no localStorage
            if (response.data && response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            
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
    },

    recuperarSenha: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/auth/recuperar-senha`, { email });
            return response;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Erro ao solicitar recuperação de senha');
            }
            throw new Error('Erro de conexão ao servidor');
        }
    },

    redefinirSenha: async (token, newPassword) => {
        try {
            const response = await axios.post(`${API_URL}/auth/redefinir-senha`, { 
                token, 
                newPassword 
            });
            return response;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Erro ao redefinir senha');
            }
            throw new Error('Erro de conexão ao servidor');
        }
    },
    
    registro: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/registro`, {
                nome: userData.nome,
                email: userData.email,
                password: userData.password
            });
            return response;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.message || 'Erro ao criar conta');
            }
            throw new Error('Erro de conexão ao servidor');
        }
    },  // <-- Adicionada a vírgula aqui
    
    // Adicionar a função getToken
    getToken: () => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            return userData.token; // Retorna o token do objeto de usuário
        }
        return null;
    }
};

export default authService;