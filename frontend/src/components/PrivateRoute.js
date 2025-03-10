import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    
    useEffect(() => {
        if (!user) {
            // Armazenar a mensagem no localStorage para exibir na página de login
            localStorage.setItem('loginMessage', 'Por favor, faça login para acessar esta página');
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;