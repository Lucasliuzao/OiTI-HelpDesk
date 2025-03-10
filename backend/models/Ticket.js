const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Aberto', 'Em Andamento', 'Fechado'),
    defaultValue: 'Aberto'
  },
  prioridade: {
    type: DataTypes.ENUM('Baixa', 'Média', 'Alta'),
    defaultValue: 'Média'
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Relacionamento com o usuário
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'usuario' });
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });

module.exports = Ticket;