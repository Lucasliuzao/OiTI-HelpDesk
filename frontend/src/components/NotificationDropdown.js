import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash } from 'react-feather';
import notificationService from '../services/notificationService';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Buscar notificações ao carregar o componente
    useEffect(() => {
        fetchNotifications();
        
        // Atualizar notificações a cada 30 segundos
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getUserNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n => 
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Erro ao marcar todas notificações como lidas:', error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            const updatedNotifications = notifications.filter(n => n._id !== id);
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.filter(n => !n.read).length);
        } catch (error) {
            console.error('Erro ao excluir notificação:', error);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                onClick={toggleDropdown}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-semibold dark:text-white">Notificações</h3>
                        {unreadCount > 0 && (
                            <button 
                                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                onClick={handleMarkAllAsRead}
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                Carregando notificações...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                Nenhuma notificação encontrada
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification._id} 
                                    className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <h4 className="font-medium dark:text-white">{notification.title}</h4>
                                        <div className="flex space-x-2">
                                            {!notification.read && (
                                                <button 
                                                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    title="Marcar como lida"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button 
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                onClick={() => handleDeleteNotification(notification._id)}
                                                title="Excluir notificação"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;