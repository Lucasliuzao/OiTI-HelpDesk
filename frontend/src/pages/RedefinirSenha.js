import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';

function RedefinirSenha() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [token, setToken] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        if (!tokenParam) {
            navigate('/login');
            return;
        }
        setToken(tokenParam);
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setStatus({
                type: 'error',
                message: 'As senhas não coincidem'
            });
            return;
        }

        setIsLoading(true);
        try {
            await authService.redefinirSenha(token, formData.password);
            setStatus({
                type: 'success',
                message: 'Senha redefinida com sucesso!'
            });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'Erro ao redefinir senha'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '1rem',
            backgroundColor: theme.background,
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                padding: '2rem',
                backgroundColor: theme.cardBackground,
                borderRadius: '8px',
                boxShadow: isDarkMode 
                    ? '0 4px 6px rgba(255, 255, 255, 0.1)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <h2 style={{
                    color: theme.text,
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                }}>Redefinir Senha</h2>

                {status.message && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        backgroundColor: status.type === 'success' 
                            ? isDarkMode ? 'rgba(40, 167, 69, 0.1)' : '#d4edda'
                            : isDarkMode ? 'rgba(220, 53, 69, 0.1)' : '#f8d7da',
                        color: status.type === 'success' ? '#28a745' : '#dc3545'
                    }}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: theme.text
                        }}>Nova Senha:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.cardBackground,
                                color: theme.text
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: theme.text
                        }}>Confirmar Senha:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.cardBackground,
                                color: theme.text
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: theme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoading ? 'wait' : 'pointer',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RedefinirSenha;