const fs = require("fs").promises;
const path = require("path");

const singleGamesFilePath = path.join(__dirname, "../data/singleMatch.json");

const saveSingleMatch = async (matchData) => {
  const newMatch = {
    player1: matchData.player1,
    player2: matchData.player2,
    winner: matchData.winner,
    points: matchData.points,
    legs: matchData.legs,
    date: Date.now(),
  };
  let singleGames = [];
  const data = await fs.readFile(singleGamesFilePath, "utf8");
  singleGames = JSON.parse(data);
  singleGames.push(newMatch);
  await fs.writeFile(singleGamesFilePath, JSON.stringify(singleGames, null, 2));
};

module.exports = { saveSingleMatch };
