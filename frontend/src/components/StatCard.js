import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const StatCard = ({ title, value, color }) => {
    const { theme } = useTheme();
    
    return (
        <div style={{
            backgroundColor: theme.cardBackground,
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${color}`
        }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: theme.text }}>{title}</h3>
            <p style={{ 
                margin: 0, 
                fontSize: '2rem', 
                fontWeight: 'bold',
                color: color 
            }}>
                {value}
            </p>
        </div>
    );
};

export default StatCard;