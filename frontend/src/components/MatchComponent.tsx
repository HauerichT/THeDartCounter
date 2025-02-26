import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid2,
  IconButton,
  TextField,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import SendIcon from "@mui/icons-material/Send";
import AdjustIcon from "@mui/icons-material/Adjust";
import {
  MatchData,
  MatchProps,
  MatchScores,
} from "../interfaces/matchInterfaces";
import { Player } from "../interfaces/playerInterfaces";
import { CustomDialogComponent, useDialog } from "./CustomDialogComponent";

export default function MatchComponent({
  matchData,
  points,
  legs,
  starter,
  onFinishedMatch,
}: MatchProps) {
  const { player1, player2 } = matchData;
  const [player1Points, setPlayer1Points] = useState<number>(points);
  const [player2Points, setPlayer2Points] = useState<number>(points);
  const [player1Legs, setPlayer1Legs] = useState<number>(0);
  const [player2Legs, setPlayer2Legs] = useState<number>(0);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(starter.id);
  const [currentLeg, setCurrentLeg] = useState<number>(1);
  const [scores, setScores] = useState<MatchScores[]>([]);
  const { dialog, setDialog, showDialog } = useDialog();

  const resetGame = () => {
    setPlayer1Points(points);
    setPlayer2Points(points);
    setPlayer1Legs(0);
    setPlayer2Legs(0);
    setCurrentLeg(1);
    setScores([]);
    setCurrentPlayerId(starter.id);
  };

  const handleResult = (winner: Player) => {
    const updatedMatch: MatchData = {
      ...matchData,
      winner,
    };

    showDialog(
      `Spiel beendet. ${winner?.name} hat gewonnen!`,
      "success",
      () => {
        onFinishedMatch(updatedMatch);
        resetGame();
      }
    );
  };

  const handleScoreSubmit = (score: number) => {
    if (score < 0 || score > 180) {
      showDialog(
        `${score} ist ein ungültiger Wurf! Punkte können nur zwischen einschließlich 0 und 180 liegen.`,
        "error"
      );
      return;
    }

    const isPlayer1 = currentPlayerId === player1.id;
    const currentPoints = isPlayer1 ? player1Points : player2Points;
    const newPoints = currentPoints - score;

    if (newPoints < 0 || newPoints === 1) {
      showDialog(
        `${score} ist ein ungültiger Wurf! Es muss auf 0 mit einem Doppelfeld beendet werden.`,
        "error"
      );
      return;
    }

    if (newPoints === 0) {
      if (isPlayer1) {
        setPlayer1Legs((prev) => {
          const newLegs = prev + 1;
          return newLegs;
        });
      } else {
        setPlayer2Legs((prev) => {
          const newLegs = prev + 1;
          return newLegs;
        });
      }
      resetLeg();
    } else {
      if (isPlayer1) {
        setPlayer1Points(newPoints);
      } else {
        setPlayer2Points(newPoints);
      }
      setCurrentPlayerId(isPlayer1 ? player2.id : player1.id);
    }

    setScores((prevScores) => [
      ...prevScores,
      {
        player1points: player1Points,
        player2points: player2Points,
        winner: newPoints === 0,
        currentPlayerId,
      },
    ]);
  };

  const resetLeg = () => {
    setPlayer1Points(points);
    setPlayer2Points(points);
    setCurrentLeg((prev) => prev + 1);
    setCurrentPlayerId(
      currentLeg % 2 === 0
        ? starter.id
        : starter.id === player1.id
        ? player2.id
        : player1.id
    );
  };

  const handleUndo = () => {
    if (scores.length === 0) return;

    const lastScore = scores[scores.length - 1];
    setScores(scores.slice(0, -1));
    setPlayer1Points(lastScore.player1points);
    setPlayer2Points(lastScore.player2points);

    if (lastScore.winner) {
      if (lastScore.currentPlayerId === player1.id) {
        setPlayer1Legs((prev) => Math.max(0, prev - 1));
      } else {
        setPlayer2Legs((prev) => Math.max(0, prev - 1));
      }
    }
    setCurrentPlayerId(lastScore.currentPlayerId);
  };

  const handleScoreInput = () => {
    const input = document.querySelector("#scoreInput") as HTMLInputElement;
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      handleScoreSubmit(value);
    }
    input.value = "";
  };

  useEffect(() => {
    if (player1Legs === legs) {
      handleResult(player1);
    } else if (player2Legs === legs) {
      handleResult(player2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player1Legs, player2Legs, legs]);

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <Container>
        {/* Spieler 1 */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "lightblue",
            marginBottom: "1rem",
          }}
        >
          <Grid2 container>
            <Grid2 size={4}>
              {currentPlayerId === player1.id && <AdjustIcon />}
              <Typography variant="h4">{player1.name}</Typography>
              <Typography sx={{ marginLeft: "0.5rem" }}>
                {player1Legs}
              </Typography>
            </Grid2>
            <Grid2 size={4}>
              <Typography variant="h4">{player1Points}</Typography>
            </Grid2>
            <Grid2 size={4}>
              <Typography variant="h4">Average</Typography>
            </Grid2>
          </Grid2>
        </Box>

        {/* Spieler 2 */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "lightblue",
            marginBottom: "1rem",
          }}
        >
          <Grid2 container>
            <Grid2 size={4}>
              {currentPlayerId === player2.id && <AdjustIcon />}
              <Typography variant="h4">{player2.name}</Typography>
              <Typography sx={{ marginLeft: "0.5rem" }}>
                {player2Legs}
              </Typography>
            </Grid2>
            <Grid2 size={4}>
              <Typography variant="h4">{player2Points}</Typography>
            </Grid2>
            <Grid2 size={4}>
              <Typography variant="h4">Average</Typography>
            </Grid2>
          </Grid2>
        </Box>

        {/* Eingabebereich für Score und Steuerungen */}
        <Box sx={{ width: "100%", marginTop: "2rem" }}>
          <Grid2
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            {/* Undo Button */}
            <Grid2 size={2}>
              <IconButton onClick={handleUndo} disabled={scores.length === 0}>
                <UndoIcon />
              </IconButton>
            </Grid2>

            {/* Score Eingabefeld */}
            <Grid2 size={8}>
              <TextField
                id="scoreInput"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 1, max: 180 } }}
              />
            </Grid2>

            {/* Senden Button */}
            <Grid2 size={2}>
              <IconButton onClick={handleScoreInput}>
                <SendIcon />
              </IconButton>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </>
  );
}
