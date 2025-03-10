import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ticketService from '../services/ticketService';

function TicketDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                console.log('Fetching ticket with ID:', id);
                const data = await ticketService.getTicketById(id);
                console.log('Ticket data received:', data);
                setTicket(data);
            } catch (err) {
                console.error('Error fetching ticket:', err);
                setError('Não foi possível carregar os detalhes do ticket');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh',
                backgroundColor: theme.background,
                color: theme.text,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Carregando...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                minHeight: '100vh',
                backgroundColor: theme.background,
                color: theme.text,
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <h2>{error}</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: theme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Voltar para Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div style={{ 
                minHeight: '100vh',
                backgroundColor: theme.background,
                color: theme.text,
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    textAlign: 'center'
                }}>
                    <h2>Ticket não encontrado</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: theme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Voltar para Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.background,
            color: theme.text,
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: theme.cardBackground,
                borderRadius: '8px',
                padding: '2rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '2rem' 
                }}>
                    <h1 style={{ margin: 0 }}>{ticket.title}</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: theme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Voltar
                    </button>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3>Detalhes do Ticket</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <strong>Status:</strong> {ticket.status}
                        </div>
                        <div>
                            <strong>Categoria:</strong> {ticket.category}
                        </div>
                        <div>
                            <strong>Prioridade:</strong> {ticket.priority}
                        </div>
                        <div>
                            <strong>Criado em:</strong> {new Date(ticket.createdAt).toLocaleString()}
                        </div>
                        <div>
                            <strong>Última atualização:</strong> {new Date(ticket.updatedAt).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div>
                    <h3>Descrição</h3>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                </div>
            </div>
        </div>
    );
}

export default TicketDetails;