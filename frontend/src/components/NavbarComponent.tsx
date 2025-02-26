import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavbarComponent() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >
            THeDartCounter
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} to="/single-game">
              Einzelspiel
            </Button>
            <Button color="inherit" component={Link} to="/tournament-overview">
              Turnier
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}
