import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };
};

const ticketService = {
    getAllTickets: async () => {
        return axios.get(`${API_URL}/tickets`, getAuthHeader());
    },

    createTicket: async (ticketData) => {
        return axios.post(`${API_URL}/tickets`, ticketData, getAuthHeader());
    },

    updateTicket: async (id, updateData) => {
        return axios.put(`${API_URL}/tickets/${id}`, updateData, getAuthHeader());
    },

    getTicketById: async (id) => {
        return axios.get(`${API_URL}/tickets/${id}`, getAuthHeader());
    },

    // Add this new function
    addComment: async (id, commentData) => {
        return axios.post(`${API_URL}/tickets/${id}/comments`, commentData, getAuthHeader());
    }
};

export default ticketService;