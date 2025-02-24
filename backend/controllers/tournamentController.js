const fs = require("fs").promises;
const path = require("path");
const TournamentStatus = require("../interfaces/tournamentInterface");

const tournamentsFilePath = path.join(__dirname, "../data/tournaments.json");

// Funktion zum Mischen der Spieler (Fisher-Yates-Algorithmus)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Funktion zum Erstellen der Spiele (Jeder-gegen-Jeden auf einem festen Board)
const generateGroupMatches = (group, board) => {
  const matches = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      matches.push({
        player1: group[i],
        player2: group[j],
        board,
        winner: null,
      });
    }
  }
  return matches;
};

// Optimierte Funktion zur gleichmäßigen Verteilung der Spiele
const balanceMatches = (matches) => {
  const balanced = [];
  const lastPlayers = new Set();

  // Schleife, solange noch Spiele vorhanden sind
  while (matches.length > 0) {
    let foundMatch = false;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];

      // Prüfen, ob match definiert ist
      if (!match || !match.player1 || !match.player2) continue;

      // Prüfen, ob Spieler gerade gespielt haben
      if (!lastPlayers.has(match.player1) && !lastPlayers.has(match.player2)) {
        // Spiel hinzufügen
        balanced.push(match);

        // Zuletzt gespielte Spieler speichern
        lastPlayers.clear();
        lastPlayers.add(match.player1);
        lastPlayers.add(match.player2);

        // Spiel aus dem Array entfernen
        matches.splice(i, 1);
        foundMatch = true;
        break;
      }
    }

    // Falls kein gültiges Match gefunden wurde (Deadlock vermeiden)
    if (!foundMatch) {
      const match = matches.shift();
      if (match) {
        balanced.push(match);
        lastPlayers.clear();
        lastPlayers.add(match.player1);
        lastPlayers.add(match.player2);
      }
    }
  }

  return balanced;
};

const createTournament = async (tournamentCreationData) => {
  const {
    players,
    pointsGroup,
    pointsSemifinal,
    pointsFinal,
    legsGroup,
    legsSemifinal,
    legsFinal,
  } = tournamentCreationData;

  const shuffledPlayers = shuffleArray(players);
  const mid = Math.ceil(shuffledPlayers.length / 2);
  const groupA = shuffledPlayers.slice(0, mid);
  const groupB = shuffledPlayers.slice(mid);

  const groupMatchesA = generateGroupMatches(groupA, 1);
  const groupMatchesB = generateGroupMatches(groupB, 2);

  const balancedGroupMatchesA = balanceMatches(groupMatchesA);
  const balancedGroupMatchesB = balanceMatches(groupMatchesB);

  const newTournament = {
    id: Date.now(),
    board1SocketId: null,
    board2SocketId: null,
    players,
    pointsGroup,
    pointsSemifinal,
    pointsFinal,
    legsGroup,
    legsSemifinal,
    legsFinal,
    groups: {
      A: groupA,
      B: groupB,
    },
    matches: {
      groupStage: [...balancedGroupMatchesA, ...balancedGroupMatchesB],
      semiFinals: [
        { player1: null, player2: null, winner: null, board: 1 },
        { player1: null, player2: null, winner: null, board: 2 },
      ],
      final: { player1: null, player2: null, winner: null, board: 1 },
    },
    status: TournamentStatus.OPEN,
  };

  // Bestehende Turniere laden (Datei lesen)
  let tournaments = [];
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  tournaments = JSON.parse(data);

  // Neues Turnier hinzufügen und Datei aktualisieren
  tournaments.push(newTournament);
  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
  return newTournament;
};

const openTournaments = async () => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  const tournaments = JSON.parse(data);
  return tournaments.filter(
    (tournament) => tournament.status === TournamentStatus.OPEN
  );
};

const startTournament = async (tournamentId, room) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);

  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  tournament.status = TournamentStatus.GROUP_STAGE;
  tournament.board1SocketId = [...room][0];
  tournament.board2SocketId = [...room][1];

  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
};

const getTournamentStatus = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));
  return tournament.status;
};

const getTournamentStageMatches = async (tournamentId, socketId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));
  const currentBoard = tournament.board1SocketId === socketId ? 1 : 2;
  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    return tournament.matches.groupStage.filter(
      (match) => match.board === currentBoard
    );
  }
  if (tournament.status === TournamentStatus.SEMIFINALS_STAGE) {
    return tournament.matches.semiFinals.filter(
      (match) => match.board === currentBoard
    );
  }
  if (tournament.status === TournamentStatus.FINAL_STAGE) {
    return tournament.matches.final.filter(
      (match) => match.board === currentBoard
    );
  }
};

const tournamentStageLegs = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));
  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    return tournament.legsGroup;
  }
  if (tournament.status === TournamentStatus.SEMIFINALS_STAGE) {
    return tournament.legsSemifinal;
  }
  if (tournament.status === TournamentStatus.FINAL_STAGE) {
    return tournament.legsFinal;
  }
};

const tournamentStagePoints = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));
  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    return tournament.pointsGroup;
  }
  if (tournament.status === TournamentStatus.SEMIFINALS_STAGE) {
    return tournament.pointsSemifinal;
  }
  if (tournament.status === TournamentStatus.FINAL_STAGE) {
    return tournament.pointsFinal;
  }
};

const saveTournamentMatch = async (tournamentId, matchData) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  let matchList;
  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    matchList = tournament.matches.groupStage;
  } else if (tournament.status === TournamentStatus.SEMIFINALS_STAGE) {
    matchList = tournament.matches.semiFinals;
  } else if (tournament.status === TournamentStatus.FINAL_STAGE) {
    matchList = [tournament.matches.final];
  }

  const matchIndex = matchList.findIndex(
    (match) =>
      match.player1.id === matchData.player1.id &&
      match.player2.id === matchData.player2.id
  );
  matchList[matchIndex].winner = matchData.winner;

  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
};

const checkIfStageFinished = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  let matches;
  let allMatchesFinished = true;

  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    matches = tournament.matches.groupStage;
  } else if (tournament.status === TournamentStatus.SEMIFINALS_STAGE) {
    matches = tournament.matches.semiFinals;
  } else if (tournament.status === TournamentStatus.FINAL_STAGE) {
    matches = [tournament.matches.final];
  }

  for (const match of matches) {
    if (!match.winner) {
      allMatchesFinished = false;
      break;
    }
  }

  return allMatchesFinished;
};

module.exports = {
  createTournament,
  openTournaments,
  startTournament,
  getTournamentStageMatches,
  getTournamentStatus,
  tournamentStageLegs,
  tournamentStagePoints,
  saveTournamentMatch,
  checkIfStageFinished,
};
