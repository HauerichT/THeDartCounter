import { Link } from "react-router-dom";
import { Button, Container, Grid2 } from "@mui/material";

export default function HomePage() {
  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2rem",
      }}
    >
      <Grid2 container spacing={2} sx={{ height: "100%", width: "100%" }}>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: "50%" }}
            component={Link}
            to="/single-game"
            color="primary"
          >
            Einzelspiel
          </Button>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: "50%" }}
            component={Link}
            to="/tournament-overview"
            color="secondary"
          >
            Tunier
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
}
