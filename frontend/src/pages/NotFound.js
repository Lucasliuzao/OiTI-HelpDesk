import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Página não encontrada
        </p>
        <Link 
          to="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFound;