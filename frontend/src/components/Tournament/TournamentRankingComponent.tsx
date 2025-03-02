import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TournamentGroupStageRanking } from "../../interfaces/tournamentInterfaces";

export default function TournamentRankingComponent({
  ranking,
}: {
  ranking: TournamentGroupStageRanking[];
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
            </TableRow>
          </TableHead>
          <TableBody>
            {ranking.length > 0 ? (
              ranking.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{ranking.indexOf(player) + 1}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.wins}</TableCell>
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
