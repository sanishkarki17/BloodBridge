const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, role, blood_group, district, city, phone } = req.body;

    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Check if user already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userRole = role || 'donor';
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
        );

        const userId = result.insertId;

        // If donor, create donor profile
        if (userRole === 'donor' && blood_group) {
            await db.query(
                'INSERT INTO donors (user_id, name, blood_group, district, city, phone) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, name, blood_group, district || null, city || null, phone || null]
            );
        }

        const [newUser] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
        const user = newUser[0];

        // Generate JWT for auto-login
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully.',
            token,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find user
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const user = users[0];

        // Check if blocked
        if (user.is_blocked) {
            return res.status(403).json({ error: 'Account is blocked. Contact admin.' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed.' });
    }
});

module.exports = router;
