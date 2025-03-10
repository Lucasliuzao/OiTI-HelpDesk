import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RecuperarSenha from './pages/RecuperarSenha';
import RedefinirSenha from './pages/RedefinirSenha';
import TicketDetails from './pages/TicketDetails';
import Registro from './pages/Registro';
import NovoTicket from './pages/NovoTicket';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                    <Route path="/redefinir-senha" element={<RedefinirSenha />} />
                    <Route path="/registro" element={<Registro />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/ticket/:id" 
                        element={
                            <PrivateRoute>
                                <TicketDetails />
                            </PrivateRoute>
                        } 
                    />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route 
                        path="/novo-ticket" 
                        element={
                            <PrivateRoute>
                                <NovoTicket />
                            </PrivateRoute>
                        } 
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
