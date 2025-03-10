const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const result = await User.findOneAndUpdate(
            { email: 'admin@example.com' },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            console.log('Senha do admin redefinida com sucesso!');
            console.log('Email:', result.email);
            console.log('Nova senha: admin123');
        } else {
            console.log('Admin não encontrado');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        await mongoose.connection.close();
    }
};

resetAdminPassword();