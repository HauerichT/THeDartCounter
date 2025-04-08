import { useEffect, useState } from "react";
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
import { Player } from "../../interfaces/playerInterfaces";
import { getPlayers } from "../../apis/playersApi";
import { postCreateTournament } from "../../apis/tournamentApi";
import { CustomDialogComponent, useDialog } from "../CustomDialogComponent";
import { TournamentMode } from "../../interfaces/tournamentInterfaces";

export default function TournamentSetupComponent() {
  const [tournamentPlayers, setTournamentPlayers] = useState<Player[]>([]);
  const [tournamentMode, setTournamentMode] = useState<TournamentMode>(TournamentMode.KO);
  const [pointsGroupStage, setPointsGroup] = useState<number>(301);
  const [pointsSemifinalStage, setPointsSemifinal] = useState<number>(501);
  const [pointsFinalStage, setPointsFinal] = useState<number>(501);
  const [legsGroupStage, setLegsGroup] = useState<number>(1);
  const [legsSemifinalStage, setLegsSemifinal] = useState<number>(1);
  const [legsFinalStage, setLegsFinal] = useState<number>(2);
  const [legsLiga, setLegsLiga] = useState<number>(1);
  const [pointsLiga, setPointsLiga] = useState<number>(301);
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

  const handleStartTournament = async () => {
    const resCreateTournament = await postCreateTournament({
      players: tournamentPlayers,
      tournamentMode,
      legsLiga,
      pointsLiga,
      pointsGroupStage,
      pointsSemifinalStage,
      pointsFinalStage,
      legsGroupStage,
      legsSemifinalStage,
      legsFinalStage,
    });
    if (!resCreateTournament.success) {
      showDialog(resCreateTournament.message, "error");
    } else {
      showDialog(resCreateTournament.message, "success");
    }
  };

  return (
    <>
      <CustomDialogComponent dialog={dialog} setDialog={setDialog} />
      <Container maxWidth={false}>
        <Stack spacing={1} direction="column" mb={2}>
          <ToggleButtonGroup
            value={tournamentMode}
            exclusive
            onChange={(_e, mode) => {
              if (mode !== null) {
                setTournamentMode(mode);
              }
            }}
          >
            {[TournamentMode.KO, TournamentMode.LIGA].map((value) => (
              <ToggleButton key={value} value={value}>
                {value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
        <Stack spacing={1} direction="column" mb={2}>
          <Typography>Spieler:</Typography>
          <Select
            multiple
            value={tournamentPlayers.map((p) => p.id)}
            fullWidth
            onChange={(e) => {
              const selectedIds = e.target.value as number[];
              const selectedPlayers = players.filter((p) =>
                selectedIds.includes(p.id)
              );
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
        {tournamentMode === TournamentMode.KO ? (
          <>
            <Stack spacing={1} direction="column" mb={2}>
              <Typography>Gruppenphase:</Typography>
              <TextField
                type="number"
                value={legsGroupStage}
                inputProps={{ min: 1 }}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setLegsGroup(value);
                }}
              />
            </Stack>
            <Stack spacing={1} direction="column" mb={2}>
              <ToggleButtonGroup
                value={pointsGroupStage}
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
            <Stack spacing={1} direction="column" mb={2}>
              <Typography>Halbfinalphase:</Typography>
              <TextField
                type="number"
                value={legsSemifinalStage}
                inputProps={{ min: 1 }}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setLegsSemifinal(value);
                }}
              />
            </Stack>
            <Stack spacing={1} direction="column" mb={2}>
              <ToggleButtonGroup
                value={pointsSemifinalStage}
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
            <Stack spacing={1} direction="column" mb={2}>
              <Typography>Finalphase:</Typography>
              <TextField
                type="number"
                value={legsFinalStage}
                inputProps={{ min: 1 }}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setLegsFinal(value);
                }}
              />
            </Stack>
            <Stack spacing={1} direction="column" mb={2}>
              <ToggleButtonGroup
                value={pointsFinalStage}
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
          </>
        ) : (
          <>
            <Stack spacing={1} direction="column" mb={2}>
              <TextField
                type="number"
                value={legsLiga}
                inputProps={{ min: 1 }}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  setLegsLiga(value);
                }}
              />
            </Stack>
            <Stack spacing={1} direction="column" mb={2}>
              <ToggleButtonGroup
                value={pointsLiga}
                exclusive
                onChange={(_e, newPoints) => {
                  if (newPoints !== null) {
                    setPointsLiga(newPoints);
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
          </>
        )}
        <Stack spacing={1} direction="column">
          <Button
            variant="contained"
            onClick={handleStartTournament}
            disabled={
              tournamentMode === TournamentMode.KO
                ? tournamentPlayers.length < 6
                : tournamentPlayers.length < 3
            }
          >
            Erstellen
          </Button>
        </Stack>
      </Container>
    </>
  );
}