const express = require("express");
const singleMatchController = require("../controllers/singleMatchController");
const tournamentController = require("../controllers/tournamentController");
const MatchMode = require("../interfaces/matchInterface");

const router = express.Router();

router.post("/postFinishedSingleMatch", async (req, res) => {
  try {
    await singleMatchController.saveSingleMatch(req.body);
    res.json({
      success: true,
      message: "Spiel erfolgreich gespeichert!",
      data: null,
    });
  } catch (err) {
    console.error("Fehler beim Speichern des Spiels:", err);
    res.json({
      success: false,
      message: "Fehler beim Speichern des Spiels!",
      data: err,
    });
  }
});

module.exports = router;
