import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login(formData);
            if (response && response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.href = '/dashboard';
            }
        } catch (error) {
            setError(error.message || 'Erro ao fazer login');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;