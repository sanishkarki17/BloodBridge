const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, checkBlocked } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// GET /api/profile - Get current user's profile
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = users[0];

        // If donor, get donor info
        if (user.role === 'donor') {
            const [donors] = await db.query(
                'SELECT * FROM donors WHERE user_id = ?',
                [req.user.id]
            );
            user.donorInfo = donors[0] || null;
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});

// PUT /api/profile - Update user profile
router.put('/', checkBlocked, async (req, res) => {
    const { name, email } = req.body;

    try {
        // Check if email is already taken by another user
        if (email) {
            const [existing] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, req.user.id]
            );
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Email already in use.' });
            }
        }

        await db.query(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name || req.user.name, email || req.user.email, req.user.id]
        );

        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
});

// PUT /api/profile/donor - Update donor-specific info
router.put('/donor', checkBlocked, async (req, res) => {
    const { blood_group, district, city, phone, available, last_donated } = req.body;

    try {
        // Check if user is a donor
        const [users] = await db.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0 || users[0].role !== 'donor') {
            return res.status(403).json({ error: 'Only donors can update donor info.' });
        }

        // Check if donor profile exists
        const [donors] = await db.query('SELECT id FROM donors WHERE user_id = ?', [req.user.id]);

        if (donors.length === 0) {
            // Create donor profile
            const [userInfo] = await db.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
            await db.query(
                'INSERT INTO donors (user_id, name, blood_group, district, city, phone, available, last_donated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [req.user.id, userInfo[0].name, blood_group, district, city, phone, available ? 1 : 0, last_donated || null]
            );
        } else {
            // Update donor profile
            await db.query(
                'UPDATE donors SET blood_group = ?, district = ?, city = ?, phone = ?, available = ?, last_donated = ? WHERE user_id = ?',
                [blood_group, district, city, phone, available ? 1 : 0, last_donated || null, req.user.id]
            );
        }

        res.json({ message: 'Donor info updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update donor info.' });
    }
});

// GET /api/profile/requests - Get user's own requests
router.get('/requests', async (req, res) => {
    try {
        const [requests] = await db.query(
            'SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch requests.' });
    }
});

module.exports = router;
