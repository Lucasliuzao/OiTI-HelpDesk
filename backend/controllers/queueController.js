const Queue = require('../models/Queue');
const Ticket = require('../models/Ticket');

// Funções do controlador
exports.getAllQueues = async (req, res) => {
  // Implementação
};

// Criar uma nova fila
exports.createQueue = async (req, res) => {
  try {
    const { name, description, assignedTo } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'O nome da fila é obrigatório' });
    }
    
    // Verificar se já existe uma fila com o mesmo nome
    const existingQueue = await Queue.findOne({ name });
    if (existingQueue) {
      return res.status(400).json({ message: 'Já existe uma fila com este nome' });
    }
    
    const queue = new Queue({
      name,
      description,
      assignedTo,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await queue.save();
    
    res.status(201).json({ 
      message: 'Fila criada com sucesso',
      queue
    });
  } catch (error) {
    console.error('Erro ao criar fila:', error);
    res.status(500).json({ message: 'Erro ao criar fila', error: error.message });
  }
};

// Obter uma fila específica
exports.getQueueById = async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.id).populate('assignedTo', 'name email');
    
    if (!queue) {
      return res.status(404).json({ message: 'Fila não encontrada' });
    }
    
    res.status(200).json(queue);
  } catch (error) {
    console.error('Erro ao buscar fila:', error);
    res.status(500).json({ message: 'Erro ao buscar fila', error: error.message });
  }
};

// Atualizar uma fila
exports.updateQueue = async (req, res) => {
  try {
    const { name, description, assignedTo } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (assignedTo) updates.assignedTo = assignedTo;
    
    updates.updatedAt = new Date();
    
    const queue = await Queue.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate('assignedTo', 'name email');
    
    if (!queue) {
      return res.status(404).json({ message: 'Fila não encontrada' });
    }
    
    res.status(200).json({ 
      message: 'Fila atualizada com sucesso',
      queue
    });
  } catch (error) {
    console.error('Erro ao atualizar fila:', error);
    res.status(500).json({ message: 'Erro ao atualizar fila', error: error.message });
  }
};

// Excluir uma fila
exports.deleteQueue = async (req, res) => {
  try {
    // Verificar se existem tickets associados a esta fila
    const ticketsInQueue = await Ticket.countDocuments({ queue: req.params.id });
    
    if (ticketsInQueue > 0) {
      return res.status(400).json({ 
        message: 'Não é possível excluir esta fila pois existem tickets associados a ela',
        ticketsCount: ticketsInQueue
      });
    }
    
    const queue = await Queue.findByIdAndDelete(req.params.id);
    
    if (!queue) {
      return res.status(404).json({ message: 'Fila não encontrada' });
    }
    
    res.status(200).json({ 
      message: 'Fila excluída com sucesso',
      queue
    });
  } catch (error) {
    console.error('Erro ao excluir fila:', error);
    res.status(500).json({ message: 'Erro ao excluir fila', error: error.message });
  }
};

// Obter tickets de uma fila específica
exports.getTicketsByQueue = async (req, res) => {
  try {
    const tickets = await Ticket.find({ queue: req.params.id })
      .populate('user', 'name email')
      .sort({ updatedAt: -1 });
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets da fila:', error);
    res.status(500).json({ message: 'Erro ao buscar tickets da fila', error: error.message });
  }
};