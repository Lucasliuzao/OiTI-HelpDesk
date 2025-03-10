const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);

require('./src/app');