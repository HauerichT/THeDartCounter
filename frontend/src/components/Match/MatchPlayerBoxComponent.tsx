import { Box, Grid2, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Player } from "../../interfaces/playerInterfaces";

export default function MatchPlayerBoxComponent({
  player,
  playerLegs,
  playerPoints,
  playerDarts,
  playerScoreTotal,
  playerLastScore,
  isActive,
}: {
  player: Player;
  playerLegs: number;
  playerPoints: number;
  playerDarts: number;
  playerScoreTotal: number;
  playerLastScore: number | null;
  isActive: boolean;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: "1rem",
        backgroundColor: isActive ? theme.palette.primary.light : "lightgrey",
      }}
    >
      <Grid2
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid2
          size={{ xs: 12, sm: 3 }}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          <Stack spacing={1} alignItems={{ xs: "center", sm: "flex-start" }}>
            <Typography variant="h6">{player.name}</Typography>
            <Typography variant="body2">
              Gewonnene Legs: {playerLegs}
            </Typography>
          </Stack>
        </Grid2>

        <Grid2
          size={{ xs: 12, sm: 6 }}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "3rem", sm: "5rem" },
              fontWeight: "800",
            }}
          >
            {playerPoints}
          </Typography>
        </Grid2>

        <Grid2
          size={{ xs: 12, sm: 3 }}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          <Stack spacing={1} alignItems={{ xs: "center", sm: "flex-end" }}>
            <Typography variant="body2">
              Letzte Aufnahme:{" "}
              {playerLastScore !== null ? playerLastScore : "-"}
            </Typography>
            <Typography variant="body2">
              Ø:{" "}
              {playerDarts > 0
                ? (playerScoreTotal / playerDarts).toFixed(2)
                : "-"}
            </Typography>
            <Typography variant="body2">Aufnahmen: {playerDarts}</Typography>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}
