const express = require('express');
const app = express();

app.use(express.json());

// Rota de teste simples
app.get('/teste', (req, res) => {
  console.log('Rota de teste acessada');
  res.json({ message: 'Teste funcionando!' });
});

// Rota para filas
app.get('/api/queues/teste', (req, res) => {
  console.log('Rota de teste de filas acessada');
  res.json({ message: 'Teste de filas funcionando!' });
});

const PORT = 5002; // Changed port to 5002
app.listen(PORT, () => {
  console.log(`Servidor de teste rodando na porta ${PORT}`);
});