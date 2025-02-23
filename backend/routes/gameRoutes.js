const express = require("express");
const singleGameController = require("../controllers/singleGameController");
const tournamentController = require("../controllers/tournamentController");

const router = express.Router();

router.post("/post-finished-game", (req, res) => {
  console.log("Daten erhalten:", req.body);

  if (req.body.mode === 0) {
    singleGameController.saveSingleGame(req.body);
  } else if (req.body.mode === 1) {
    tournamentController.saveTournamentGame(req.body);
  }

  res.json({ message: "Spiel gespeichert" });
});

module.exports = router;
