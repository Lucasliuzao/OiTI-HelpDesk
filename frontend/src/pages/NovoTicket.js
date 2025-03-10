import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ticketService from '../services/ticketService';
import authService from '../services/authService';

function NovoTicket() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        categoria: 'Hardware',
        prioridade: 'Média',
        status: 'Aberto'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categorias = [
        'Hardware',
        'Software',
        'Rede',
        'Email',
        'Impressora',
        'Acesso',
        'Outro'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // No método handleSubmit
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Mapear os valores de prioridade para minúsculas
            const priorityMap = {
                'Baixa': 'low',
                'Média': 'medium',
                'Alta': 'high'
            };
            
            // Converter os nomes dos campos para o formato esperado pelo backend
            const ticketData = {
                title: formData.titulo,
                description: formData.descricao,
                category: formData.categoria,
                priority: priorityMap[formData.prioridade] || 'medium', // Converter para minúsculas
                status: formData.status.toLowerCase() // Também converter status para minúsculas
            };
            
            console.log('Enviando formulário formatado:', ticketData);
            
            await ticketService.createTicket(ticketData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            setError(error.message || 'Erro ao criar ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.background,
            color: theme.text,
            transition: 'all 0.3s ease'
        }}>
            <nav style={{
                padding: '1rem',
                backgroundColor: theme.cardBackground,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                        backgroundColor: theme.primary,
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}>
                        OiTI
                    </span>
                    <h2 style={{ margin: 0 }}>Central de Suporte</h2>
                </div>
                <div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '4px',
                            color: theme.text,
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Voltar
                    </button>
                    <button
                        onClick={() => authService.logout()}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'transparent',
                            border: `1px solid ${theme.border}`,
                            borderRadius: '4px',
                            color: theme.text,
                            cursor: 'pointer'
                        }}
                    >
                        Sair
                    </button>
                </div>
            </nav>

            <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '2rem' }}>Novo Ticket</h1>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        backgroundColor: '#f8d7da',
                        color: '#dc3545'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold'
                        }}>
                            Título *
                        </label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
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
                            fontWeight: 'bold'
                        }}>
                            Categoria *
                        </label>
                        <select
                            name="categoria"
                            value={formData.categoria}
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
                        >
                            {categorias.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold'
                        }}>
                            Prioridade
                        </label>
                        <select
                            name="prioridade"
                            value={formData.prioridade}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.cardBackground,
                                color: theme.text
                            }}
                        >
                            <option value="Baixa">Baixa</option>
                            <option value="Média">Média</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold'
                        }}>
                            Descrição *
                        </label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            required
                            rows={6}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                backgroundColor: theme.cardBackground,
                                color: theme.text,
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'transparent',
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                color: theme.text,
                                cursor: 'pointer'
                            }}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: theme.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar Ticket'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default NovoTicket;