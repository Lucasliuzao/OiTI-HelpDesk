const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk');

        const admin = await User.findOne({ email: 'admin@example.com' });
        if (admin) {
            console.log('Admin encontrado:');
            console.log('Email:', admin.email);
            console.log('Nome:', admin.name);
            console.log('Tipo:', admin.userType);
        } else {
            console.log('Admin não encontrado');
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Erro ao verificar admin:', error);
        await mongoose.connection.close();
    }
};

checkAdmin();