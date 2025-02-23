import { Link } from "react-router-dom";
import { Button, Container, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "lightblue",
          marginBottom: "2rem",
        }}
      >
        THeDartCounter
      </Typography>

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
