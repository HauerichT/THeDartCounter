import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { MatchData } from "../../interfaces/matchInterfaces";

export default function TournamentMatchesWithResultComponent({
  matchesWithResult,
}: {
  matchesWithResult: MatchData[];
}) {
  return (
    <Container maxWidth={false}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Spieler 1</TableCell>
              <TableCell>Spieler 2</TableCell>
              <TableCell>Gewinner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matchesWithResult.length > 0 ? (
              matchesWithResult.map((match) => (
                <TableRow key={match.player1.id + "-" + match.player2.id}>
                  <TableCell>{match.player1.name}</TableCell>
                  <TableCell>{match.player2.name}</TableCell>
                  <TableCell>
                    {match.winner ? match.winner.name : "-"}
                  </TableCell>
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
