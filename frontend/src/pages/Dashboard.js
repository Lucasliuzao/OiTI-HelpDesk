import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ticketService from '../services/ticketService';
import StatCard from '../components/StatCard';

function Dashboard() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        closed: 0,
        highPriority: 0,
        recentTickets: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await ticketService.getAllTickets();
            
            const stats = {
                total: data.length,
                open: data.filter(t => t.status === 'open').length,
                closed: data.filter(t => t.status === 'closed').length,
                highPriority: data.filter(t => t.priority === 'high').length,
                recentTickets: data.slice(0, 5)
            };
            
            setStats(stats);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar dados do dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div style={{ 
            padding: '2rem',
            backgroundColor: theme.background,
            color: theme.text,
            minHeight: '100vh'
        }}>
            <h1 style={{ color: theme.text, marginBottom: '2rem' }}>Dashboard</h1>
            
            {/* Cards de estatísticas permanecem iguais */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem', 
                marginBottom: '2rem' 
            }}>
                <StatCard title="Total de Tickets" value={stats.total} color="#4CAF50" />
                <StatCard title="Tickets Abertos" value={stats.open} color="#2196F3" />
                <StatCard title="Tickets Fechados" value={stats.closed} color="#9E9E9E" />
                <StatCard title="Alta Prioridade" value={stats.highPriority} color="#F44336" />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ color: theme.text, marginBottom: '1rem' }}>Ações Rápidas</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={() => navigate('/create-ticket')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: theme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            hover: {
                                backgroundColor: theme.primaryDark
                            }
                        }}
                    >
                        Criar Novo Ticket
                    </button>
                    <button 
                        onClick={() => navigate('/tickets')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: theme.secondary || '#666',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Ver Todos os Tickets
                    </button>
                </div>
            </div>

            <div>
                <h2 style={{ color: theme.text, marginBottom: '1rem' }}>Tickets Recentes</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {stats.recentTickets.map(ticket => (
                        <div 
                            key={ticket._id}
                            onClick={() => navigate(`/tickets/${ticket._id}`)}
                            style={{
                                padding: '1rem',
                                backgroundColor: theme.cardBackground,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: `1px solid ${theme.border}`,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                }
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, color: theme.text }}>{ticket.title}</h3>
                                <span style={{ color: theme.textSecondary }}>
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div style={{ 
                                marginTop: '0.5rem', 
                                color: theme.textSecondary,
                                display: 'flex',
                                gap: '1rem'
                            }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: ticket.status === 'open' ? '#1976d20f' : '#9e9e9e1f',
                                    color: ticket.status === 'open' ? '#1976d2' : '#9e9e9e'
                                }}>
                                    {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
                                </span>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: 
                                        ticket.priority === 'high' ? '#f443361f' : 
                                        ticket.priority === 'medium' ? '#ff98001f' : '#4caf501f',
                                    color:
                                        ticket.priority === 'high' ? '#f44336' : 
                                        ticket.priority === 'medium' ? '#ff9800' : '#4caf50'
                                }}>
                                    {ticket.priority === 'high' ? 'Alta' : 
                                     ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
                                             