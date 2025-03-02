import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function NavbarComponent() {
  const theme = useTheme();

  return (
    <>
      <AppBar
        sx={{ position: "fixed", backgroundColor: theme.palette.primary.dark }}
      >
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: theme.palette.text.secondary,
            }}
          >
            THeDartCounter
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              sx={{ color: theme.palette.text.secondary }}
              component={Link}
              to="/single-game"
            >
              Einzelspiel
            </Button>
            <Button
              sx={{ color: theme.palette.text.secondary }}
              component={Link}
              to="/tournament-overview"
            >
              Turnier
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
