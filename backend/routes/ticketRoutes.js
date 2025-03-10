const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware de autenticação para todas as rotas
router.use(auth);

// Obter todos os tickets do usuário
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    return res.status(200).json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    return res.status(500).json({ message: 'Erro ao buscar tickets' });
  }
});

// Obter um ticket específico
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    return res.status(500).json({ message: 'Erro ao buscar ticket' });
  }
});

// Criar um novo ticket
router.post('/', async (req, res) => {
  try {
    const { titulo, descricao, categoria, prioridade } = req.body;

    if (!titulo || !descricao || !categoria) {
      return res.status(400).json({ message: 'Título, descrição e categoria são obrigatórios' });
    }

    const newTicket = await Ticket.create({
      titulo,
      descricao,
      categoria,
      prioridade: prioridade || 'Média',
      userId: req.user.id
    });

    return res.status(201).json(newTicket);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    return res.status(500).json({ message: 'Erro ao criar ticket' });
  }
});

// Atualizar um ticket
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descricao, status, categoria, prioridade } = req.body;
    const ticket = await Ticket.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    // Atualizar campos
    if (titulo) ticket.titulo = titulo;
    if (descricao) ticket.descricao = descricao;
    if (status) ticket.status = status;
    if (categoria) ticket.categoria = categoria;
    if (prioridade) ticket.prioridade = prioridade;

    await ticket.save();

    return res.status(200).json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    return res.status(500).json({ message: 'Erro ao atualizar ticket' });
  }
});

// Excluir um ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    await ticket.destroy();

    return res.status(200).json({ message: 'Ticket excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir ticket:', error);
    return res.status(500).json({ message: 'Erro ao excluir ticket' });
  }
});

module.exports = router;