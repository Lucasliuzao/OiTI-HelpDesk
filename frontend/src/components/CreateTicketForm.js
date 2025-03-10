import React, { useState } from 'react';
import ticketService from '../services/ticketService';

function CreateTicketForm({ onTicketCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ticketService.createTicket(formData);
            setFormData({ title: '', description: '', priority: 'medium', category: '' });
            onTicketCreated();
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
            </div>
            <button
                type="submit"
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Create Ticket
            </button>
        </form>
    );
}

export default CreateTicketForm;