import { Container, Typography } from "@mui/material";

export default function NotFoundPage() {
  return (
    <Container maxWidth={false} sx={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        404 - Seite nicht gefunden
      </Typography>
      <Typography variant="body1">
        Die Seite, die Sie suchen, existiert nicht.
      </Typography>
    </Container>
  );
}
