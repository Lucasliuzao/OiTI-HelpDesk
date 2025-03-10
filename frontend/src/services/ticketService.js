import api from './api';

const ticketService = {
    getAllTickets: async () => {
        try {
            const response = await api.get('/tickets');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    getTicketById: async (id) => {
        try {
            console.log('Fetching ticket with ID:', id);
            const response = await api.get(`/tickets/${id}`);
            console.log('Ticket data received:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching ticket:', error.response || error);
            throw error;
        }
    },
    
    createTicket: async (ticketData) => {
        try {
            const response = await api.post('/tickets', ticketData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    updateTicket: async (id, updateData) => {
        try {
            const response = await api.put(`/tickets/${id}`, updateData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    deleteTicket: async (id) => {
        try {
            const response = await api.delete(`/tickets/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    // Novo método para adicionar comentários a um ticket
    addComment: async (ticketId, commentData) => {
        try {
            const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    // Novo método para obter comentários de um ticket
    getComments: async (ticketId) => {
        try {
            const response = await api.get(`/tickets/${ticketId}/comments`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    // Novo método para atualizar o status de um ticket
    updateStatus: async (ticketId, status) => {
        try {
            console.log(`Atualizando ticket ${ticketId} para status ${status}`);
            // Usar PUT em vez de PATCH
            const response = await api.put(`/tickets/${ticketId}`, { status });
            console.log('Resposta da atualização de status:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar status do ticket:', error.response || error);
            throw error;
        }
    },
    
    // Novo método para atualizar a prioridade de um ticket
    updatePriority: async (ticketId, priority) => {
        try {
            console.log(`Atualizando ticket ${ticketId} para prioridade ${priority}`);
            // Usar PUT em vez de PATCH
            const response = await api.put(`/tickets/${ticketId}`, { priority });
            console.log('Resposta da atualização de prioridade:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar prioridade do ticket:', error.response || error);
            throw error;
        }
    },
    
    // Removidos os métodos relacionados a filas
};

export default ticketService;