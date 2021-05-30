const { verify } = require("../utils/utils");
const db = require("../models/index");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const id = await verify(token);
    const user = await db.Users.findOne({ where: { id } });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).jsoon({ error: error.message });
  }
};
