const express = require("express");
const tournamentController = require("../controllers/tournamentController");

const router = express.Router();

module.exports = (io) => {
  router.post("/createTournament", async (req, res) => {
    try {
      const newTournament = await tournamentController.createTournament(
        req.body
      );

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
    "/getTournamentStageMatches/:tournamentId/:socketId",
    async (req, res) => {
      try {
        const stageMatches =
          await tournamentController.getTournamentStageMatches(
            req.params.tournamentId,
            req.params.socketId
          );
        res.json({
          success: true,
          message: "Spiele der aktuellen Phase erfolgreich abgerufen!",
          data: stageMatches,
        });
      } catch (err) {
        console.error("Fehler beim Abrufen der aktuellen Spiele:", err);
        res.json({
          success: false,
          message: "Fehler beim Abrufen der aktuellen Spiele!",
          data: err,
        });
      }
    }
  );

  router.get("/getTournamentStatus/:tournamentId", async (req, res) => {
    try {
      const tournamentStatus = await tournamentController.getTournamentStatus(
        req.params.tournamentId
      );
      res.json({
        success: true,
        message: "Tunierstatus erfolgreich abgerufen!",
        data: tournamentStatus,
      });
    } catch (err) {
      console.error("Fehler beim Abrufen des Tunierstatus:", err);
      res.json({
        success: false,
        message: "Fehler beim Abrufen des Tunierstatus!",
        data: err,
      });
    }
  });

  router.get("/getTournamentStageLegs/:tournamentId", async (req, res) => {
    try {
      const tournamentStageLegs =
        await tournamentController.tournamentStageLegs(req.params.tournamentId);
      res.json({
        success: true,
        message: "Anzahl der Legs erfolgreich abgerufen!",
        data: tournamentStageLegs,
      });
    } catch (err) {
      console.error("Fehler beim Abrufen der Anzahl der Legs:", err);
      res.json({
        success: false,
        message: "Fehler beim Abrufen der Anzahl der Legs!",
        data: err,
      });
    }
  });

  router.get("/getTournamentStagePoints/:tournamentId", async (req, res) => {
    try {
      const tournamentStagePoints =
        await tournamentController.tournamentStagePoints(
          req.params.tournamentId
        );
      res.json({
        success: true,
        message: "Anzahl der Points erfolgreich abgerufen!",
        data: tournamentStagePoints,
      });
    } catch (err) {
      console.error("Fehler beim Abrufen der Anzahl der Points:", err);
      res.json({
        success: false,
        message: "Fehler beim Abrufen der Anzahl der Points!",
        data: err,
      });
    }
  });

  router.post(
    "/postFinishedTournamentMatch/:tournamentId",
    async (req, res) => {
      try {
        await tournamentController.saveTournamentMatch(
          req.params.tournamentId,
          req.body
        );

        const isStageFinished = await tournamentController.checkIfStageFinished(
          req.params.tournamentId
        );

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
    }
  );

  return router;
};
