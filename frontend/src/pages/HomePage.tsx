import { Link } from "react-router-dom";
import { Button, Container, Stack } from "@mui/material";

export default function HomePage() {
  return (
    <Container>
      <Stack spacing={2} direction="column" sx={{ width: "100%" }}>
        <Button
          variant="contained"
          fullWidth
          component={Link}
          to="/single-game"
        >
          Einzelspiel
        </Button>
        <Button
          variant="contained"
          fullWidth
          component={Link}
          to="/tournament-overview"
        >
          Tunier
        </Button>
      </Stack>
    </Container>
  );
}
