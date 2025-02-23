import { Container } from "@mui/material";
import SingleGameSetup from "../components/SingleGame/SingleGameSetup";
import Game from "../components/Game/Game";
import { useState, useEffect } from "react";
import { GameData } from "../interfaces/gameInterface";
import { postFinishedGame } from "../apis/singleGameApi";

export default function SingleGame() {
  const [gameData, setGameData] = useState<GameData | null>(() => {
    const savedGameData = sessionStorage.getItem("singleGameData");
    return savedGameData ? JSON.parse(savedGameData) : null;
  });

  useEffect(() => {
    if (gameData) {
      sessionStorage.setItem("singleGameData", JSON.stringify(gameData));
    } else {
      sessionStorage.removeItem("singleGameData");
    }
  }, [gameData]);

  const startGame = (gameData: GameData) => {
    setGameData(gameData);
  };

  const handleGameFinished = async (gameData: GameData) => {
    try {
      await postFinishedGame(gameData);
      alert(`Spiel beendet! ${gameData.winner?.name} hat gewonnen!`);
      sessionStorage.removeItem("singleGameData");
      window.location.href = "/";
    } catch (error) {
      console.error("Fehler beim Speichern des Spiels:", error);
    }
  };

  return (
    <Container>
      {!gameData ? (
        <SingleGameSetup onStartGame={startGame} />
      ) : (
        <Game {...gameData} onGameFinished={handleGameFinished} />
      )}
    </Container>
  );
}
