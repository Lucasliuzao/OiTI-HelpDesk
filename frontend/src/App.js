import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketDetails from './pages/TicketDetails';

function App() {
    const isAuthenticated = () => {
        const user = localStorage.getItem('user');
        return !!user;
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />
                } />
                <Route path="/dashboard" element={
                    isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
                } />
                <Route path="/ticket/:id" element={
                    isAuthenticated() ? <TicketDetails /> : <Navigate to="/login" />
                } />
                <Route path="/" element={
                    isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

export default App;
