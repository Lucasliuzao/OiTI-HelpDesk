import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Navbar() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    return (
        <nav style={{
            backgroundColor: '#333',
            padding: '1rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ 
                    backgroundColor: '#0066cc',
                    color: 'white',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}>OiTI</span>
                <span style={{ fontSize: '1.5rem' }}>HelpDesk</span>
            </div>
            <div>
                <span style={{ marginRight: '1rem' }}>Welcome, {user?.user?.name || 'User'}</span>
                <button 
                    onClick={authService.logout}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;