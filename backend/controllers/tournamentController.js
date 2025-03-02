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

const generateRoundRobinMatches = (players, board) => {
  let playersOfGroup = [...players];
  if (players.length % 2 !== 0) {
    playersOfGroup.push(null);
  }
  const n = playersOfGroup.length;
  const matches = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n / 2; j++) {
      const player1 = playersOfGroup[j];
      const player2 = playersOfGroup[n - 1 - j];

      if (player1 !== null && player2 !== null) {
        if (i % 2 === 0) {
          matches.push({
            player1: player1,
            player2: player2,
            board: board,
            winner: null,
          });
        } else {
          matches.push({
            player1: player2,
            player2: player1,
            board: board,
            winner: null,
          });
        }
      }
    }
    playersOfGroup = [
      playersOfGroup[0],
      playersOfGroup[n - 1],
      ...playersOfGroup.slice(1, n - 1),
    ];
  }

  return matches;
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

  const group1Matches = generateRoundRobinMatches(group1, 1);
  const group2Matches = generateRoundRobinMatches(group2, 2);

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
      group1: group1,
      group2: group2,
    },
    matches: {
      groupStage: [...group1Matches, ...group2Matches],
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

const calculateGroupStageRanking = async (groupMatches, group) => {
  const scores = {};
  group.forEach(
    (player) =>
      (scores[player.id] = {
        id: player.id,
        name: player.name,
        wins: 0,
      })
  );

  groupMatches.forEach((match) => {
    if (match.winner) {
      const winnerId = match.winner.id;
      scores[winnerId].wins++;
    }
  });

  const sortedScores = Object.values(scores).sort((p1, p2) => {
    if (p2.wins !== p1.wins) {
      return p2.wins - p1.wins;
    }

    const directMatch = groupMatches.find(
      (match) =>
        (match.player1.id === p1.id && match.player2.id === p2.id) ||
        (match.player1.id === p2.id && match.player2.id === p1.id)
    );

    if (directMatch && directMatch.winner) {
      if (directMatch.winner.id === p1.id) return -1;
      if (directMatch.winner.id === p2.id) return 1;
    }

    return 0;
  });

  return sortedScores;
};

const setupSemifinalStage = async (tournamentId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  tournament.status = TournamentStatus.SEMIFINAL_STAGE;

  const matchesGroup1 = tournament.matches.groupStage.filter(
    (match) => match.board === 1
  );
  const tableGroup1 = await calculateGroupStageRanking(
    matchesGroup1,
    tournament.groups.group1
  );

  const matchesGroup2 = tournament.matches.groupStage.filter(
    (match) => match.board === 2
  );
  const tableGroupB = await calculateGroupStageRanking(
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
      await fs.writeFile(
        tournamentsFilePath,
        JSON.stringify(tournaments, null, 2)
      );
    }
  }

  return isStageFinished;
};

const getTournamentGroupStageRanking = async (tournamentId, socketId) => {
  const data = await fs.readFile(tournamentsFilePath, "utf8");
  let tournaments = JSON.parse(data);
  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  const matchesGroup1 = tournament.matches.groupStage.filter(
    (match) => match.board === 1
  );
  const matchesGroup2 = tournament.matches.groupStage.filter(
    (match) => match.board === 2
  );

  const groupMatches =
    tournament.board1SocketId === socketId ? matchesGroup1 : matchesGroup2;
  const group =
    tournament.board1SocketId === socketId
      ? tournament.groups.group1
      : tournament.groups.group2;

  const table = await calculateGroupStageRanking(groupMatches, group);
  return table;
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
  getTournamentGroupStageRanking,
};
