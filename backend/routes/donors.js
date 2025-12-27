const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, checkBlocked } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, blood_group, district, city, phone, available, last_donated FROM donors ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", verifyToken, checkBlocked, async (req, res) => {
  const { name, blood_group, district, city, phone, available, last_donated } =
    req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO donors (name, blood_group, district, city, phone, available, last_donated) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        blood_group,
        district,
        city,
        phone,
        available ? 1 : 0,
        last_donated || null,
      ]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// PUT /api/donors/:id - Update donor listing (owner only)
router.put("/:id", verifyToken, checkBlocked, async (req, res) => {
  const { id } = req.params;
  const { blood_group, district, city, phone, available, last_donated } = req.body;

  try {
    // Check ownership
    const [donors] = await db.query('SELECT user_id FROM donors WHERE id = ?', [id]);
    if (donors.length === 0) {
      return res.status(404).json({ error: 'Donor listing not found.' });
    }
    if (donors[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own listings.' });
    }

    await db.query(
      'UPDATE donors SET blood_group = ?, district = ?, city = ?, phone = ?, available = ?, last_donated = ? WHERE id = ?',
      [blood_group, district, city, phone, available ? 1 : 0, last_donated || null, id]
    );
    res.json({ message: 'Donor listing updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

// DELETE /api/donors/:id - Delete donor listing (owner only)
router.delete("/:id", verifyToken, checkBlocked, async (req, res) => {
  const { id } = req.params;

  try {
    // Check ownership
    const [donors] = await db.query('SELECT user_id FROM donors WHERE id = ?', [id]);
    if (donors.length === 0) {
      return res.status(404).json({ error: 'Donor listing not found.' });
    }
    if (donors[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own listings.' });
    }

    await db.query('DELETE FROM donors WHERE id = ?', [id]);
    res.json({ message: 'Donor listing deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed.' });
  }
});

module.exports = router;
