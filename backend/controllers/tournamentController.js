const fs = require("fs").promises;
const path = require("path");
const TournamentStatus = require("../interfaces/tournamentInterface");

const tournamentsFilePath = path.join(__dirname, "../data/tournaments.json");

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

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

const balanceMatches = (matches) => {
  const balanced = [];
  const lastPlayers = new Set();

  while (matches.length > 0) {
    let foundMatch = false;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];

      if (!match || !match.player1 || !match.player2) continue;

      if (!lastPlayers.has(match.player1) && !lastPlayers.has(match.player2)) {
        balanced.push(match);

        lastPlayers.clear();
        lastPlayers.add(match.player1);
        lastPlayers.add(match.player2);

        matches.splice(i, 1);
        foundMatch = true;
        break;
      }
    }

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

const postCreateTournament = async (tournamentData) => {
  const {
    players,
    pointsGroupStage,
    pointsSemifinalStage,
    pointsFinalStage,
    legsGroupStage,
    legsSemifinalStage,
    legsFinalStage,
  } = tournamentData;

  const shuffledPlayers = shuffleArray(players);
  const mid = Math.ceil(shuffledPlayers.length / 2);
  const group1 = shuffledPlayers.slice(0, mid);
  const group2 = shuffledPlayers.slice(mid);

  const group1Matches = generateGroupMatches(group1, 1);
  const group2Matches = generateGroupMatches(group2, 2);

  const balancedGroup1Matches = balanceMatches(group1Matches);
  const balancedGroup2Matches = balanceMatches(group2Matches);

  const newTournament = {
    id: Date.now(),
    board1SocketId: null,
    board2SocketId: null,
    players,
    pointsGroupStage,
    pointsSemifinalStage,
    pointsFinalStage,
    legsGroupStage,
    legsSemifinalStage,
    legsFinalStage,
    groups: {
      group1: groupA,
      group2: groupB,
    },
    matches: {
      groupStage: [...balancedGroup1Matches, ...balancedGroup2Matches],
      semifinalStage: [
        { player1: null, player2: null, winner: null, board: 1 },
        { player1: null, player2: null, winner: null, board: 2 },
      ],
      finalStage: { player1: null, player2: null, winner: null, board: 1 },
    },
    status: TournamentStatus.OPEN,
  };

  let tournaments = [];
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  tournaments = JSON.parse(data);
  tournaments.push(newTournament);
  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));

  return newTournament;
};

const getOpenTournaments = async () => {
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
  if (tournament.status === TournamentStatus.SEMIFINAL_STAGE) {
    return tournament.matches.semifinalStage.filter(
      (match) => match.board === currentBoard
    );
  }
  if (tournament.status === TournamentStatus.FINAL_STAGE) {
    if (tournament.matches.finalStage.board === currentBoard) {
      return tournament.matches.finalStage;
    }
    return [];
  }
};

const getTournamentStageLegs = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));
  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    return tournament.legsGroupStage;
  }
  if (tournament.status === TournamentStatus.SEMIFINAL_STAGE) {
    return tournament.legsSemifinalStage;
  }
  if (tournament.status === TournamentStatus.FINAL_STAGE) {
    return tournament.legsFinalStage;
  }
};

const getTournamentStagePoints = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));
  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    return tournament.pointsGroupStage;
  }
  if (tournament.status === TournamentStatus.SEMIFINAL_STAGE) {
    return tournament.pointsSemifinalStage;
  }
  if (tournament.status === TournamentStatus.FINAL_STAGE) {
    return tournament.pointsFinalStage;
  }
};

const saveTournamentMatch = async (tournamentId, matchData) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  let matchList;
  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    matchList = tournament.matches.groupStage;
  } else if (tournament.status === TournamentStatus.SEMIFINAL_STAGE) {
    matchList = tournament.matches.semifinalStage;
  } else if (tournament.status === TournamentStatus.FINAL_STAGE) {
    matchList = [tournament.matches.finalStage];
  }

  const matchIndex = matchList.findIndex(
    (match) =>
      match.player1.id === matchData.player1.id &&
      match.player2.id === matchData.player2.id
  );
  matchList[matchIndex].winner = matchData.winner;

  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
};

const calculateGroupStageTable = async (groupMatches, group) => {
  const scores = {};
  group.forEach(
    (player) =>
      (scores[player.id] = {
        id: player.id,
        name: player.name,
        wins: 0,
        directWins: {},
      })
  );

  groupMatches.forEach((match) => {
    const winnerId = match.winner.id;
    scores[winnerId].wins++;

    const loserId =
      match.player1.id === winnerId ? match.player2.id : match.player1.id;
    scores[winnerId].directWins[loserId] =
      (scores[winnerId].directWins[loserId] || 0) + 1;
  });

  const ranking = Object.values(scores)
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.directWins[a.id] || 0) - (a.directWins[b.id] || 0);
    })
    .map(({ id, name }) => ({ id, name }));
  return ranking;
};

const setupSemifinalStage = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  tournament.status = TournamentStatus.SEMIFINAL_STAGE;

  const matchesGroup1 = tournament.matches.groupStage.filter(
    (match) => match.board === 1
  );
  const tableGroup1 = await calculateGroupStageTable(
    matchesGroup1,
    tournament.groups.group1
  );

  const matchesGroup2 = tournament.matches.groupStage.filter(
    (match) => match.board === 2
  );
  const tableGroupB = await calculateGroupStageTable(
    matchesGroup2,
    tournament.groups.group2
  );

  tournament.matches.semifinalStage[0].player1 = tableGroup1[1];
  tournament.matches.semifinalStage[0].player2 = tableGroupB[0];
  tournament.matches.semifinalStage[1].player1 = tableGroupB[1];
  tournament.matches.semifinalStage[1].player2 = tableGroup1[0];

  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
};

const setupFinalStage = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  tournament.status = TournamentStatus.FINAL_STAGE;

  tournament.matches.finalStage.player1 =
    tournament.matches.semifinalStage[0].winner;
  tournament.matches.finalStage.player2 =
    tournament.matches.semifinalStage[1].winner;

  await fs.writeFile(tournamentsFilePath, JSON.stringify(tournaments, null, 2));
};

const updateStageIfFinished = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  let matches;
  let isStageFinished = true;

  if (tournament.status === TournamentStatus.GROUP_STAGE) {
    matches = tournament.matches.groupStage;
  } else if (tournament.status === TournamentStatus.SEMIFINAL_STAGE) {
    matches = tournament.matches.semifinalStage;
  } else if (tournament.status === TournamentStatus.FINAL_STAGE) {
    matches = [tournament.matches.finalStage];
  }

  for (const match of matches) {
    if (!match.winner) {
      isStageFinished = false;
      break;
    }
  }

  if (isStageFinished) {
    if (tournament.status === TournamentStatus.GROUP_STAGE) {
      await setupSemifinalStage(Number(tournamentId));
    } else if (tournament.status === TournamentStatus.SEMIFINAL_STAGE) {
      await setupFinalStage(Number(tournamentId));
    } else if (tournament.status === TournamentStatus.FINAL_STAGE) {
      tournament.status = TournamentStatus.FINISHED;
    }
  }

  return isStageFinished;
};

module.exports = {
  postCreateTournament,
  getOpenTournaments,
  startTournament,
  getTournamentStageMatches,
  getTournamentStatus,
  getTournamentStageLegs,
  getTournamentStagePoints,
  saveTournamentMatch,
  updateStageIfFinished,
};
