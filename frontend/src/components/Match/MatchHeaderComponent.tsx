import { Box, Grid2, Typography } from "@mui/material";

export default function MatchHeaderComponent({ legs }: { legs: number }) {
  return (
    <Box sx={{ marginBottom: "0.5rem" }}>
      <Grid2 container alignItems="center">
        <Grid2 size={{ xs: 12, sm: 12 }} display="flex" justifyContent="center">
          <Typography variant="h6" fontWeight="bold">
            Modus: First to {legs} Legs
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
}
