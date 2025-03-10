const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
// Removida a linha que usava as rotas de filas
app.use('/api/notifications', notificationRoutes);
// Removida a linha que usava as rotas de filas

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota raiz
app.get('/', (req, res) => {
  res.send('API do OiTI HelpDesk está funcionando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});