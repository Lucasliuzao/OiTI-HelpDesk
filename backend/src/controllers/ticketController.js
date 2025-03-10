const Ticket = require('../models/Ticket');

const ticketController = {
    // Create new ticket
    create: async (req, res) => {
        try {
            const { title, description, priority, category } = req.body;
            const ticket = await Ticket.create({
                title,
                description,
                priority,
                category,
                createdBy: req.user.id // Will be set by auth middleware
            });

            await ticket.populate('createdBy', 'name email');
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ message: 'Error creating ticket', error: error.message });
        }
    },

    // Get all tickets
    getAll: async (req, res) => {
        try {
            const tickets = await Ticket.find()
                .populate('createdBy', 'name email')
                .populate('assignedTo', 'name email')
                .sort('-createdAt');
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching tickets', error: error.message });
        }
    },

    // Get ticket by ID
    getById: async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.id)
                .populate('createdBy', 'name email')
                .populate('assignedTo', 'name email')
                .populate('comments.createdBy', 'name email');
            
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching ticket', error: error.message });
        }
    },

    // Update ticket
    update: async (req, res) => {
        try {
            const { status, priority, assignedTo } = req.body;
            const ticket = await Ticket.findByIdAndUpdate(
                req.params.id,
                { status, priority, assignedTo },
                { new: true }
            ).populate('createdBy assignedTo', 'name email');

            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ message: 'Error updating ticket', error: error.message });
        }
    },

    // Add comment to ticket
    addComment: async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.id);
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }

            ticket.comments.push({
                text: req.body.text,
                createdBy: req.user.id
            });

            await ticket.save();
            await ticket.populate('comments.createdBy', 'name email');
            
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ message: 'Error adding comment', error: error.message });
        }
    }
};

module.exports = ticketController;