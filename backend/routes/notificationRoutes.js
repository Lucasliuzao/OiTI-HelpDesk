const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Obter todas as notificações do usuário
router.get('/', auth, notificationController.getUserNotifications);

// Marcar notificação como lida
router.put('/:id/read', auth, notificationController.markAsRead);

// Marcar todas as notificações como lidas
router.put('/read-all', auth, notificationController.markAllAsRead);

// Excluir uma notificação
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;