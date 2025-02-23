import { Container } from "@mui/material";
import TournamentSetup from "../components/Tournament/TournamentSetup";
import OpenTournamentsTable from "../components/Tournament/OpenTournamentsTable";

export default function SingleGame() {
  return (
    <Container>
      <TournamentSetup />
      <OpenTournamentsTable />
    </Container>
  );
}
