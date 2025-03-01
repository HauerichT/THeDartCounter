import { TextField, IconButton, Box, Grid2 } from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function MatchScoreInputComponent({
  onSubmit,
  onUndo,
  canUndo,
}: {
  onSubmit: (score: number) => void;
  onUndo: () => void;
  canUndo: boolean;
}) {
  const handleScoreInput = () => {
    const input = document.querySelector("#scoreInput") as HTMLInputElement;
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      onSubmit(value);
      input.value = "";
    }
  };

  const handleInputChange = () => {
    const input = document.querySelector("#scoreInput") as HTMLInputElement;
    const value = parseInt(input.value);
    if (isNaN(value)) {
      input.value = "";
    }
  };

  return (
    <Box sx={{ marginTop: "1rem" }}>
      <Grid2
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid2 size={{ xs: 1, sm: 1 }}>
          <IconButton onClick={onUndo} disabled={!canUndo}>
            <ArrowCircleLeftIcon fontSize="large" color="secondary" />
          </IconButton>
        </Grid2>
        <Grid2 size={{ xs: 10, sm: 10 }}>
          <TextField
            fullWidth
            autoFocus
            id="scoreInput"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 180 } }}
            onInput={handleInputChange}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleScoreInput();
              }
            }}
          />
        </Grid2>
        <Grid2 size={{ xs: 1, sm: 1 }}>
          <IconButton onClick={handleScoreInput}>
            <CheckCircleIcon fontSize="large" color="primary" />
          </IconButton>
        </Grid2>
      </Grid2>
    </Box>
  );
}
