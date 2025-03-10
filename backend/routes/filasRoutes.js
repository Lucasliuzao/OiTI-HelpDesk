const express = require('express');
const router = express.Router();

console.log('Arquivo de rotas de filas carregado');

// Rota de teste simples
router.get('/teste', (req, res) => {
  console.log('Rota de teste acessada');
  res.json({ message: 'Rota de teste de filas funcionando!' });
});

// Rota raiz
router.get('/', (req, res) => {
  console.log('Rota raiz de filas acessada');
  res.json({ message: 'Rota raiz de filas funcionando!' });
});

module.exports = router;