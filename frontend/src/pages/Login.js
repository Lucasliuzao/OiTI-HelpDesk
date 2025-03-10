import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { theme, isDarkMode, toggleTheme } = useTheme();
    
    useEffect(() => {
        const loginMessage = localStorage.getItem('loginMessage');
        if (loginMessage) {
            setMessage(loginMessage);
            localStorage.removeItem('loginMessage');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login(formData);
            if (response && response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.href = '/dashboard';
            }
        } catch (error) {
            setError(error.message || 'Erro ao fazer login');
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
                padding: window.innerWidth < 480 ? '1.5rem' : '2rem',
                backgroundColor: theme.cardBackground,
                borderRadius: '8px',
                boxShadow: isDarkMode 
                    ? '0 4px 6px rgba(255, 255, 255, 0.1)' 
                    : '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                animation: 'fadeIn 0.5s ease-out'
            }}>
                <style>
                    {`
                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        @keyframes shake {
                            0%, 100% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            75% { transform: translateX(5px); }
                        }
                        input:focus {
                            outline: none;
                            border-color: ${theme.primary} !important;
                            box-shadow: 0 0 0 2px ${theme.primary}33;
                        }
                        button:active {
                            transform: scale(0.98);
                        }
                    `}
                </style>
                <h1 style={{ 
                    textAlign: 'center', 
                    color: theme.text, 
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                }}>
                    <span style={{ 
                        backgroundColor: theme.primary,
                        color: 'white',
                        width: '45px',
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease'
                    }}>OiTI</span>
                    Central de Suporte
                </h1>
                {message && <div style={{ 
                    color: theme.primary,
                    backgroundColor: isDarkMode ? 'rgba(0, 102, 204, 0.1)' : '#e6f2ff',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    transition: 'all 0.3s ease'
                }}>{message}</div>}
                {error && <div style={{ 
                    color: '#dc3545',
                    backgroundColor: isDarkMode ? 'rgba(220, 53, 69, 0.1)' : '#f8d7da',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    transition: 'all 0.3s ease',
                    animation: 'shake 0.5s ease-in-out'
                }}>{error}</div>}
                <form onSubmit={handleSubmit} style={{
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem', 
                            color: theme.text,
                            transition: 'color 0.3s ease'
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
                                fontSize: '1rem',
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
                            color: theme.text,
                            transition: 'color 0.3s ease'
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
                                fontSize: '1rem',
                                backgroundColor: theme.cardBackground,
                                color: theme.text,
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <button 
                        type="submit"
                        style={{
                            width: '100%',
                            padding: window.innerWidth < 480 ? '0.6rem' : '0.75rem',
                            backgroundColor: theme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: window.innerWidth < 480 ? '0.9rem' : '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
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
                        Entrar
                    </button>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '1rem',
                        fontSize: '0.9rem'
                    }}>
                        <a
                            href="/recuperar-senha"
                            style={{
                                color: theme.primary,
                                textDecoration: 'none',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.color = theme.primaryHover}
                            onMouseOut={(e) => e.target.style.color = theme.primary}
                        >
                            Esqueceu a senha?
                        </a>
                        <a
                            href="/registro"
                            style={{
                                color: theme.primary,
                                textDecoration: 'none',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.color = theme.primaryHover}
                            onMouseOut={(e) => e.target.style.color = theme.primary}
                        >
                            Criar conta
                        </a>
                    </div>
                </form>
                {/* Botão de tema com animação */}
                <button
                    onClick={toggleTheme}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: theme.text,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: 'rotate(0deg)'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'rotate(180deg)'}
                    onMouseOut={(e) => e.target.style.transform = 'rotate(0deg)'}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>
        </div>
    );
}

export default Login;