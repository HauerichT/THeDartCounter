import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useNavigate } from "react-router-dom";
import { getOpenTournaments } from "../../apis/tournamentApi";
import { Tournament } from "../../interfaces/tournamentInterfaces";
import socket from "../../utils/socket";

export default function TournamentsTable() {
  const [openTournaments, setOpenTournaments] = useState<Tournament[]>([]);
  const [waiting, setWaiting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpenTournaments();

    socket.on("tournamentCreated", (newTournament: Tournament) => {
      setOpenTournaments((prevTournaments) => [
        ...prevTournaments,
        newTournament,
      ]);
    });

    socket.on("waitingForSecondBoard", () => {
      setWaiting(true);
    });

    socket.on("startTournament", (tournamentId: number) => {
      setWaiting(false);
      navigate(`/tournament/${tournamentId}`);
    });

    return () => {
      socket.off("tournamentCreated");
      socket.off("waitingForSecondBoard");
      socket.off("startTournament");
    };
  }, [navigate]);

  const fetchOpenTournaments = async () => {
    try {
      const tournaments = await getOpenTournaments();
      setOpenTournaments(tournaments);
    } catch (error) {
      console.error("Fehler beim Abrufen der offenen Turniere:", error);
    }
  };

  const handleJoinTournament = (tournamentId: number) => {
    socket.emit("joinTournament", tournamentId);
  };

  return (
    <Container>
      {openTournaments.length === 0 ? (
        <Typography>Keine offenen Tuniere vorhanden.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tunier-ID</TableCell>
                <TableCell>Spieleranzahl</TableCell>
                <TableCell>Aktion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {openTournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell>{tournament.id}</TableCell>
                  <TableCell>{tournament.players.length}</TableCell>
                  <TableCell>
                    {waiting ? (
                      <CircularProgress size={24} />
                    ) : (
                      <IconButton
                        onClick={() => handleJoinTournament(tournament.id)}
                        disabled={waiting}
                      >
                        <ArrowCircleRightIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
