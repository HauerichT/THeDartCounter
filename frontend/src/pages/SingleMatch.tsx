import { Container } from "@mui/material";
import SingleGameSetup from "../components/SingleGame/SingleGameSetup";
import Match from "../components/Match/Match";
import { useState, useEffect } from "react";
import { MatchData } from "../interfaces/matchInterface";
import { postFinishedSingleMatch } from "../apis/singleMatchApi";

export default function SingleGame() {
  const [match, setMatch] = useState<MatchData>(() => {
    const savedGameData = sessionStorage.getItem("singleMatchData");
    return savedGameData ? JSON.parse(savedGameData) : null;
  });

  useEffect(() => {
    if (match) {
      sessionStorage.setItem("singleMatchData", JSON.stringify(match));
    } else {
      sessionStorage.removeItem("singleMatchData");
    }
  }, [match]);

  const startMatch = (matchData: MatchData) => {
    setMatch(matchData);
  };

  const handleFinishedMatch = async (matchData: MatchData) => {
    try {
      await postFinishedSingleMatch(matchData);
      alert(`Spiel beendet! ${matchData.winner?.name} hat gewonnen!`);
      sessionStorage.removeItem("singleGameData");
      window.location.href = "/";
    } catch (error) {
      console.error("Fehler beim Speichern des Spiels:", error);
    }
  };

  return (
    <Container>
      {!match ? (
        <SingleGameSetup onStartMatch={startMatch} />
      ) : (
        <Match
          key={match.player1.id + "-" + match.player2.id}
          {...match}
          points={points}
          legs={legs}
          starter={matches[0].player1}
          onFinishedMatch={handleFinishedMatch}
        />
      )}
    </Container>
  );
}
