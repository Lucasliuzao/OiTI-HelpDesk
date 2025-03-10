import api from './api';

const notificationService = {
    // Obter todas as notificações do usuário
    getUserNotifications: async () => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
            throw error;
        }
    },
    
    // Marcar notificação como lida
    markAsRead: async (notificationId) => {
        try {
            const response = await api.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
            throw error;
        }
    },
    
    // Marcar todas as notificações como lidas
    markAllAsRead: async () => {
        try {
            const response = await api.put('/notifications/read-all');
            return response.data;
        } catch (error) {
            console.error('Erro ao marcar todas notificações como lidas:', error);
            throw error;
        }
    },
    
    // Excluir uma notificação
    deleteNotification: async (notificationId) => {
        try {
            const response = await api.delete(`/notifications/${notificationId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir notificação:', error);
            throw error;
        }
    }
};

export default notificationService;