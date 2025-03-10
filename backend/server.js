// ... código existente ...

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// ... código existente ...

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// ... código existente ...