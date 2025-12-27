const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, checkBlocked } = require("../middleware/auth");

// ensure requests table exists
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(120) NOT NULL,
        blood_group VARCHAR(5) NOT NULL,
        district VARCHAR(80),
        city VARCHAR(80),
        phone VARCHAR(30),
        hospital VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error("requests table creation failed", err);
  }
})();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM requests ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", verifyToken, checkBlocked, async (req, res) => {
  const { name, blood_group, district, city, phone, hospital } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO requests (user_id, name, blood_group, district, city, phone, hospital) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, name, blood_group, district, city, phone, hospital || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

router.put("/:id", verifyToken, checkBlocked, async (req, res) => {
  const { id } = req.params;
  const { name, blood_group, district, city, phone, hospital } = req.body;

  try {
    // Check ownership
    const [requests] = await db.query('SELECT user_id FROM requests WHERE id = ?', [id]);
    if (requests.length === 0) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    if (requests[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own requests.' });
    }

    await db.query(
      'UPDATE requests SET name = ?, blood_group = ?, district = ?, city = ?, phone = ?, hospital = ? WHERE id = ?',
      [name, blood_group, district, city, phone, hospital || null, id]
    );
    res.json({ message: 'Request updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

// DELETE /api/requests/:id - Delete request (owner or admin)
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Check ownership or admin
    const [requests] = await db.query('SELECT user_id FROM requests WHERE id = ?', [id]);
    if (requests.length === 0) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    if (requests[0].user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You can only delete your own requests.' });
    }

    await db.query('DELETE FROM requests WHERE id = ?', [id]);
    res.json({ message: 'Request deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed.' });
  }
});

module.exports = router;
