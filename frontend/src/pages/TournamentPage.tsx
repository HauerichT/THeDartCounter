import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { getNextTournamentMatch } from "../apis/tournamentApi";
import Game from "../components/Game/Game";
import { GameData, MatchMode } from "../interfaces/gameInterface";
import { Player } from "../interfaces/playerInterface";
import { postFinishedGame } from "../apis/singleGameApi";
import socket from "../utils/socket";

export default function TournamentPage() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [match, setMatch] = useState<GameData | null>(null);
  const [waitingForOtherGroup, setWaitingForOtherGroup] =
    useState<boolean>(false);

  useEffect(() => {
    getNextMatch();

    socket.on("waitingForOtherGroup", () => {
      setWaitingForOtherGroup(true);
    });

    return () => {
      socket.off("waitingForOtherGroup");
    };
  }, []);

  const getNextMatch = async () => {
    if (waitingForOtherGroup) return;

    try {
      const nextMatch = await getNextTournamentMatch(Number(tournamentId));
      if (!nextMatch) {
        setWaitingForOtherGroup(true);
        return;
      }
      setMatch({
        tournamentId: Number(tournamentId),
        player1: nextMatch.players.player1 as Player,
        player2: nextMatch.players.player2 as Player,
        points: nextMatch.pointsGroup,
        legs: nextMatch.legsGroup,
        starter: nextMatch.players.player1 as Player,
        mode: MatchMode.TOURNAMENT_MATCH,
        winner: null,
      });
    } catch (error) {
      console.error("Fehler beim Abrufen des nächsten Spiels:", error);
    }
  };

  const handleGameFinished = async (gameData: GameData) => {
    try {
      await postFinishedGame(gameData);
      alert(`Spiel beendet! ${gameData.winner?.name} hat gewonnen!`);
    } catch (error) {
      console.error("Fehler beim Abschließen des Spiels:", error);
    }
  };

  return match ? (
    <Game
      key={match?.player1.id + "-" + match?.player2.id}
      {...match}
      onGameFinished={handleGameFinished}
    />
  ) : (
    <Typography>
      {waitingForOtherGroup
        ? "Warten auf andere Gruppen..."
        : "Warten auf nächstes Match..."}
    </Typography>
  );
}
