import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ticketService from '../services/ticketService';
import authService from '../services/authService';

// Add the useAuth import if it's not already there
import { useAuth } from '../contexts/AuthContext';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Add this line to get the user from auth context
    const { user } = useAuth();
    const { theme } = useTheme(); // Adicione esta linha para obter o tema atual
    
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    // Remove or comment out this line if it exists
    const [user, setUser] = useState(null); // substituir ticketUser por user
    
    // Remover a variável não utilizada 'ticketUser'

    // Estilos comuns para reutilização
    const styles = {
        button: {
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.border}`,
            borderRadius: '4px',
            color: theme.text,
            cursor: 'pointer'
        },
        card: {
            backgroundColor: theme.cardBackground,
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '1rem'
        },
        primaryButton: {
            padding: '0.5rem 1rem',
            backgroundColor: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
        }
    };

    // Buscar detalhes do ticket
    const fetchTicketDetails = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Attempting to fetch ticket with ID:', id);
            const data = await ticketService.getTicketById(id);
            console.log('Ticket data received in component:', data);
            setTicket(data);
            
            // Check if we need to fetch comments separately or if they're included in the ticket data
            if (data.comments) {
                console.log('Comments included in ticket data:', data.comments);
                setComments(data.comments);
            } else {
                console.log('Fetching comments separately');
                try {
                    const commentsData = await ticketService.getComments(id);
                    console.log('Comments received:', commentsData);
                    setComments(commentsData || []);
                } catch (commentsError) {
                    console.error('Error fetching comments:', commentsError);
                    // Don't fail the whole component if just comments fail
                    setComments([]);
                }
            }
            
            // Obter informações do usuário atual
            const userData = authService.getCurrentUser();
        } catch (err) {
            console.error('Error in fetchTicketDetails:', err);
            setError('Erro ao carregar detalhes do ticket: ' + (err.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTicketDetails();
    }, [fetchTicketDetails]);

    // Função para adicionar um comentário
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await ticketService.addComment(id, { text: newComment });
            setNewComment('');
            fetchTicketDetails();
        } catch (err) {
            console.error('Erro completo:', err);
            setError('Erro ao adicionar comentário');
        }
    };

    // Função para atualizar o status do ticket
    const handleStatusChange = async (newStatus) => {
        try {
            // Don't call useAuth() here, use the user variable from above
            // Replace this line:
            // const { user } = useAuth();
            
            // With something like:
            console.log(`User ${user.name} changing ticket status to ${newStatus}`);
            
            await ticketService.updateStatus(id, newStatus);
            setTicket(prev => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };

    // Função para atualizar a prioridade do ticket
    const handlePriorityChange = async (newPriority) => {
        try {
            await ticketService.updatePriority(id, newPriority);
            setTicket({ ...ticket, priority: newPriority });
        } catch (err) {
            setError('Erro ao atualizar prioridade do ticket');
            console.error(err);
        }
    };

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
                Carregando detalhes do ticket...
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
                    padding: '1rem',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={styles.button}
                >
                    Voltar para Dashboard
                </button>
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
                    padding: '1rem',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    Ticket não encontrado
                </div>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={styles.button}
                >
                    Voltar para Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: theme.background,
            color: theme.text,
            transition: 'all 0.3s ease'
        }}>
            {/* Remova ou comente esta navegação duplicada 
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
                <button
                    onClick={() => navigate('/dashboard')}
                    style={styles.button}
                >
                    Voltar para Dashboard
                </button>
            </nav> */}
            
            <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Botão para voltar ao dashboard */}
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{...styles.button, marginBottom: '1rem'}}
                >
                    Voltar para Dashboard
                </button>
                
                <div style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 style={{ margin: 0 }}>{ticket.title}</h1>
                        <div>
                            <span style={{
                                backgroundColor: ticket.status === 'open' ? '#17a2b8' : '#6c757d',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                marginRight: '0.5rem'
                            }}>
                                {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
                            </span>
                            <span style={{
                                color: ticket.priority === 'high' ? '#dc3545' : 
                                    ticket.priority === 'medium' ? '#ffc107' : '#28a745',
                                fontWeight: 'bold'
                            }}>
                                {ticket.priority === 'high' ? 'Alta' : 
                                ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <p><strong>Categoria:</strong> {ticket.category}</p>
                        <p><strong>Criado em:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                        {ticket.updatedAt && (
                            <p><strong>Atualizado em:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                        )}
                    </div>
                    
                    <div style={{ 
                        backgroundColor: theme.background, 
                        padding: '1rem', 
                        borderRadius: '4px',
                        marginBottom: '1rem'
                    }}>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                    </div>
                    
                    {/* Ações do ticket */}
                    <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        padding: '1rem',
                        borderTop: `1px solid ${theme.border}`,
                        borderBottom: `1px solid ${theme.border}`
                    }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status:</label>
                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: `1px solid ${theme.border}`,
                                    backgroundColor: theme.background,
                                    color: theme.text
                                }}
                            >
                                <option value="open">Aberto</option>
                                <option value="closed">Fechado</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Prioridade:</label>
                            <select
                                value={ticket.priority}
                                onChange={(e) => handlePriorityChange(e.target.value)}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: `1px solid ${theme.border}`,
                                    backgroundColor: theme.background,
                                    color: theme.text
                                }}
                            >
                                <option value="low">Baixa</option>
                                <option value="medium">Média</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Comentários */}
                <h2>Comentários</h2>
                
                {comments.length === 0 ? (
                    <div style={{
                        ...styles.card,
                        textAlign: 'center',
                        color: theme.textSecondary || theme.text
                    }}>
                        Nenhum comentário ainda.
                    </div>
                ) : (
                    <div>
                        {comments.map((comment, index) => (
                        <div key={index} style={{
                            ...styles.card,
                            borderLeft: `4px solid ${theme.primary}`
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                                color: theme.textSecondary || theme.text,
                                fontSize: '0.875rem'
                            }}>
                                <span><strong>{comment.author?.name || 'Usuário'}</strong></span>
                                <span>{new Date(comment.createdAt).toLocaleString()}</span>
                            </div>
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{comment.text}</p>
                        </div>
                        ))}
                    </div>
                )}

                {/* Formulário para adicionar comentário */}
                <div style={{
                    ...styles.card,
                    marginTop: '1rem'
                }}>
                    <h3>Adicionar Comentário</h3>
                    <form onSubmit={handleAddComment}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Digite seu comentário aqui..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '4px',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.background,
                                color: theme.text,
                                minHeight: '100px',
                                resize: 'vertical',
                                marginBottom: '1rem'
                            }}
                            required
                        />
                        <button
                            type="submit"
                            style={styles.primaryButton}
                        >
                            Enviar Comentário
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default TicketDetail;

// Remove this duplicate function that was outside the component
// const handleSubmit = async (e) => { ... };