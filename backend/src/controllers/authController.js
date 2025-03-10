const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login attempt:', email);
            
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found:', email);
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            console.log('User found, checking password');
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                console.log('Invalid password for user:', email);
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '1d' }
            );

            console.log('Login successful for user:', email);
            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Erro no servidor' });
        }
    },

    // Register new user
    register: async (req, res) => {
        try {
            const { name, email, password, userType } = req.body;

            // Check if user already exists
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                userType
            });

            // Generate token
            const token = jwt.sign(
                { id: user._id, userType: user.userType },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    userType: user.userType
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = authController;