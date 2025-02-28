const fs = require("fs").promises;
const path = require("path");

const singleMatchesFilePath = path.join(__dirname, "../data/singleMatch.json");

const saveSingleMatch = async (matchData) => {
  const newMatch = {
    player1: matchData.player1,
    player2: matchData.player2,
    winner: matchData.winner,
    points: matchData.points,
    legs: matchData.legs,
    date: Date.now(),
  };
  let singleMatches = [];
  const data = await fs.readFile(singleMatchesFilePath, "utf8");
  singleMatches = JSON.parse(data);
  singleMatches.push(newMatch);
  await fs.writeFile(
    singleMatchesFilePath,
    JSON.stringify(singleMatches, null, 2)
  );
};

module.exports = { saveSingleMatch };
