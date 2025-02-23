const fs = require("fs").promises;
const path = require("path");

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

  console.log(players);

  // Spieler mischen und in zwei Gruppen aufteilen
  const shuffledPlayers = shuffleArray(players);
  const mid = Math.ceil(shuffledPlayers.length / 2);
  const groupA = shuffledPlayers.slice(0, mid);
  const groupB = shuffledPlayers.slice(mid);

  // Gruppen-Spiele generieren (Gruppe A auf Board 1, Gruppe B auf Board 2)
  const groupMatchesA = generateGroupMatches(groupA, 1);
  const groupMatchesB = generateGroupMatches(groupB, 2);

  // Spiele ausbalancieren (abwechselnde Spieler sicherstellen)
  const balancedGroupMatchesA = balanceMatches(groupMatchesA);
  const balancedGroupMatchesB = balanceMatches(groupMatchesB);

  // Neues Turnier-Objekt
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
    status: "open",
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
  return tournaments.filter((tournament) => tournament.status === "open");
};

const getTournamentById = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  const tournaments = JSON.parse(data);
  return tournaments.find(
    (tournament) => tournament.id === Number(tournamentId)
  );
};

const startTournament = async (tournamentId, room) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);

  console.log(room);

  // Turnier anhand der ID finden
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  // Status aktualisieren
  tournament.status = "groupStage";
  tournament.board1SocketId = [...room][0];
  tournament.board2SocketId = [...room][1];

  // Datei mit aktualisierten Turnieren speichern
  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
};

const calculateTabelOfGroup = (groupWinners) => {
  let playerWins = {};
  console.log(groupWinners);
};

const getNextMatch = async (tournamentId, socketId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);

  // Turnier anhand der ID finden
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));
  const currentBoard = tournament.board1SocketId === socketId ? 1 : 2;
  const otherBoard = tournament.board1SocketId === socketId ? 2 : 1;
  const pointsGroup = tournament.pointsGroup;
  const legsGroup = tournament.legsGroup;
  const pointsSemifinal = tournament.pointsSemifinal;
  const legsSemifinal = tournament.legsSemifinal;
  const pointsFinal = tournament.pointsFinal;
  const legsFinal = tournament.legsFinal;

  if (tournament.status === "groupStage") {
    const players = tournament.matches.groupStage.find(
      (match) => match.board === currentBoard && match.winner === null
    );

    if (!players) {
      // Check if  other board finished
      const openMatchesOtherBoard = tournament.matches.groupStage.find(
        (match) => match.board === otherBoard && match.winner === null
      );
      if (openMatchesOtherBoard) {
        return tournament.board1SocketId === socketId
          ? tournament.board2SocketId
          : tournament.board1SocketId;
      }

      tournament.status = "semiFinals";
      const groupMatchWinners = tournament.matches.groupStage.find(
        (match) => match.board === currentBoard && match.winner !== null
      );
      const tableGroup = calculateTabelOfGroup(groupMatchWinners);

      const otherGroupMatchWinners = tournament.matches.groupStage.find(
        (match) => match.board === otherBoard && match.winner !== null
      );
      const tableOtherGroup = calculateTabelOfGroup(otherGroupMatchWinners);
      // TODO: Save Players in Semifinal
      //TODO: Build func to calculate table of group
      //TODO: Build func to get all matches of group

      await fs.writeFile(
        tournamentsFilePath,
        JSON.stringify(tournaments, null, 2)
      );
      getNextMatch(tournamentId, socketId);
    }
    return { players, pointsGroup, legsGroup };
  } else if (tournament.status === "semiFinals") {
    const players = tournament.matches.semiFinals.find(
      (match) => match.board === currentBoard && match.winner === null
    );
    if (!players) {
      tournament.status = "final";

      // TODO: Save Players in Final

      await fs.writeFile(
        tournamentsFilePath,
        JSON.stringify(tournaments, null, 2)
      );
      getNextMatch(tournamentId, socketId);
    }
    return { players, pointsSemifinal, legsSemifinal };
  } else if (tournament.status === "final") {
    const players = tournament.matches.final;
    if (!players) {
      tournament.status = "finished";

      await fs.writeFile(
        tournamentsFilePath,
        JSON.stringify(tournaments, null, 2)
      );
      console.log("TUNIER BEENDET");
      return;
    }
    return { players, pointsFinal, legsFinal };
  }
};

const saveTournamentGame = async (gameData) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);

  const tournament = tournaments.find(
    (t) => t.id === Number(gameData.tournamentId)
  );

  let match;
  if (tournament.status === "groupStage") {
    match = tournament.matches.groupStage.find(
      (m) =>
        m.player1.id === gameData.player1.id &&
        m.player2.id === gameData.player2.id &&
        m.winner === null
    );
  } else if (tournament.status === "semiFinals") {
    match = tournament.matches.semiFinals.find(
      (m) =>
        m.player1.id === gameData.player1.id &&
        m.player2.id === gameData.player2.id &&
        m.winner === null
    );
  } else if (tournament.status === "final") {
    match = tournament.matches.final;
  }
  match.winner = gameData.winner;

  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
};

module.exports = {
  createTournament,
  openTournaments,
  getTournamentById,
  startTournament,
  getNextMatch,
  saveTournamentGame,
};
