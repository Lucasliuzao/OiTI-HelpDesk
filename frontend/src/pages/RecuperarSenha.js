import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import authService from '../services/authService';

function RecuperarSenha() {
    const navigate = useNavigate();
    const { theme, isDarkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.recuperarSenha(email);
            setStatus({
                type: 'success',
                message: 'Se o e-mail existir em nossa base, você receberá as instruções para recuperação de senha.'
            });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Erro ao processar sua solicitação. Tente novamente.'
            });
        } finally {
            setIsLoading(false);
        }
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
                }}>Recuperar Senha</h2>

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
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: theme.text
                        }}>
                            Digite seu e-mail:
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            opacity: isLoading ? 0.7 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isLoading ? 'Enviando...' : 'Enviar'}
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'transparent',
                            color: theme.primary,
                            border: 'none',
                            marginTop: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        Voltar para o login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RecuperarSenha;