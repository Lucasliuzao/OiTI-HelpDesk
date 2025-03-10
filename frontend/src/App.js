import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
// Remova a importação do Navbar antigo
import AppRoutes from './routes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Remova a referência ao componente Navbar aqui */}
            <AppRoutes />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
