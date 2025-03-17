const TournamentStatus = Object.freeze({
  OPEN: "Offen",
  LIGA_STAGE: "Ligaphase",
  GROUP_STAGE: "Gruppenphase",
  SEMIFINAL_STAGE: "Halbfinalphase",
  FINAL_STAGE: "Finalphase",
  FINISHED: "Beendet",
});

const TournamentMode = Object.freeze({
  KO: "KO-System",
  LIGA: "Liga-System",
});

module.exports = { TournamentStatus, TournamentMode };
