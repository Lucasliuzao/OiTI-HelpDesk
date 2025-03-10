import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';

function TicketDetails() {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadTicket();
    }, [id]);

    const loadTicket = async () => {
        try {
            const response = await ticketService.getTicketById(id);
            setTicket(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load ticket');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await ticketService.updateTicket(id, { status: newStatus });
            loadTicket();
        } catch (err) {
            setError('Failed to update status');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await ticketService.addComment(id, { text: comment });
            setComment('');
            loadTicket();
        } catch (err) {
            setError('Failed to add comment');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!ticket) return <div>Ticket not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/dashboard')}
                style={{ marginBottom: '20px' }}
            >
                Back to Dashboard
            </button>

            <h1>{ticket.title}</h1>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Description:</strong> {ticket.description}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p><strong>Priority:</strong> {ticket.priority}</p>
                <p><strong>Category:</strong> {ticket.category}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Update Status</h3>
                <select 
                    value={ticket.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    style={{ padding: '5px' }}
                >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <div>
                <h3>Comments</h3>
                <form onSubmit={handleAddComment}>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
                    />
                    <button type="submit">Add Comment</button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    {ticket.comments && ticket.comments.map((comment, index) => (
                        <div 
                            key={index}
                            style={{ 
                                border: '1px solid #ddd',
                                padding: '10px',
                                marginBottom: '10px'
                            }}
                        >
                            <p>{comment.text}</p>
                            <small>By: {comment.createdBy?.name || 'Unknown'}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TicketDetails;