// Vamos limpar os comentários de remoção do App.js e verificar as rotas
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Importações de páginas
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import TicketList from '../pages/TicketList';
import TicketDetail from '../pages/TicketDetail';
import CreateTicket from '../pages/CreateTicket';
import NotFound from '../pages/NotFound';
import Navbar from '../components/Navbar';

// Componente de rota protegida
const ProtectedRoute = ({ children, hideNavbar }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/tickets" element={
        <ProtectedRoute>
          <TicketList />
        </ProtectedRoute>
      } />
      
      {/* Change the create ticket route to match the link in TicketList */}
      <Route path="/novo-ticket" element={
        <ProtectedRoute>
          <CreateTicket />
        </ProtectedRoute>
      } />
      
      <Route path="/tickets/:id" element={
        <ProtectedRoute hideNavbar>
          <TicketDetail />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;