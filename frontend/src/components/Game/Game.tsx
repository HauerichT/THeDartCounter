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
import { useState } from "react";
import { GameData } from "../../interfaces/gameInterface";
import { Player } from "../../interfaces/playerInterface";

interface GameProps extends GameData {
  onGameFinished: (gameData: GameData) => void;
}

export default function Game({
  tournamentId,
  player1,
  player2,
  points,
  legs,
  starter,
  mode,
  onGameFinished,
}: GameProps) {
  const [player1Points, setPlayer1Points] = useState<number>(points);
  const [player2Points, setPlayer2Points] = useState<number>(points);
  const [player1Legs, setPlayer1Legs] = useState<number>(0);
  const [player2Legs, setPlayer2Legs] = useState<number>(0);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(
    starter?.id ?? player1.id
  );
  const [currentLeg, setCurrentLeg] = useState<number>(1);
  const [scores, setScores] = useState<
    {
      player1points: number;
      player2points: number;
      winner: boolean;
      currentPlayerId: number;
    }[]
  >([]);

  const resetGame = () => {
    setPlayer1Points(points);
    setPlayer2Points(points);
    setPlayer1Legs(0);
    setPlayer2Legs(0);
    setCurrentLeg(1);
    setScores([]);
    setCurrentPlayerId(starter?.id ?? player1.id);
  };

  const handleResult = async (winner: Player) => {
    const gameData: GameData = {
      tournamentId,
      player1,
      player2,
      points,
      legs,
      starter,
      mode,
      winner,
    };
    onGameFinished(gameData);
    resetGame();
  };

  const handleScoreSubmit = (score: number) => {
    if (score < 0 || score > 180) {
      return alert("Ungültiger Wurf!");
    }
    const isPlayer1 = currentPlayerId === player1.id;
    const currentPoints = isPlayer1 ? player1Points : player2Points;
    const newPoints = currentPoints - score;

    if (newPoints < 0 || newPoints === 1) {
      return alert(
        "Ungültiger Wurf! Du musst auf 0 mit einem Doppelfeld beenden."
      );
    }

    const updatePlayerScore = (
      player: Player,
      setPoints: (value: number) => void,
      setLegs: (value: number) => void,
      legsCount: number
    ) => {
      if (newPoints === 0) {
        if (legsCount + 1 === legs) {
          handleResult(player);
        }
        setLegs(legsCount + 1);
        resetLeg();
      } else {
        setPoints(newPoints);
        setCurrentPlayerId(isPlayer1 ? player2.id : player1.id);
      }
    };

    if (isPlayer1) {
      updatePlayerScore(player1, setPlayer1Points, setPlayer1Legs, player1Legs);
    } else {
      updatePlayerScore(player2, setPlayer2Points, setPlayer2Legs, player2Legs);
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
    setCurrentLeg(currentLeg + 1);

    if (currentLeg % 2 === 0) {
      setCurrentPlayerId(starter.id);
    } else {
      setCurrentPlayerId(starter.id === player1.id ? player2.id : player1.id);
    }
  };

  const handleUndo = () => {
    if (scores.length === 0) return;

    const lastScore = scores[scores.length - 1];
    setScores(scores.slice(0, -1));
    setPlayer1Points(lastScore.player1points);
    setPlayer2Points(lastScore.player2points);

    if (lastScore.winner) {
      if (lastScore.currentPlayerId === player1.id) {
        setPlayer1Legs(player1Legs - 1);
      } else {
        setPlayer2Legs(player2Legs - 1);
      }
    }
    setCurrentPlayerId(lastScore.currentPlayerId);
  };

  return (
    <Container>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "lightblue",
          marginBottom: "1rem",
        }}
      >
        <Grid2 container>
          <Grid2
            size={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {currentPlayerId === player1.id && <AdjustIcon />}
            <Typography variant="h4">{player1.name}</Typography>
            <Typography sx={{ marginLeft: "0.5rem" }}>{player1Legs}</Typography>
          </Grid2>
          <Grid2
            size={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4">{player1Points}</Typography>
          </Grid2>
          <Grid2
            size={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4">Average</Typography>
          </Grid2>
        </Grid2>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "lightblue",
          marginBottom: "1rem",
        }}
      >
        <Grid2 container>
          <Grid2
            size={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {currentPlayerId === player2.id && <AdjustIcon />}
            <Typography variant="h4">{player2.name}</Typography>
            <Typography sx={{ marginLeft: "0.5rem" }}>{player2Legs}</Typography>
          </Grid2>
          <Grid2
            size={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4">{player2Points}</Typography>
          </Grid2>
          <Grid2
            size={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h4">Average</Typography>
          </Grid2>
        </Grid2>
      </Box>

      <Box sx={{ width: "100%", marginTop: "2rem" }}>
        <Grid2
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid2 size={2} display="flex" justifyContent="center">
            <IconButton onClick={handleUndo} disabled={scores.length === 0}>
              <UndoIcon />
            </IconButton>
          </Grid2>

          <Grid2 size={8}>
            <TextField
              type="number"
              fullWidth
              InputProps={{ inputProps: { min: 1, max: 180 } }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = parseInt((e.target as HTMLInputElement).value);
                  if (!isNaN(value)) handleScoreSubmit(value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </Grid2>
          <Grid2 size={2} display="flex" justifyContent="center">
            <IconButton
              onClick={() => {
                const input = document.querySelector(
                  "input"
                ) as HTMLInputElement;
                const value = parseInt(input?.value);
                if (!isNaN(value)) handleScoreSubmit(value);
                input.value = "";
              }}
            >
              <SendIcon />
            </IconButton>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
}
