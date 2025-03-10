const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

// Protected routes
router.use(auth);

// Create ticket
router.post('/', ticketController.create);

// Get all tickets
router.get('/', ticketController.getAll);

// Get ticket by id
router.get('/:id', ticketController.getById);

// Update ticket
router.put('/:id', ticketController.update);

// Add comment
router.post('/:id/comments', ticketController.addComment);

module.exports = router;