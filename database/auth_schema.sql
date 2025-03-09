-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('usuario', 'tecnico', 'admin') NOT NULL,
    status BOOLEAN DEFAULT true,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela para Tokens de Recuperação de Senha
CREATE TABLE tokens_recuperacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    data_expiracao DATETIME NOT NULL,
    usado BOOLEAN DEFAULT false,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela para Perfis de Usuário
CREATE TABLE perfis_usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    departamento VARCHAR(100),
    cargo VARCHAR(100),
    telefone VARCHAR(20),
    foto_perfil VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);