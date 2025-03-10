import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';
import authService from '../services/authService';
import CreateTicketForm from '../components/CreateTicketForm';
import Navbar from '../components/Navbar';

function Dashboard() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        search: ''
    });

    useEffect(() => {
        const checkAuth = async () => {
            const user = authService.getCurrentUser();
            if (!user) {
                window.location.replace('/login');
                return;
            }
            await loadTickets();
        };
        
        checkAuth();
    }, []);

    const loadTickets = async () => {
        try {
            const user = localStorage.getItem('user');
            if (!user) return;
            
            const response = await ticketService.getAllTickets();
            setTickets(response.data);
            setFilteredTickets(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load tickets');
            setLoading(false);
        }
    };

    useEffect(() => {
        filterTickets();
    }, [tickets, filters]);

    const filterTickets = () => {
        let result = [...tickets];

        // Status filter
        if (filters.status !== 'all') {
            result = result.filter(ticket => ticket.status === filters.status);
        }

        // Priority filter
        if (filters.priority !== 'all') {
            result = result.filter(ticket => ticket.priority === filters.priority);
        }

        // Search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(ticket => 
                ticket.title.toLowerCase().includes(searchLower) ||
                ticket.description.toLowerCase().includes(searchLower) ||
                ticket.category.toLowerCase().includes(searchLower)
            );
        }

        setFilteredTickets(result);
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#28a745',
            medium: '#ffc107',
            high: '#fd7e14',
            urgent: '#dc3545'
        };
        return colors[priority] || '#6c757d';
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Dashboard</h1>
                    <div>
                        <button
                            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                            style={{ marginRight: '10px' }}
                        >
                            {viewMode === 'list' ? 'Grid View' : 'List View'}
                        </button>
                        <button onClick={() => setShowCreateForm(!showCreateForm)}>
                            {showCreateForm ? 'Hide Form' : 'Create New Ticket'}
                        </button>
                    </div>
                </div>

                {showCreateForm && <CreateTicketForm onTicketCreated={loadTickets} />}

                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        style={{ marginRight: '10px' }}
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="all">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                <div style={{ 
                    display: viewMode === 'grid' ? 'grid' : 'block',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {filteredTickets.map(ticket => (
                        <div 
                            key={ticket._id}
                            onClick={() => navigate(`/ticket/${ticket._id}`)}
                            style={{
                                border: '1px solid #ddd',
                                borderLeft: `5px solid ${getPriorityColor(ticket.priority)}`,
                                padding: '15px',
                                marginBottom: viewMode === 'list' ? '10px' : '0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                transition: 'transform 0.2s',
                                ':hover': {
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <h3>{ticket.title}</h3>
                            <p>Status: {ticket.status}</p>
                            <p>Priority: {ticket.priority}</p>
                            <p>Category: {ticket.category}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;