import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getOpenTournaments } from "../../apis/tournamentApi";
import socket from "../../utils/socket";
import { Tournament } from "../../interfaces/tournamentInterface";

export default function OpenTournamentsTable() {
  const [openTournaments, setOpenTournaments] = useState<Tournament[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOpenTournaments() {
      try {
        const tournaments = await getOpenTournaments();
        setOpenTournaments(tournaments);
      } catch (error) {
        console.error("Fehler beim Abrufen der offenen Turniere:", error);
      }
    }

    fetchOpenTournaments();

    socket.on("tournamentCreated", (newTournament: Tournament) => {
      setOpenTournaments((prevTournaments) => [
        ...prevTournaments,
        newTournament,
      ]);
    });

    socket.on("waitingForOpponent", () => {
      setWaiting(true);
    });

    socket.on("startTournament", (tournamentId: number) => {
      setWaiting(false);
      navigate(`/tournament/${tournamentId}`);
    });

    return () => {
      socket.off("tournamentCreated");
      socket.off("waitingForOpponent");
      socket.off("startTournament");
    };
  }, [navigate]);

  const handleJoinTournament = (tournamentId: number) => {
    socket.emit("joinTournament", tournamentId);
  };

  return (
    <Container>
      <Typography variant="h4" textAlign="center" mb={4}>
        Offene Turniere
      </Typography>
      {waiting ? (
        <Box textAlign="center">
          <Typography variant="h5">Warten auf zweiten Spieler...</Typography>
        </Box>
      ) : (
        <List>
          {openTournaments.map((tournament) => (
            <ListItem
              key={tournament.id}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText
                primary={`Turnier ID: ${tournament.id}`}
                secondary={`Spieler: ${tournament.players.length}`}
              />
              <Button
                variant="contained"
                onClick={() => handleJoinTournament(tournament.id)}
              >
                Beitreten
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}
