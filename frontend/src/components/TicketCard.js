import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

function TicketCard({ ticket }) {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const priorityColors = {
        low: '#28a745',
        medium: '#ffc107',
        high: '#dc3545'
    };

    const statusColors = {
        open: '#17a2b8',
        closed: '#6c757d'
    };

    return (
        <div
            onClick={() => navigate(`/ticket/${ticket._id}`)}
            style={{
                backgroundColor: theme.cardBackground,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: theme.text }}>{ticket.title}</h3>
                <span style={{
                    backgroundColor: statusColors[ticket.status] || '#6c757d',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem'
                }}>
                    {ticket.status}
                </span>
            </div>

            <div style={{ marginBottom: '0.5rem', color: theme.textSecondary }}>
                <span style={{ marginRight: '1rem' }}>
                    Categoria: {ticket.category}
                </span>
                <span style={{
                    color: priorityColors[ticket.priority] || '#6c757d',
                    fontWeight: 'bold'
                }}>
                    Prioridade: {ticket.priority}
                </span>
            </div>

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                color: theme.textSecondary, 
                fontSize: '0.875rem' 
            }}>
                <span>Criado em: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                <span>Última atualização: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}

export default TicketCard;