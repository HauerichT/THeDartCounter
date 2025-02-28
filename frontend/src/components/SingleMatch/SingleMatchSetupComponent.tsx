import {
  Button,
  Container,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MatchData } from "../../interfaces/matchInterfaces";
import { getPlayers } from "../../apis/playersApi";
import { Player } from "../../interfaces/playerInterfaces";
import { CustomDialogComponent, useDialog } from "../CustomDialogComponent";

export default function SingleMatchSetupComponent({
  onStartMatch,
}: {
  onStartMatch: (matchData: MatchData) => void;
}) {
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [legs, setLegs] = useState<number>(1);
  const [points, setPoints] = useState<number>(501);
  const [starter, setStarter] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const { dialog, setDialog, showDialog } = useDialog();

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlayers = async () => {
    const resPlayers = await getPlayers();
    if (!resPlayers.success) {
      showDialog(resPlayers.message, "error");
      return;
    } else {
      setPlayers(resPlayers.data);
    }
  };

  function handleStartGame() {
    if (!player1 || !player2) {
      showDialog("Bitte zwei Spieler auswählen!", "error");
      return;
    }
    if (player1.id === player2.id) {
      showDialog("Bitte zwei unterschiedliche Spieler auswählen!", "error");
      return;
    }
    onStartMatch({
      player1: player1,
      player2: player2,
      points,
      legs,
      starter: starter || player1,
      winner: null,
    });
  }

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <Container maxWidth={false}>
        <Stack spacing={1} direction="column" mb={2}>
          <Typography>Spieler 1:</Typography>
          <Select
            value={player1 ? player1.id : ""}
            onChange={(e) =>
              setPlayer1(
                players.find(
                  (player) => player.id === Number(e.target.value)
                ) || null
              )
            }
          >
            {players.map((player) => (
              <MenuItem key={player.id} value={player.id}>
                {player.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack spacing={1} direction="column" mb={2}>
          <Typography>Spieler 2:</Typography>
          <Select
            value={player2 ? player2.id : ""}
            onChange={(e) =>
              setPlayer2(
                players.find(
                  (player) => player.id === Number(e.target.value)
                ) || null
              )
            }
          >
            {players.map((player) => (
              <MenuItem key={player.id} value={player.id}>
                {player.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {player1 && player2 && player1.id !== player2.id && (
          <Stack spacing={1} direction="column" mb={2}>
            <Typography>Starter:</Typography>
            <ToggleButtonGroup
              value={starter ? starter.id : ""}
              exclusive
              onChange={(_e, newStarterId) => {
                setStarter(
                  players.find((player) => player.id === newStarterId) || null
                );
              }}
            >
              {[player1, player2].map((player) => (
                <ToggleButton key={player.id} value={player.id}>
                  {player.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>
        )}

        <Stack spacing={1} direction="column" mb={2}>
          <Typography>Anzahl Legs:</Typography>
          <TextField
            type="number"
            value={legs}
            inputProps={{ min: 1 }}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setLegs(value);
            }}
          />
        </Stack>

        <Stack spacing={1} direction="column" mb={2}>
          <Typography>Anzahl Punkte pro Leg:</Typography>
          <ToggleButtonGroup
            value={points}
            exclusive
            onChange={(_e, newPoints) => {
              if (newPoints !== null) {
                setPoints(newPoints);
              }
            }}
          >
            {[301, 501].map((value) => (
              <ToggleButton key={value} value={value}>
                {value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack spacing={1} direction="column">
          <Button
            variant="contained"
            onClick={handleStartGame}
            disabled={!starter}
          >
            Starten
          </Button>
        </Stack>
      </Container>
    </>
  );
}
