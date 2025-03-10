import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ticketService from '../services/ticketService';
import authService from '../services/authService';
import TicketCard from '../components/TicketCard';

function Dashboard() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para paginação e ordenação
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc'
    });
    
    // Estado para controlar o tipo de visualização
    const [viewType, setViewType] = useState('cards'); // 'cards', 'table', 'kanban'
    
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        search: ''
    });

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
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        flexContainer: {
            display: 'flex',
            gap: '1rem'
        }
    };

    // Função para ordenação - otimizada com useCallback
    const sortTickets = useCallback((ticketsToSort, config) => {
        return [...ticketsToSort].sort((a, b) => {
            if (config.key === 'createdAt' || config.key === 'updatedAt') {
                return config.direction === 'asc'
                    ? new Date(a[config.key]) - new Date(b[config.key])
                    : new Date(b[config.key]) - new Date(a[config.key]);
            }
            
            if (a[config.key] < b[config.key]) {
                return config.direction === 'asc' ? -1 : 1;
            }
            if (a[config.key] > b[config.key]) {
                return config.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, []);

    // Função para mudar a ordenação
    const handleSort = useCallback((key) => {
        setSortConfig(prevSort => ({
            key,
            direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    // Lógica de paginação com useMemo para evitar recálculos desnecessários
    const { currentItems, totalPages } = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return {
            currentItems: filteredTickets.slice(indexOfFirstItem, indexOfLastItem),
            totalPages: Math.ceil(filteredTickets.length / itemsPerPage)
        };
    }, [filteredTickets, currentPage, itemsPerPage]);

    // Função para mudar de página
    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    // Buscar tickets - otimizado com useCallback
    const fetchTickets = useCallback(async () => {
        try {
            const data = await ticketService.getAllTickets();
            setTickets(data);
            setFilteredTickets(data);
        } catch (err) {
            setError('Erro ao carregar tickets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Aplicar filtros e ordenação - otimizado com useEffect
    useEffect(() => {
        let result = [...tickets];
        
        // Filtrar por status
        if (filters.status !== 'all') {
            result = result.filter(ticket => ticket.status === filters.status);
        }
        
        // Filtrar por prioridade
        if (filters.priority !== 'all') {
            result = result.filter(ticket => ticket.priority === filters.priority);
        }
        
        // Filtrar por termo de busca
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(ticket => 
                ticket.title.toLowerCase().includes(searchTerm) || 
                ticket.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Aplicar ordenação
        result = sortTickets(result, sortConfig);
        
        setFilteredTickets(result);
        setCurrentPage(1); // Resetar para primeira página quando filtros mudam
    }, [filters, tickets, sortConfig, sortTickets]);

    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleLogout = useCallback(() => {
        authService.logout();
        navigate('/login');
    }, [navigate]);

    // Contagem de tickets por status - otimizado com useMemo
    const ticketCounts = useMemo(() => ({
        total: tickets.length,
        open: tickets.filter(ticket => ticket.status === 'open').length,
        closed: tickets.filter(ticket => ticket.status === 'closed').length
    }), [tickets]);

    // Componente de visualização em tabela
    const TableView = () => (
        <div style={{
            backgroundColor: theme.cardBackground,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: theme.background }}>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: `1px solid ${theme.border}` }}>
                            <button 
                                onClick={() => handleSort('title')}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    color: theme.text,
                                    fontWeight: 'bold',
                                    padding: 0
                                }}
                            >
                                Título {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: `1px solid ${theme.border}` }}>
                            <button 
                                onClick={() => handleSort('status')}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    color: theme.text,
                                    fontWeight: 'bold',
                                    padding: 0
                                }}
                            >
                                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: `1px solid ${theme.border}` }}>
                            <button 
                                onClick={() => handleSort('priority')}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    color: theme.text,
                                    fontWeight: 'bold',
                                    padding: 0
                                }}
                            >
                                Prioridade {sortConfig.key === 'priority' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: `1px solid ${theme.border}` }}>
                            <button 
                                onClick={() => handleSort('category')}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    color: theme.text,
                                    fontWeight: 'bold',
                                    padding: 0
                                }}
                            >
                                Categoria {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', borderBottom: `1px solid ${theme.border}` }}>
                            <button 
                                onClick={() => handleSort('createdAt')}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    color: theme.text,
                                    fontWeight: 'bold',
                                    padding: 0
                                }}
                            >
                                Data de Criação {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(ticket => (
                        <tr 
                            key={ticket._id} 
                            onClick={() => navigate(`/ticket/${ticket._id}`)}
                            style={{ 
                                cursor: 'pointer',
                                borderBottom: `1px solid ${theme.border}`,
                                backgroundColor: theme.cardBackground,
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.background}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.cardBackground}
                        >
                            <td style={{ padding: '1rem' }}>{ticket.title}</td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    backgroundColor: ticket.status === 'open' ? '#17a2b8' : '#6c757d',
                                    color: 'white',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem'
                                }}>
                                    {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
                                </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                                <span style={{
                                    color: ticket.priority === 'high' ? '#dc3545' : 
                                           ticket.priority === 'medium' ? '#ffc107' : '#28a745',
                                    fontWeight: 'bold'
                                }}>
                                    {ticket.priority === 'high' ? 'Alta' : 
                                     ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                            </td>
                            <td style={{ padding: '1rem' }}>{ticket.category}</td>
                            <td style={{ padding: '1rem' }}>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Componente de visualização Kanban
    const KanbanView = () => {
        const openTickets = filteredTickets.filter(ticket => ticket.status === 'open');
        const closedTickets = filteredTickets.filter(ticket => ticket.status === 'closed');
        
        const columnStyle = {
            flex: 1,
            backgroundColor: theme.cardBackground,
            borderRadius: '8px',
            padding: '1rem',
            minHeight: '400px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        };
        
        const headerStyle = {
            textAlign: 'center',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderBottom: `1px solid ${theme.border}`
        };
        
        return (
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={columnStyle}>
                    <h3 style={headerStyle}>
                        Abertos <span style={{ backgroundColor: '#17a2b8', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '50%' }}>{openTickets.length}</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {openTickets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: theme.textSecondary || theme.text }}>
                                Nenhum ticket aberto
                            </div>
                        ) : (
                            openTickets.map(ticket => (
                                <div 
                                    key={ticket._id}
                                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                                    style={{
                                        backgroundColor: theme.background,
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{ticket.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: theme.textSecondary || theme.text }}>
                                        <span>{ticket.category}</span>
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
                            ))
                        )}
                    </div>
                </div>
                <div style={columnStyle}>
                    <h3 style={headerStyle}>
                        Fechados <span style={{ backgroundColor: '#6c757d', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '50%' }}>{closedTickets.length}</span>
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {closedTickets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: theme.textSecondary || theme.text }}>
                                Nenhum ticket fechado
                            </div>
                        ) : (
                            closedTickets.map(ticket => (
                                <div 
                                    key={ticket._id}
                                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                                    style={{
                                        backgroundColor: theme.background,
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{ticket.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: theme.textSecondary || theme.text }}>
                                        <span>{ticket.category}</span>
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
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
                        onClick={toggleTheme}
                        style={{
                            ...styles.button,
                            marginRight: '10px'
                        }}
                    >
                        {theme.mode === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
                    </button>
                    <button
                        onClick={handleLogout}
                        style={styles.button}
                    >
                        Sair
                    </button>
                </div>
            </nav>

            <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '2rem' 
                }}>
                    <h1>Meus Tickets</h1>
                    <button
                        onClick={() => navigate('/novo-ticket')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: theme.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Novo Ticket
                    </button>
                </div>

                {/* Estatísticas de Tickets */}
                <div style={{ 
                    ...styles.flexContainer,
                    marginBottom: '2rem' 
                }}>
                    <div style={{
                        flex: 1,
                        ...styles.card,
                        textAlign: 'center'
                    }}>
                        <h3>Total</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{ticketCounts.total}</p>
                    </div>
                    <div style={{
                        flex: 1,
                        ...styles.card,
                        textAlign: 'center'
                    }}>
                        <h3>Abertos</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#17a2b8' }}>{ticketCounts.open}</p>
                    </div>
                    <div style={{
                        flex: 1,
                        ...styles.card,
                        textAlign: 'center'
                    }}>
                        <h3>Fechados</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6c757d' }}>{ticketCounts.closed}</p>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div style={{ 
                    ...styles.flexContainer,
                    marginBottom: '2rem',
                    ...styles.card
                }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                        <select 
                            name="status" 
                            value={filters.status} 
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.background,
                                color: theme.text
                            }}
                        >
                            <option value="all">Todos</option>
                            <option value="open">Aberto</option>
                            <option value="closed">Fechado</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Prioridade</label>
                        <select 
                            name="priority" 
                            value={filters.priority} 
                            onChange={handleFilterChange}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.background,
                                color: theme.text
                            }}
                        >
                            <option value="all">Todas</option>
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                    <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Buscar</label>
                        <input 
                            type="text" 
                            name="search" 
                            value={filters.search} 
                            onChange={handleFilterChange}
                            placeholder="Buscar por título ou descrição"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: `1px solid ${theme.border}`,
                                backgroundColor: theme.background,
                                color: theme.text
                            }}
                        />
                    </div>
                </div>

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

                {/* Botões de alternância de visualização */}
                <div style={{ 
                    ...styles.flexContainer,
                    marginBottom: '1rem',
                    justifyContent: 'flex-end' 
                }}>
                    <button
                        onClick={() => setViewType('cards')}
                        style={{
                            ...styles.button,
                            backgroundColor: viewType === 'cards' ? theme.primary : 'transparent',
                            color: viewType === 'cards' ? 'white' : theme.text
                        }}
                    >
                        Cards
                    </button>
                    <button
                        onClick={() => setViewType('table')}
                        style={{
                            ...styles.button,
                            backgroundColor: viewType === 'table' ? theme.primary : 'transparent',
                            color: viewType === 'table' ? 'white' : theme.text
                        }}
                    >
                        Tabela
                    </button>
                    <button
                        onClick={() => setViewType('kanban')}
                        style={{
                            ...styles.button,
                            backgroundColor: viewType === 'kanban' ? theme.primary : 'transparent',
                            color: viewType === 'kanban' ? 'white' : theme.text
                        }}
                    >
                        Kanban
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando tickets...
                    </div>
                ) : tickets.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2rem',
                        ...styles.card,
                        border: `1px solid ${theme.border}`
                    }}>
                        <p>Você ainda não possui tickets.</p>
                        <button
                            onClick={() => navigate('/novo-ticket')}
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
                            Criar Primeiro Ticket
                        </button>
                    </div>
                ) : (
                    <>
                        {viewType === 'table' && <TableView />}
                        {viewType === 'kanban' && <KanbanView />}
                        {viewType === 'cards' && (
                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                                {currentItems.map(ticket => (
                                    <TicketCard key={ticket._id} ticket={ticket} />
                                ))}
                            </div>
                        )}

                        {/* Paginação */}
                        {viewType !== 'kanban' && (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                gap: '0.5rem', 
                                marginTop: '2rem' 
                            }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        style={{
                                            ...styles.button,
                                            backgroundColor: currentPage === number ? theme.primary : 'transparent',
                                            color: currentPage === number ? 'white' : theme.text
                                        }}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
                                             