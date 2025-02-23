const express = require("express");
const tournamentController = require("../controllers/tournamentController");

const router = express.Router();

module.exports = (io) => {
  router.post("/createTournament", async (req, res) => {
    try {
      const newTournament = await tournamentController.createTournament(
        req.body
      );

      // Nachricht an alle Clients senden
      io.emit("tournamentCreated", newTournament);

      res.json({
        success: true,
        message: "Turnier erfolgreich erstellt.",
        tournament: newTournament,
      });
    } catch (error) {
      console.error("Fehler beim Erstellen des Turniers:", error);
      res.json({
        success: false,
        message: "Interner Serverfehler.",
      });
    }
  });

  router.get("/openTournaments", async (req, res) => {
    try {
      const openTournaments = await tournamentController.openTournaments();
      res.json(openTournaments);
    } catch (error) {
      console.error("Fehler beim Abrufen der Turniere:", error);
      res.json({
        success: false,
        message: "Fehler beim Abrufen der Turniere.",
      });
    }
  });

  router.get("/:tournamentId", async (req, res) => {
    try {
      const tournament = await tournamentController.getTournamentById(
        req.params.tournamentId
      );
      res.json(tournament);
    } catch (error) {
      console.error("Fehler beim Abrufen des Turniers:", error);
      res.json({
        success: false,
        message: "Fehler beim Abrufen des Turniers.",
      });
    }
  });

  router.get(
    "/nextTournamentMatch/:tournamentId/:socketId",
    async (req, res) => {
      try {
        const nextMatch = await tournamentController.getNextMatch(
          req.params.tournamentId,
          req.params.socketId
        );
        if (typeof nextMatch !== "object") {
          io.to(nextMatch).emit("waitingForOtherGroup");
          res.json({
            success: false,
            message: "Andere Gruppe noch nicht fertig.",
          });
        } else {
          res.json(nextMatch);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen des Turniers:", error);
        res.json({
          success: false,
          message: "Fehler beim Abrufen des Turniers.",
        });
      }
    }
  );

  return router;
};
