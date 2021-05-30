const router = require("express").Router();
const db = require("../models/index");
const bcrypt = require("bcrypt");
const { sign } = require("../utils/utils");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await db.Users.create({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hash,
    });

    const token = await sign(user.id, process.env.SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await db.Users.findOne({
      where: { email: req.body.email.toLowerCase() },
    });

    const verified = await bcrypt.compare(req.body.password, user.password);

    if (verified) {
      const token = await sign(user.id, process.env.SECRET);
      res.status(200).json({ token });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    if (req.body.id === req.user.id) {
      const user = await db.Users.findOne({ where: { id: req.body.id } });
      Object.keys(req.body.body).forEach(
        (key) => (user[key] = req.body.body[key])
      );
      user.save();
      res.status(200).json({ user });
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
