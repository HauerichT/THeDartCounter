import { Chip, Container, Divider } from "@mui/material";
import TournamentSetupComponent from "../components/Tournament/TournamentSetupComponent";
import TournamentTableComponent from "../components/Tournament/TournamentTableComponent";

export default function TournamentOverviewPage() {
  return (
    <Container>
      <TournamentSetupComponent />
      <Divider sx={{ marginTop: 10, marginBottom: 2 }}>
        <Chip label="Offene Tuniere" />
      </Divider>
      <TournamentTableComponent />
    </Container>
  );
}
