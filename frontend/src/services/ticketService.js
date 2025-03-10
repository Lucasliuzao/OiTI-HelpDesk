import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/tickets';

// Função para criar uma instância do axios com o token de autenticação
const getAuthAxios = () => {
    const token = authService.getToken();
    return axios.create({
        headers: {
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
};

const ticketService = {
    getAllTickets: async () => {
        try {
            const axiosAuth = getAuthAxios();
            const response = await axiosAuth.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw new Error(error.response?.data?.message || 'Erro ao buscar tickets');
        }
    },

    getTicketById: async (id) => {
        try {
            console.log('Iniciando requisição para obter ticket com ID:', id);
            const token = authService.getToken();
            console.log('Token usado:', token);
            
            const response = await axios.get(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Resposta da API:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro detalhado ao buscar ticket:', error);
            if (error.response) {
                console.error('Resposta do servidor:', error.response.data);
                console.error('Status do erro:', error.response.status);
            }
            throw new Error(`Erro ${error.response?.status || ''}: ${error.response?.data?.message || error.message}`);
        }
    },

    createTicket: async (ticketData) => {
        try {
            const axiosAuth = getAuthAxios();
            console.log('Token usado:', authService.getToken()); // Para depuração
            console.log('Dados enviados para criação:', ticketData); // Mostrar dados enviados
            
            const response = await axiosAuth.post(API_URL, ticketData);
            return response.data;
        } catch (error) {
            console.error('Erro detalhado ao criar ticket:', error);
            console.error('Resposta do servidor:', error.response?.data);
            console.error('Status do erro:', error.response?.status);
            
            // Mensagem de erro mais informativa
            if (error.response) {
                throw new Error(`Erro ${error.response.status}: ${error.response.data?.message || 'Erro ao criar ticket'}`);
            } else if (error.request) {
                throw new Error('Servidor não respondeu. Verifique sua conexão.');
            } else {
                throw new Error('Erro ao criar ticket: ' + error.message);
            }
        }
    },

    updateTicket: async (id, ticketData) => {
        try {
            const axiosAuth = getAuthAxios();
            const response = await axiosAuth.put(`${API_URL}/${id}`, ticketData);
            return response.data;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw new Error(error.response?.data?.message || 'Erro ao atualizar ticket');
        }
    },

    deleteTicket: async (id) => {
        try {
            const axiosAuth = getAuthAxios();
            const response = await axiosAuth.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw new Error(error.response?.data?.message || 'Erro ao excluir ticket');
        }
    }
};

export default ticketService;