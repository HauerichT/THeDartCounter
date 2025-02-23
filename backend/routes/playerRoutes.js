const express = require("express");
const players = require("../data/players");

const router = express.Router();

// Route to get all players
router.get("/get-players", (req, res) => {
  res.json(players);
});

module.exports = router;
