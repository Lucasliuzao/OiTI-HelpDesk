import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';

function Registro() {
    const navigate = useNavigate();
    const { theme, isDarkMode } = useTheme();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

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
            await authService.registro(formData);
            setStatus({
                type: 'success',
                message: 'Conta criada com sucesso! Redirecionando para o login...'
            });
            setTimeout(() => {
                localStorage.setItem('loginMessage', 'Registro realizado com sucesso! Faça login para continuar.');
                navigate('/login');
            }, 2000);
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.message || 'Erro ao criar conta'
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
                maxWidth: '450px',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        input:focus {
                            outline: none;
                            border-color: ${theme.primary} !important;
                            box-shadow: 0 0 0 2px ${theme.primary}33;
                        }
                    `}
                </style>
                
                <h2 style={{
                    color: theme.text,
                    textAlign: 'center',
                    marginBottom: '1.5rem'
                }}>Criar Conta</h2>

                {status.message && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        backgroundColor: status.type === 'success' 
                            ? isDarkMode ? 'rgba(40, 167, 69, 0.1)' : '#d4edda'
                            : isDarkMode ? 'rgba(220, 53, 69, 0.1)' : '#f8d7da',
                        color: status.type === 'success' ? '#28a745' : '#dc3545',
                        transition: 'all 0.3s ease'
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
                        }}>Nome:</label>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.cardBackground,
                                color: theme.text,
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: theme.text
                        }}>E-mail:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.cardBackground,
                                color: theme.text,
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: theme.text
                        }}>Senha:</label>
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
                                color: theme.text,
                                transition: 'all 0.3s ease'
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
                                color: theme.text,
                                transition: 'all 0.3s ease'
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
                            opacity: isLoading ? 0.7 : 1,
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = theme.primaryHover;
                            e.target.style.transform = 'scale(1.02)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = theme.primary;
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        {isLoading ? 'Criando conta...' : 'Criar Conta'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <a
                            href="/login"
                            style={{
                                color: theme.primary,
                                textDecoration: 'none',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.color = theme.primaryHover}
                            onMouseOut={(e) => e.target.style.color = theme.primary}
                        >
                            Já tem uma conta? Faça login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registro;