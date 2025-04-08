import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TournamentRanking } from "../../interfaces/tournamentInterfaces";

export default function TournamentRankingComponent({
  ranking,
}: {
  ranking: TournamentRanking[];
}) {
  return (
    <Container maxWidth={false}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Platz</TableCell>
              <TableCell>Spieler</TableCell>
              <TableCell>Siege</TableCell>
              <TableCell>Verbleibende Punkte</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.length > 0 ? (
              ranking.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{ranking.indexOf(player) + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.wins}</TableCell>
                  <TableCell>{player.rankingScore}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Keine Daten vorhanden!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
