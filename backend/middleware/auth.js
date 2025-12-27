const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
};

const db = require('../db');

// Middleware to check if user is blocked (queries DB for real-time status)
const checkBlocked = async (req, res, next) => {
    try {
        const [users] = await db.query('SELECT is_blocked FROM users WHERE id = ?', [req.user.id]);

        if (users.length === 0 || users[0].is_blocked) {
            return res.status(403).json({
                error: 'Account blocked',
                message: 'Your account has been blocked by an administrator or no longer exists. Please contact support.'
            });
        }
        next();
    } catch (err) {
        console.error('Error in checkBlocked middleware:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { verifyToken, isAdmin, checkBlocked, JWT_SECRET };
