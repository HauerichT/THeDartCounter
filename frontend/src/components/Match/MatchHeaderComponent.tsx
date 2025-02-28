import { Box, Grid2, IconButton, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";

export default function MatchHeaderComponent() {
  const handleExitMatch = () => {
    console.log("exit");
  };
  const handleInfoMatch = () => {
    console.log("info");
  };

  return (
    <Box sx={{ marginBottom: "0.5rem" }}>
      <Grid2 container alignItems="center">
        <Grid2 size={{ xs: 1, sm: 1 }} display="flex" justifyContent="center">
          <IconButton onClick={handleExitMatch}>
            <CancelIcon fontSize="large" />
          </IconButton>
        </Grid2>

        <Grid2 size={{ xs: 10, sm: 10 }} display="flex" justifyContent="center">
          <Typography variant="h6" fontWeight="bold">
            Modus: First to 3 Legs
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 1, sm: 1 }} display="flex" justifyContent="center">
          <IconButton onClick={handleInfoMatch}>
            <InfoIcon fontSize="large" />
          </IconButton>
        </Grid2>
      </Grid2>
    </Box>
  );
}
