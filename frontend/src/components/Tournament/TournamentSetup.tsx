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
import { Player } from "../../interfaces/playerInterface";
import { getPlayers } from "../../apis/playersApi";
import { postCreateTournament } from "../../apis/tournamentApi";

export default function TournamentSetup() {
  const [tournamentPlayers, setTournamentPlayers] = useState<Player[]>([]);
  const [pointsGroup, setPointsGroup] = useState<number>(301);
  const [pointsSemifinal, setPointsSemifinal] = useState<number>(501);
  const [pointsFinal, setPointsFinal] = useState<number>(501);
  const [legsGroup, setLegsGroup] = useState<number>(1);
  const [legsSemifinal, setLegsSemifinal] = useState<number>(1);
  const [legsFinal, setLegsFinal] = useState<number>(2);
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

  const handleStartTournament = async () => {
    if (!tournamentPlayers) {
      alert("Bitte wähle mindestens einen Spieler aus!");
      return;
    }
    if (tournamentPlayers.length < 6) {
      alert("Bitte wähle mindestens sechs Spieler aus!");
      return;
    }
    await postCreateTournament({
      players: tournamentPlayers,
      pointsGroup,
      pointsSemifinal,
      pointsFinal,
      legsGroup,
      legsSemifinal,
      legsFinal,
    });
  };

  return (
    <Container>
      <Typography variant="h3" textAlign="center" mb={4}>
        Tunier erstellen
      </Typography>

      <Stack spacing={2} direction="row" alignItems="center" mb={2}>
        <Select
          multiple
          value={tournamentPlayers.map((p) => p.id)} // Extracting IDs
          onChange={(e) => {
            const selectedIds = e.target.value as number[]; // Get selected player IDs
            const selectedPlayers = players.filter((p) =>
              selectedIds.includes(p.id)
            ); // Map IDs to player objects
            setTournamentPlayers(selectedPlayers);
          }}
          renderValue={(selected) =>
            players
              .filter((p) => selected.includes(p.id))
              .map((p) => p.name)
              .join(", ")
          }
        >
          {players.map((player) => (
            <MenuItem key={player.id} value={player.id}>
              {player.name}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack spacing={2} direction="column" mb={2}>
        <TextField
          label="Anzahl Legs Gruppenphase"
          type="number"
          value={legsGroup}
          inputProps={{ min: 1 }}
          onChange={(e) => {
            const value = Math.max(1, Number(e.target.value));
            setLegsGroup(value);
          }}
        />
      </Stack>
      <Stack spacing={2} direction="column" mb={2}>
        <ToggleButtonGroup
          value={pointsGroup}
          exclusive
          onChange={(_e, newPoints) => {
            if (newPoints !== null) {
              setPointsGroup(newPoints);
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
      <Stack spacing={2} direction="column" mb={2}>
        <TextField
          label="Anzahl Legs Halbfinalphase"
          type="number"
          value={legsSemifinal}
          inputProps={{ min: 1 }}
          onChange={(e) => {
            const value = Math.max(1, Number(e.target.value));
            setLegsSemifinal(value);
          }}
        />
      </Stack>
      <Stack spacing={2} direction="column" mb={2}>
        <ToggleButtonGroup
          value={pointsSemifinal}
          exclusive
          onChange={(_e, newPoints) => {
            if (newPoints !== null) {
              setPointsSemifinal(newPoints);
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
      <Stack spacing={2} direction="column" mb={2}>
        <TextField
          label="Anzahl Legs Finalphase"
          type="number"
          value={legsFinal}
          inputProps={{ min: 1 }}
          onChange={(e) => {
            const value = Math.max(1, Number(e.target.value));
            setLegsFinal(value);
          }}
        />
      </Stack>
      <Stack spacing={2} direction="column" mb={2}>
        <ToggleButtonGroup
          value={pointsFinal}
          exclusive
          onChange={(_e, newPoints) => {
            if (newPoints !== null) {
              setPointsFinal(newPoints);
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
          onClick={handleStartTournament}
          disabled={!tournamentPlayers}
        >
          Erstellen
        </Button>
      </Stack>
    </Container>
  );
}
