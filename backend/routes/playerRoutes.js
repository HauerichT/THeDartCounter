const express = require("express");
const players = require("../data/players");

const router = express.Router();

router.get("/getPlayers", (req, res) => {
  try {
    res.json({
      success: true,
      message: "Spieler erfolgreich abgerufen!",
      data: players,
    });
  } catch (err) {
    console.error("Fehler beim Abrufen der Spieler:", err);
    res.json({
      success: false,
      message: "Fehler beim Abrufen der Spieler!",
      data: err,
    });
  }
});

module.exports = router;
