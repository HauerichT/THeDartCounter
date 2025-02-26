const express = require("express");
const players = require("../data/players");

const router = express.Router();

// Route to get all players
router.get("/getPlayers", (req, res) => {
  res.json({
    success: true,
    message: "Spieler erfolgreich abgerufen!",
    data: players,
  });
});

module.exports = router;
