import React, { createContext, useState, useContext, useEffect } from 'react';

// Definição dos temas
const lightTheme = {
  background: '#f8f9fa',
  text: '#333333',
  primary: '#0d6efd',
  cardBackground: '#ffffff',
  border: '#dee2e6'
};

const darkTheme = {
  background: '#121212',
  text: '#e0e0e0',
  primary: '#3f8cff',
  cardBackground: '#1e1e1e',
  border: '#444444'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Inicializar o tema com o valor salvo no localStorage ou 'light' como padrão
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Objeto de tema atual baseado na escolha (light/dark)
  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  // Aplicar o tema ao carregar a página e quando o tema mudar
  useEffect(() => {
    // Aplicar classe ao elemento HTML para o Tailwind
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Salvar a preferência no localStorage
    localStorage.setItem('theme', currentTheme);
    
    console.log('Tema alterado para:', currentTheme); // Log para debug
  }, [currentTheme]);

  // Função para alternar entre temas
  const toggleTheme = () => {
    console.log('Alternando tema. Tema atual:', currentTheme); // Log para debug
    setCurrentTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);