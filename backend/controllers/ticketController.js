// ... existing code ...

// Obter um ticket por ID
exports.getTicketById = async (req, res) => {
  try {
    console.log('Backend: Fetching ticket with ID:', req.params.id);
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'comments.author',
        select: 'name email'
      });
    
    if (!ticket) {
      console.log('Backend: Ticket not found');
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    
    console.log('Backend: Ticket found:', ticket.title);
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Backend: Error fetching ticket:', error);
    res.status(500).json({ message: 'Erro ao buscar ticket', error: error.message });
  }
};

// Adicionar comentário a um ticket
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'O texto do comentário é obrigatório' });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    
    const comment = {
      text,
      author: req.user.id,
      createdAt: new Date()
    };
    
    ticket.comments.push(comment);
    ticket.updatedAt = new Date();
    
    await ticket.save();
    
    // Buscar o comentário com o autor populado
    const updatedTicket = await Ticket.findById(req.params.id)
      .populate({
        path: 'comments.author',
        select: 'name email'
      });
    
    const newComment = updatedTicket.comments[updatedTicket.comments.length - 1];
    
    // Garantir que o comentário tenha todas as propriedades necessárias
    const safeComment = {
      _id: newComment._id,
      text: newComment.text,
      createdAt: newComment.createdAt,
      author: newComment.author || { name: 'Usuário', email: '' }
    };
    
    res.status(201).json({ 
      message: 'Comentário adicionado com sucesso',
      comment: safeComment
    });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ message: 'Erro ao adicionar comentário', error: error.message });
  }
};

// Atualizar status do ticket
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['open', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    
    ticket.status = status;
    ticket.updatedAt = new Date();
    
    await ticket.save();
    
    res.status(200).json({ 
      message: 'Status do ticket atualizado com sucesso',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status do ticket', error: error.message });
  }
};

// Atualizar prioridade do ticket
exports.updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    
    if (!priority || !['low', 'medium', 'high'].includes(priority)) {
      return res.status(400).json({ message: 'Prioridade inválida' });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    
    ticket.priority = priority;
    ticket.updatedAt = new Date();
    
    await ticket.save();
    
    res.status(200).json({ 
      message: 'Prioridade do ticket atualizada com sucesso',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar prioridade do ticket', error: error.message });
  }
};

// Obter comentários de um ticket
exports.getComments = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name email'
        }
      });
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }
    
    res.status(200).json(ticket.comments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar comentários', error: error.message });
  }
};

// Adicione esta importação no topo do arquivo
const { createNotification } = require('./notificationController');

// Modifique o método de atualização de ticket para criar notificações
exports.updateTicket = async (req, res) => {
    try {
        const { status, priority } = req.body;
        const updates = {};
        
        if (status) updates.status = status;
        if (priority) updates.priority = priority;
        
        updates.updatedAt = new Date();
        
        const ticket = await Ticket.findById(req.params.id).populate('user');
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket não encontrado' });
        }
        
        // Verificar se o status foi alterado
        if (status && ticket.status !== status) {
            // Criar notificação para o usuário que criou o ticket
            await createNotification(
                ticket.user._id,
                'Status do ticket atualizado',
                `O status do seu ticket "${ticket.title}" foi alterado para ${status}.`,
                'info',
                'ticket',
                ticket._id
            );
        }
        
        // Verificar se a prioridade foi alterada
        if (priority && ticket.priority !== priority) {
            // Criar notificação para o usuário que criou o ticket
            await createNotification(
                ticket.user._id,
                'Prioridade do ticket atualizada',
                `A prioridade do seu ticket "${ticket.title}" foi alterada para ${priority}.`,
                'info',
                'ticket',
                ticket._id
            );
        }
        
        // Atualizar o ticket
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        ).populate('user');
        
        res.status(200).json(updatedTicket);
    } catch (error) {
        console.error('Erro ao atualizar ticket:', error);
        res.status(500).json({ message: 'Erro ao atualizar ticket', error: error.message });
    }
};

// Modifique o método de adicionar comentário para criar notificações
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'O texto do comentário é obrigatório' });
        }
        
        const ticket = await Ticket.findById(req.params.id).populate('user');
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket não encontrado' });
        }
        
        const comment = {
            text,
            author: req.user.id,
            createdAt: new Date()
        };
        
        ticket.comments.push(comment);
        ticket.updatedAt = new Date();
        
        await ticket.save();
        
        // Criar notificação para o usuário que criou o ticket (se não for o autor do comentário)
        if (ticket.user._id.toString() !== req.user.id) {
            await createNotification(
                ticket.user._id,
                'Novo comentário no seu ticket',
                `Um novo comentário foi adicionado ao seu ticket "${ticket.title}".`,
                'info',
                'comment',
                ticket._id
            );
        }
        
        res.status(201).json(ticket);
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        res.status(500).json({ message: 'Erro ao adicionar comentário', error: error.message });
    }
};