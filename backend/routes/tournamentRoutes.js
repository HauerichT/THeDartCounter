const express = require("express");
const tournamentController = require("../controllers/tournamentController");

const router = express.Router();

module.exports = (io) => {
  router.post("/postCreateTournament", async (req, res) => {
    try {
      const newTournament = await tournamentController.postCreateTournament(
        req.body
      );

      io.emit("tournamentCreated", newTournament);

      res.json({
        success: true,
        message: "Turnier erfolgreich erstellt!",
        data: newTournament,
      });
    } catch (err) {
      console.error("Fehler beim Erstellen des Turniers:", err);
      res.json({
        success: false,
        message: "Fehler beim Erstellen des Turniers!",
        data: err,
      });
    }
  });

  router.get("/getOpenTournaments", async (req, res) => {
    try {
      const openTournaments = await tournamentController.getOpenTournaments();

      res.json({
        success: true,
        message: "Offene Turniere erfolgreich abgerufen!",
        data: openTournaments,
      });
    } catch (err) {
      console.error("Fehler beim Abrufen der offenen Turniere:", err);
      res.json({
        success: false,
        message: "Fehler beim Abrufen der offenen Turniere!",
        data: err,
      });
    }
  });

  router.get("/getTournamentById/:tournamentId", async (req, res) => {
    try {
      const tournament = await tournamentController.getTournamentById(
        req.params.tournamentId
      );

      res.json({
        success: true,
        message: "Turnier erfolgreich abgerufen!",
        data: tournament,
      });
    } catch (err) {
      console.error("Fehler beim Abrufen des Turniers:", err);
      res.json({
        success: false,
        message: "Fehler beim Abrufen des Turniers!",
        data: err,
      });
    }
  });

  router.get(
    "/getTournamentMatch/:tournamentId/:socketId",
    async (req, res) => {
      try {
        const match = await tournamentController.getTournamentMatch(
          req.params.tournamentId,
          req.params.socketId
        );

        res.json({
          success: true,
          message: "Spiel erfolgreich abgerufen!",
          data: match,
        });
      } catch (err) {
        console.error("Fehler beim Abrufen des nächsten Spiels:", err);
        res.json({
          success: false,
          message: "Fehler beim Abrufen des nächsten Spiels!",
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
        await tournamentController.getTournamentStageLegs(
          req.params.tournamentId
        );

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
        await tournamentController.getTournamentStagePoints(
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

        const isStageFinished =
          await tournamentController.updateStageIfFinished(
            req.params.tournamentId
          );

        if (isStageFinished) {
          io.to(`tournament_${req.params.tournamentId}`).emit(
            "changedStage",
            await tournamentController.getTournamentStatus(
              req.params.tournamentId
            )
          );
        }

        res.json({
          success: true,
          message: "Spiel erfolgreich gespeichert!",
          data: isStageFinished,
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

  router.get(
    "/getTournamentGroupStageRanking/:tournamentId/:socketId",
    async (req, res) => {
      try {
        const tournamentGroupStageRanking =
          await tournamentController.getTournamentGroupStageRanking(
            req.params.tournamentId,
            req.params.socketId
          );

        res.json({
          success: true,
          message: "Aktuelle Tabelle erfolgreich abgerufen!",
          data: tournamentGroupStageRanking,
        });
      } catch (err) {
        console.error("Fehler beim Abrufen der aktuellen Tabelle:", err);
        res.json({
          success: false,
          message: "Fehler beim Abrufen der aktuellen Tabelle!",
          data: err,
        });
      }
    }
  );

  return router;
};
