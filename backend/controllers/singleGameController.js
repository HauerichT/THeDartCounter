const fs = require("fs").promises;
const path = require("path");

const singleGamesFilePath = path.join(__dirname, "../data/singleGames.json");

const saveSingleGame = async (gameData, res) => {
  const newGame = {
    player1: gameData.player1,
    player2: gameData.player2,
    winner: gameData.winner,
    points: gameData.points,
    legs: gameData.legs,
    date: Date.now(),
  };

  let singleGames = [];

  const data = await fs.readFile(singleGamesFilePath, "utf8");
  singleGames = JSON.parse(data);

  singleGames.push(newGame);

  await fs.writeFile(singleGamesFilePath, JSON.stringify(singleGames, null, 2));
};

module.exports = { saveSingleGame };
