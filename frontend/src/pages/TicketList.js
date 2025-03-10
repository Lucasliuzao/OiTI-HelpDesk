import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'react-feather';
import ticketService from '../services/ticketService';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAllTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = () => {
    if (filter === 'all') return tickets;
    if (filter === 'open') return tickets.filter(ticket => ticket.status === 'open');
    if (filter === 'closed') return tickets.filter(ticket => ticket.status === 'closed');
    return tickets;
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusClass = (status) => {
    return status === 'open' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tickets</h1>
        // Update the Link for new ticket to use /create-ticket instead of /novo-ticket
        <Link 
          to="/create-ticket" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Novo Ticket
        </Link>
      </div>

      <div className="mb-6 flex items-center">
        <Filter size={20} className="mr-2 text-gray-600 dark:text-gray-400" />
        <select 
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-700 dark:text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos os Tickets</option>
          <option value="open">Tickets Abertos</option>
          <option value="closed">Tickets Fechados</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">Carregando tickets...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : filteredTickets().length === 0 ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">Nenhum ticket encontrado</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets().map((ticket) => (
                // In the ticket row onClick handler, ensure it uses the correct path
                <tr 
                  key={ticket._id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {ticket.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {ticket.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                      {ticket.status === 'open' ? 'Aberto' : 'Fechado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketList;