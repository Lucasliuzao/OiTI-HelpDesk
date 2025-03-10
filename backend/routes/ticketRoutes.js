const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// Get all tickets
router.get('/', auth, ticketController.getAllTickets);

// Create a new ticket
router.post('/', auth, ticketController.createTicket);

// Get a specific ticket
router.get('/:id', auth, ticketController.getTicketById);

// Update a ticket (general update)
router.patch('/:id', auth, ticketController.updateTicket);

// Update ticket status - Certifique-se de que esta rota existe
router.put('/:id/status', auth, ticketController.updateStatus);

// Update ticket priority
router.put('/:id/priority', auth, ticketController.updatePriority);

// Add comment to a ticket
router.post('/:id/comments', auth, ticketController.addComment);

// Get comments for a ticket
router.get('/:id/comments', auth, ticketController.getComments);

module.exports = router;