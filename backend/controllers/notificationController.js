const Notification = require('../models/Notification');

// Criar uma nova notificação
exports.createNotification = async (userId, title, message, type = 'info', relatedTo = 'system', relatedId = null) => {
    try {
        const notification = new Notification({
            user: userId,
            title,
            message,
            type,
            relatedTo,
            relatedId,
            read: false,
            createdAt: new Date()
        });
        
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Erro ao criar notificação:', error);
        throw error;
    }
};

// Obter todas as notificações do usuário
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 });
        
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        res.status(500).json({ message: 'Erro ao buscar notificações', error: error.message });
    }
};

// Marcar notificação como lida
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }
        
        res.status(200).json(notification);
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        res.status(500).json({ message: 'Erro ao marcar notificação como lida', error: error.message });
    }
};

// Marcar todas as notificações como lidas
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, read: false },
            { read: true }
        );
        
        res.status(200).json({ message: 'Todas as notificações foram marcadas como lidas' });
    } catch (error) {
        console.error('Erro ao marcar todas notificações como lidas:', error);
        res.status(500).json({ message: 'Erro ao marcar todas notificações como lidas', error: error.message });
    }
};

// Excluir uma notificação
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });
        
        if (!notification) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }
        
        res.status(200).json({ message: 'Notificação excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir notificação:', error);
        res.status(500).json({ message: 'Erro ao excluir notificação', error: error.message });
    }
};