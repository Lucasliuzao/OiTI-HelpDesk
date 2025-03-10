import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    // In the handleSubmit function
    try {
      setLoading(true);
      setError('');
      await ticketService.createTicket(formData);
      // Change navigation to /tickets instead of /dashboard
      navigate('/tickets');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Criar Novo Ticket</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
              Título*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="category">
              Categoria*
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Rede">Rede</option>
              <option value="Acesso">Acesso</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="priority">
              Prioridade
            </label>
            <select
              id="priority"
              name="priority"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
              Descrição*
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => navigate('/tickets')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;