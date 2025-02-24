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
import { MatchMode } from "../../interfaces/matchInterface";
import { getPlayers } from "../../apis/playersApi";
import { Player } from "../../interfaces/playerInterface";

export default function SingleGameSetup({
  onStartMatch,
}: SingleGameSetupProps) {
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [legs, setLegs] = useState<number>(1);
  const [points, setPoints] = useState<number>(501);
  const [starter, setStarter] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    async function _getPlayers() {
      try {
        const playersData = await getPlayers();
        setPlayers(playersData);
      } catch (error) {
        throw new Error(String(error));
      }
    }

    _getPlayers();
  }, []);

  function handleStartGame() {
    if (!player1 || !player2) {
      alert("Bitte wähle zwei Spieler aus!");
      return;
    }
    if (player1.id === player2.id) {
      alert("Spieler dürfen nicht gleich sein!");
      return;
    }
    onStartMatch({
      tournamentId: null,
      player1: player1,
      player2: player2,
      points,
      legs,
      starter: starter || player1,
      mode: MatchMode.SINGLE_MATCH,
      winner: null,
    });
  }

  return (
    <Container>
      <Typography variant="h3" textAlign="center" mb={4}>
        SingleGameSetup
      </Typography>

      <Stack spacing={2} direction="row" alignItems="center" mb={2}>
        <Select
          value={player1?.id || ""}
          onChange={(e) =>
            setPlayer1(
              players.find((player) => player.id === Number(e.target.value)) ||
                null
            )
          }
        >
          {players.map((player) => (
            <MenuItem key={player.id} value={player.id}>
              {player.name}
            </MenuItem>
          ))}
        </Select>
        <Typography>vs</Typography>
        <Select
          value={player2?.id || ""}
          onChange={(e) =>
            setPlayer2(
              players.find((player) => player.id === Number(e.target.value)) ||
                null
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
        <Stack spacing={2} direction="column" mb={2}>
          <ToggleButtonGroup
            value={starter?.id || ""}
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

      <Stack spacing={2} direction="column" mb={2}>
        <TextField
          label="Anzahl gewonnene Legs"
          type="number"
          value={legs}
          inputProps={{ min: 1 }}
          onChange={(e) => {
            const value = Math.max(1, Number(e.target.value));
            setLegs(value);
          }}
        />
      </Stack>

      <Stack spacing={2} direction="column" mb={2}>
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

      <Stack spacing={2} direction="column">
        <Button
          variant="contained"
          onClick={handleStartGame}
          disabled={!starter}
        >
          Starten
        </Button>
      </Stack>
    </Container>
  );
}
