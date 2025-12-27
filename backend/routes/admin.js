const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(verifyToken);
router.use(isAdmin);

// GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, role, is_blocked, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// PUT /api/admin/users/:id/block - Block/Unblock user
router.put('/users/:id/block', async (req, res) => {
    const { id } = req.params;
    const { is_blocked } = req.body;

    try {
        await db.query('UPDATE users SET is_blocked = ? WHERE id = ?', [is_blocked ? 1 : 0, id]);
        res.json({ message: 'User status updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

// DELETE /api/admin/requests/:id - Delete blood request
router.delete('/requests/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM requests WHERE id = ?', [id]);
        res.json({ message: 'Request deleted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete request.' });
    }
});

// GET /api/admin/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
        const [donorCount] = await db.query('SELECT COUNT(*) as count FROM donors');
        const [requestCount] = await db.query('SELECT COUNT(*) as count FROM requests');

        res.json({
            totalUsers: userCount[0].count,
            totalDonors: donorCount[0].count,
            totalRequests: requestCount[0].count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats.' });
    }
});

module.exports = router;
