import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const TicketCard = ({ ticket, onClick }) => {
    const { theme } = useTheme();
    
    const statusColors = {
        open: '#17a2b8',    // azul para aberto
        closed: '#6c757d'   // cinza para fechado
    };

    const priorityColors = {
        high: '#dc3545',    // vermelho para alta
        medium: '#ffc107',  // amarelo para média
        low: '#28a745'      // verde para baixa
    };

    return (
        <div 
            onClick={onClick}
            style={{ 
                cursor: 'pointer',
                backgroundColor: theme.cardBackground,
                padding: '1rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '1rem'
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
                    {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
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
                    Prioridade: {
                        ticket.priority === 'high' ? 'Alta' : 
                        ticket.priority === 'medium' ? 'Média' : 'Baixa'
                    }
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
};

export default TicketCard;