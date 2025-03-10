import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const themes = {
        light: {
            background: '#f5f5f5',
            cardBackground: 'white',
            text: '#333',
            primary: '#0066cc',
            primaryHover: '#0052a3',
            border: '#ddd'
        },
        dark: {
            background: '#1a1a1a',
            cardBackground: '#2d2d2d',
            text: '#ffffff',
            primary: '#3399ff',
            primaryHover: '#1a8cff',
            border: '#404040'
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const theme = isDarkMode ? themes.dark : themes.light;

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);