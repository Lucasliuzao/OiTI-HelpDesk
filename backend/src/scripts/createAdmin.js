const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk');

        const adminData = {
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            userType: 'admin'
        };

        // Verificar se o admin já existe
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Usuário admin já existe!');
            await mongoose.connection.close();
            return;
        }

        // Criar novo admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        const admin = await User.create({
            ...adminData,
            password: hashedPassword
        });

        console.log('Usuário admin criado com sucesso:', admin.email);
        await mongoose.connection.close();
    } catch (error) {
        console.error('Erro ao criar admin:', error);
        await mongoose.connection.close();
    }
};

createAdmin();