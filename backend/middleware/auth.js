const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    try {
        // Verificar se o cabeçalho de autorização existe
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Não autorizado: Token não fornecido' });
        }

        // Extrair o token do cabeçalho (formato: "Bearer TOKEN")
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Não autorizado: Formato de token inválido' });
        }

        // Verificar e decodificar o token
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro de autenticação:', error);
        return res.status(401).json({ message: 'Não autorizado: Token inválido' });
    }
};